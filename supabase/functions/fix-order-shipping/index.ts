import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to identify if an item is shipping
function isShippingItem(itemName: string): boolean {
  const lowerName = itemName.toLowerCase();
  return (
    lowerName.includes('shipping') ||
    lowerName.includes('delivery') ||
    lowerName.includes('intelcom') ||
    lowerName.includes('whiz') ||
    lowerName.includes('toronto') ||
    lowerName.includes('gta') ||
    lowerName.includes('canada wide') ||
    lowerName.includes('standard')
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('Starting order shipping migration...');

    // Fetch all orders
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, items, subtotal, shipping, tax, total');

    if (fetchError) throw fetchError;

    console.log(`Found ${orders?.length || 0} orders to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const order of orders || []) {
      const items = order.items as Array<{ name: string; price: number; quantity: number }>;
      
      // Separate product items from shipping items
      const productItems = items.filter(item => !isShippingItem(item.name));
      const shippingItems = items.filter(item => isShippingItem(item.name));

      // Calculate correct values
      const correctSubtotal = productItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      const correctShipping = shippingItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      // Check if this order needs updating
      const needsUpdate = 
        Math.abs(correctSubtotal - order.subtotal) > 0.01 || 
        Math.abs(correctShipping - order.shipping) > 0.01;

      if (needsUpdate) {
        console.log(`Updating order ${order.order_number}:`, {
          oldSubtotal: order.subtotal,
          newSubtotal: correctSubtotal,
          oldShipping: order.shipping,
          newShipping: correctShipping,
          shippingItems: shippingItems.map(i => i.name)
        });

        // Update the order with corrected values
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            items: productItems, // Store only product items
            subtotal: correctSubtotal,
            shipping: correctShipping,
          })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Error updating order ${order.order_number}:`, updateError);
        } else {
          updatedCount++;
        }
      } else {
        skippedCount++;
      }
    }

    // Unarchive all orders
    console.log('Unarchiving all orders...');
    const { error: unarchiveError } = await supabase
      .from('orders')
      .update({ archived_at: null })
      .not('archived_at', 'is', null);

    if (unarchiveError) {
      console.error('Error unarchiving orders:', unarchiveError);
    }

    const result = {
      success: true,
      totalOrders: orders?.length || 0,
      updated: updatedCount,
      skipped: skippedCount,
      unarchived: true,
    };

    console.log('Migration complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
