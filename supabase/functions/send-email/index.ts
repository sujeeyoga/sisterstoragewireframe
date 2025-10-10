import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { OrderConfirmationEmail } from "./_templates/order-confirmation.tsx";
import { ShippingNotificationEmail } from "./_templates/shipping-notification.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "order_confirmation" | "shipping_notification";
  to: string;
  data: OrderConfirmationData | ShippingNotificationData;
}

interface OrderConfirmationData {
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
          React.createElement(OrderConfirmationEmail, orderData)
        );
        subject = `Order Confirmation - Order #${orderData.orderNumber}`;
        break;

      case "shipping_notification":
        const shippingData = data as ShippingNotificationData;
        html = await renderAsync(
          React.createElement(ShippingNotificationEmail, shippingData)
        );
        subject = `Your Order Has Shipped - Order #${shippingData.orderNumber}`;
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "Sister Storage <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

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
