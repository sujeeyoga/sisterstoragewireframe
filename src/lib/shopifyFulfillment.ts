import { functionsClient } from '@/integrations/supabase/functionsClient';

interface FulfillShopifyOrderOptions {
  orderNumber: string;
  trackingNumber: string;
  carrier?: string;
  notifyCustomer?: boolean;
}

interface FulfillResult {
  success: boolean;
  alreadyFulfilled?: boolean;
  notFound?: boolean;
  error?: string;
}

export async function fulfillShopifyOrder({
  orderNumber,
  trackingNumber,
  carrier = 'Other',
  notifyCustomer = false,
}: FulfillShopifyOrderOptions): Promise<FulfillResult> {
  if (!orderNumber || !trackingNumber) {
    return { success: false, error: 'Order number and tracking number are required' };
  }

  try {
    const { data, error } = await functionsClient.functions.invoke('shopify-fulfill-order', {
      body: {
        orderNumber,
        trackingNumber,
        trackingCompany: carrier,
        notifyCustomer,
      },
    });

    if (error) {
      console.error('Shopify fulfillment function error:', error);
      return { success: false, error: error.message || 'Failed to sync fulfillment to Shopify' };
    }

    if (data?.ok && data?.skipped) {
      return { success: true, alreadyFulfilled: true };
    }

    if (data?.ok) {
      return { success: true };
    }

    if (data?.error === 'Shopify order not found' || data?.notFound) {
      return { success: false, notFound: true, error: data?.error || 'Shopify order not found' };
    }

    return { success: false, error: data?.error || 'Unknown Shopify fulfillment error' };
  } catch (err: any) {
    console.error('Unexpected error syncing fulfillment to Shopify:', err);
    return { success: false, error: err?.message || 'Unexpected error' };
  }
}
