import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.23.8";
import { getTrackingUrl } from "../_shared/tracking-url.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShippingNotificationRequest {
  orderId: string | number;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier?: string;
  source?: 'stripe' | 'woocommerce';
  items?: Array<{
    name: string;
    quantity: number;
    price?: number;
  }>;
}

const ShippingNotificationSchema = z.object({
  orderId: z.union([z.string().min(1), z.number()]),
  customerEmail: z.string().email(),
  customerName: z.string().trim().min(1).default("Valued Customer"),
  orderNumber: z.string().trim().min(1),
  trackingNumber: z.string().trim().min(5).max(200),
  carrier: z.string().trim().min(1).max(100),
  source: z.enum(["stripe", "woocommerce"]),
  items: z.array(z.object({
    name: z.string().default("Item"),
    quantity: z.coerce.number().positive().default(1),
    price: z.coerce.number().optional(),
  })).optional().default([]),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = ShippingNotificationSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid shipping notification", fields: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const {
      orderId,
      customerEmail,
      customerName,
      orderNumber,
      trackingNumber,
      carrier,
      source,
      items = [],
    }: ShippingNotificationRequest = parsed.data;

    console.log("Sending shipping notification for order:", orderId);

    // Generate items list HTML
    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br/>
          <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
        </td>
        ${item.price ? `<td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          $${item.price.toFixed(2)}
        </td>` : ''}
      </tr>
    `
      )
      .join("");

    const emailResponse = await resend.emails.send({
      from: "Sister Storage <noreply@sisterstorage.com>",
      to: [customerEmail],
      replyTo: ["sisterstorageinc@gmail.com"],
      subject: `Your order #${orderNumber} has shipped!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Order Has Shipped</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0;">
                  📦 Your Order Has Shipped!
                </h1>
              </div>

              <!-- Main Card -->
              <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Greeting -->
                <div style="padding: 32px 32px 24px 32px;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                    Hi ${customerName},
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                    Great news! Your order <strong>#${orderNumber}</strong> has been shipped and is on its way to you.
                  </p>
                </div>

                <!-- Tracking Info -->
                <div style="background: #f3f4f6; padding: 24px 32px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                  <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Tracking Information
                  </h2>
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6b7280; font-size: 14px;">Tracking Number:</span><br/>
                    <span style="color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                      ${trackingNumber}
                    </span>
                  </div>
                  <div style="margin-bottom: 20px;">
                    <span style="color: #6b7280; font-size: 14px;">Carrier:</span><br/>
                    <span style="color: #1f2937; font-size: 16px; font-weight: 500;">
                      ${carrier || 'Shipping Carrier'}
                    </span>
                  </div>
                   <a href="${getTrackingUrl(carrier || '', trackingNumber)}" 
                     style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">
                    Track Your Package
                  </a>
                </div>

                <!-- Order Items -->
                <div style="padding: 24px 32px;">
                  <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                    Order Items
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${itemsHtml}
                  </table>
                </div>

                <!-- Order Details CTA -->
                <div style="padding: 0 32px 24px 32px; text-align: center;">
                  <a href="https://sisterstorage.com/customer/orders/${encodeURIComponent(String(orderId))}?source=${source === 'woocommerce' ? 'woocommerce' : 'stripe'}"
                     style="display: inline-block; background: #ec4899; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    View Your Order Details
                  </a>
                </div>

                <!-- Footer Message -->
                <div style="padding: 0 32px 32px 32px;">
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                    If you have any questions about your order, please don't hesitate to contact us. We're here to help!
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
                  Thank you for shopping with Sister Storage!
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Sister Storage. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error || !emailResponse.data?.id) {
      throw new Error(emailResponse.error?.message || "Email provider did not accept the shipping notification");
    }

    console.log("Shipping notification sent successfully:", emailResponse);

    // Log email to email_logs table
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    try {
      await supabase
        .from("email_logs")
        .insert({
          order_id: String(orderId),
          recipient_email: customerEmail,
          email_type: "shipping_notification",
          subject: `Your order #${orderNumber} has shipped!`,
          sent_successfully: true,
          email_data: {
            orderNumber,
            trackingNumber,
            carrier,
            items
          },
        });
      
      console.log("Email log created successfully for order:", orderId);
    } catch (logError) {
      console.error("Failed to log email:", logError);
    }

    // Update order to mark notification as sent (background task)
    const updateTask = async () => {
      const tableName = source === "woocommerce" ? "woocommerce_orders" : "orders";
      const { error: orderError } = await supabase
        .from(tableName)
        .update({ 
          shipping_notification_sent_at: new Date().toISOString() 
        })
        .eq("id", String(orderId));

      if (orderError) {
        console.error(`Failed to mark ${source} order ${orderId} as notified:`, orderError);
      }
    };

    EdgeRuntime.waitUntil(updateTask());

    return new Response(JSON.stringify({ success: true, id: emailResponse.data.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending shipping notification:", error);
    
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
