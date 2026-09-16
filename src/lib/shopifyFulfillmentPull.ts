import { supabase } from '@/integrations/supabase/client';

export interface PullShopifyResult {
  success: boolean;
  notFound?: boolean;
  noTracking?: boolean;
  error?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string | null;
  fulfilledAt?: string | null;
  shopifyOrderId?: string;
}

export interface PullableOrder {
  id: number | string;
  source?: 'woocommerce' | 'stripe';
  order_number?: string | number | null;
  tracking_number?: string | null;
}

export async function pullShopifyFulfillment(
  orderNumber: string
): Promise<PullShopifyResult> {
  try {
    const { data, error } = await supabase.functions.invoke('shopify-pull-fulfillment', {
      body: { orderNumber },
    });

    if (error) {
      console.error('shopify-pull-fulfillment invoke error:', error);
      return { success: false, error: error.message || 'Network error' };
    }

    return data as PullShopifyResult;
  } catch (e: any) {
    console.error('pullShopifyFulfillment exception:', e);
    return { success: false, error: e?.message || 'Unexpected error' };
  }
}

function tableNameForOrder(order: PullableOrder): string {
  return typeof order.id === 'string' ? 'orders' : 'woocommerce_orders';
}

function orderNumberFor(order: PullableOrder): string {
  const raw = order.order_number ?? order.id;
  return String(raw ?? '').replace(/^#/, '');
}

export async function applyShopifyFulfillmentToOrder(
  order: PullableOrder
): Promise<PullShopifyResult> {
  const orderNumber = orderNumberFor(order);
  if (!orderNumber) {
    return { success: false, error: 'Order has no order number to look up' };
  }

  const result = await pullShopifyFulfillment(orderNumber);
  if (!result.success) return result;

  const table = tableNameForOrder(order);
  const update: Record<string, any> = {
    tracking_number: result.trackingNumber,
    carrier_name: result.carrier,
    fulfillment_status: 'fulfilled',
    fulfilled_at: result.fulfilledAt || new Date().toISOString(),
  };

  // Only include optional columns if they exist in the table. If the migration adding
  // these columns has not yet run, a table error would block the whole sync. We try the
  // full update first and fall back to the safe subset on a column-not-found error.
  try {
    const { error } = await supabase.from(table).update(update).eq('id', order.id);
    if (error) throw error;
    return result;
  } catch (firstError: any) {
    const message = firstError?.message || String(firstError);
    if (message.toLowerCase().includes('column') && message.toLowerCase().includes('does not exist')) {
      const safeUpdate: Record<string, any> = {};
      for (const key of Object.keys(update)) {
        if (key !== 'tracking_url' && key !== 'shopify_fulfillment_synced_at' && key !== 'shopify_order_id') {
          safeUpdate[key] = update[key];
        }
      }
      const { error } = await supabase.from(table).update(safeUpdate).eq('id', order.id);
      if (error) {
        console.error('applyShopifyFulfillmentToOrder fallback update failed:', error);
        return { success: false, error: error.message };
      }
      return result;
    }
    console.error('applyShopifyFulfillmentToOrder update failed:', firstError);
    return { success: false, error: message };
  }
}
