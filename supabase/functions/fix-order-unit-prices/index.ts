import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderIds } = await req.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      throw new Error("orderIds array is required");
    }

    console.log(`Fixing unit prices for ${orderIds.length} orders:`, orderIds);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get orders with their current items
    const { data: orders, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, items, total, tax, shipping")
      .in("id", orderIds);

    if (fetchError) throw fetchError;

    const updates = [];

    for (const order of orders) {
      console.log(`Processing order ${order.order_number}`);
      
      // Fix each item: calculate unit price from stored total
      const fixedItems = order.items.map((item: any) => {
        const quantity = item.quantity || 1;
        // The stored "price" is actually the line total, so divide by quantity
        const correctUnitPrice = Number((item.price / quantity).toFixed(2));
        
        console.log(`  Item: ${item.name}, stored price: ${item.price}, quantity: ${quantity}, correct unit: ${correctUnitPrice}`);
        
        return {
          ...item,
          price: correctUnitPrice,
        };
      });

      updates.push({
        id: order.id,
        items: fixedItems,
      });
    }

    // Update all orders with fixed prices and set status back to completed
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          items: update.items,
          status: "completed"
        })
        .eq("id", update.id);

      if (updateError) {
        console.error(`Error updating order ${update.id}:`, updateError);
      } else {
        console.log(`✅ Fixed order ${update.id}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fixed unit prices for ${orders.length} orders`,
        orders: orders.map(o => o.order_number),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fixing order prices:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
