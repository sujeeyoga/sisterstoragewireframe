import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { OrderConfirmationEmail } from "./_templates/order-confirmation.tsx";
import { ShippingNotificationEmail } from "./_templates/shipping-notification.tsx";
import { AdminWelcomeEmail } from "./_templates/admin-welcome.tsx";
import { AdminPromotionEmail } from "./_templates/admin-promotion.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "order_confirmation" | "shipping_notification" | "admin_welcome" | "admin_promotion";
  to: string;
  data: OrderConfirmationData | ShippingNotificationData | AdminWelcomeData | AdminPromotionData;
}

interface OrderConfirmationData {
  orderId?: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  carrierCost?: number;
  tariffFees?: number;
  customSubject?: string;
  customMessage?: string;
}

interface ShippingNotificationData {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface AdminWelcomeData {
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

interface AdminPromotionData {
  email: string;
  loginUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    console.log(`Processing ${type} email for ${to}`);

    let html: string;
    let subject: string;

    switch (type) {
      case "order_confirmation":
        const orderData = data as OrderConfirmationData;
        html = await renderAsync(
          React.createElement(OrderConfirmationEmail, {
            ...orderData,
            customMessage: orderData.customMessage,
          })
        );
        subject = orderData.customSubject || `Your Sister Storage Order #${orderData.orderNumber}`;
        break;

      case "shipping_notification":
        const shippingData = data as ShippingNotificationData;
        html = await renderAsync(
          React.createElement(ShippingNotificationEmail, shippingData)
        );
        subject = `Your Order Has Shipped - Order #${shippingData.orderNumber}`;
        break;

      case "admin_welcome":
        const adminData = data as AdminWelcomeData;
        html = await renderAsync(
          React.createElement(AdminWelcomeEmail, adminData)
        );
        subject = `Welcome to Sister Storage Admin Panel`;
        break;

      case "admin_promotion":
        const promotionData = data as AdminPromotionData;
        html = await renderAsync(
          React.createElement(AdminPromotionEmail, promotionData)
        );
        subject = `Admin Access Granted - Sister Storage`;
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "Sister Storage <sisterstorageinc@gmail.com>",
      to: [to],
      bcc: type === "order_confirmation" ? ["sisterstorageinc@gmail.com"] : undefined,
      replyTo: ["sisterstorageinc@gmail.com"],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email send to email_logs table (only for order confirmations)
    if (type === "order_confirmation") {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const orderData = data as OrderConfirmationData;
        await supabaseAdmin
          .from("email_logs")
          .insert({
            order_id: orderData.orderId || null,
            recipient_email: to,
            email_type: type,
            subject: subject,
            sent_successfully: true,
            email_data: data,
          });
        
        console.log("Email log created successfully" + (orderData.orderId ? ` with order_id: ${orderData.orderId}` : ''));
      } catch (logError) {
        console.error("Failed to log email:", logError);
        // Don't fail the request if logging fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.data?.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);

    // Log failed email attempt
    try {
      const { type, to, data } = await req.json();
      if (type === "order_confirmation") {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const orderData = data as OrderConfirmationData;
        await supabaseAdmin
          .from("email_logs")
          .insert({
            order_id: orderData?.orderId || null,
            recipient_email: to,
            email_type: type,
            sent_successfully: false,
            error_message: error.message,
            email_data: data,
          });
      }
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
