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

    console.log(`Flagging ${orderIds.length} orders for review:`, orderIds);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update orders to pending_review status
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "pending_review" })
      .in("id", orderIds)
      .select("id, order_number, customer_name, customer_email, status, total");

    if (error) throw error;

    console.log(`Successfully flagged ${data.length} orders for review`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Flagged ${data.length} orders for review`,
        orders: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error flagging orders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
