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
    console.log("Starting backfill of missing fulfilled_at timestamps");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find orders where fulfillment_status is 'fulfilled' but fulfilled_at is NULL
    const { data: ordersNeedingFix, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, fulfillment_status, fulfilled_at, updated_at")
      .eq("fulfillment_status", "fulfilled")
      .is("fulfilled_at", null);

    if (fetchError) throw fetchError;

    console.log(`Found ${ordersNeedingFix?.length || 0} orders needing fulfilled_at backfill`);

    if (!ordersNeedingFix || ordersNeedingFix.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No orders need backfilling",
          count: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Update each order to set fulfilled_at to updated_at (best approximation)
    const updates = [];
    for (const order of ordersNeedingFix) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ fulfilled_at: order.updated_at })
        .eq("id", order.id);

      if (updateError) {
        console.error(`Error updating order ${order.order_number}:`, updateError);
        updates.push({ order_number: order.order_number, success: false, error: updateError.message });
      } else {
        console.log(`✅ Backfilled fulfilled_at for order ${order.order_number}`);
        updates.push({ order_number: order.order_number, success: true });
      }
    }

    const successCount = updates.filter(u => u.success).length;
    const failCount = updates.filter(u => !u.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Backfilled ${successCount} orders, ${failCount} failed`,
        total: ordersNeedingFix.length,
        successCount,
        failCount,
        updates,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error backfilling fulfilled_at timestamps:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
