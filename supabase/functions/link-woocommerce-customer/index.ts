// Admin-only edge function to manually link WooCommerce customers to auth users
// Used for orphaned WooCommerce customer records that couldn't be auto-matched by email

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LinkRequest {
  woocommerce_customer_id: number;
  user_id: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: LinkRequest = await req.json();
    const { woocommerce_customer_id, user_id } = body;

    if (!woocommerce_customer_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: woocommerce_customer_id and user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the target user exists
    const { data: targetUser, error: targetUserError } = await supabase.auth.admin.getUserById(user_id);
    
    if (targetUserError || !targetUser) {
      return new Response(
        JSON.stringify({ error: `User ${user_id} not found` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the WooCommerce customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from("woocommerce_customers")
      .select("id, email, user_id")
      .eq("id", woocommerce_customer_id)
      .single();

    if (fetchError || !existingCustomer) {
      return new Response(
        JSON.stringify({ error: `WooCommerce customer ${woocommerce_customer_id} not found` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already linked
    if (existingCustomer.user_id === user_id) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Customer is already linked to this user",
          customer: existingCustomer 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Link the customer to the user
    const { data: updatedCustomer, error: updateError } = await supabase
      .from("woocommerce_customers")
      .update({ user_id })
      .eq("id", woocommerce_customer_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to link customer: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Admin ${user.email} linked WooCommerce customer ${woocommerce_customer_id} to user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Customer successfully linked to user",
        customer: updatedCustomer,
        linked_user_email: targetUser.user.email
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});