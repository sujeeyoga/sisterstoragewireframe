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
    const { orderId, subject, customMessage, customerName } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    console.log(`Resending confirmation email for order: ${orderId}`);

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      throw new Error(`Order not found: ${orderId}`);
    }

    console.log(`Found order: ${order.order_number} for ${order.customer_email}`);

    // Parse items
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : order.shipping_address;

    // Prepare email data
    const emailData = {
      type: "order_confirmation",
      to: order.customer_email,
      data: {
        customerName: customerName || order.customer_name || shippingAddress.name || "Valued Customer",
        orderNumber: order.order_number,
        orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: items.map((item: any) => ({
          name: item.name || item.description || "Product",
          quantity: item.quantity || 1,
          price: (item.amount_total || item.price || 0) / 100
        })),
        subtotal: (order.subtotal || 0) / 100,
        shipping: (order.shipping_cost || 0) / 100,
        tax: (order.tax || 0) / 100,
        total: (order.total || 0) / 100,
        shippingAddress: shippingAddress,
        customSubject: subject,
        customMessage: customMessage
      }
    };

    console.log("Invoking send-email function with data:", JSON.stringify(emailData, null, 2));

    // Send the email
    const { data: emailResult, error: emailError } = await supabaseAdmin.functions.invoke(
      "send-email",
      {
        body: emailData
      }
    );

    if (emailError) {
      console.error("Failed to send email:", emailError);
      throw emailError;
    }

    console.log("Email sent successfully:", emailResult);

    // Log the email send to email_logs table
    const { error: logError } = await supabaseAdmin
      .from("email_logs")
      .insert({
        order_id: orderId,
        recipient_email: order.customer_email,
        email_type: "order_confirmation",
        subject: subject || `Your Sister Storage Order #${order.order_number}`,
        sent_successfully: true,
        email_data: emailData,
      });

    if (logError) {
      console.error("Failed to log email:", logError);
      // Don't fail the request if logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Confirmation email resent to ${order.customer_email}`,
        emailResult 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in resend-order-confirmation:", error);

    // Log the failed email attempt
    try {
      const { orderId } = await req.json();
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabaseAdmin
        .from("email_logs")
        .insert({
          order_id: orderId,
          recipient_email: "",
          email_type: "order_confirmation",
          sent_successfully: false,
          error_message: error.message,
        });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
