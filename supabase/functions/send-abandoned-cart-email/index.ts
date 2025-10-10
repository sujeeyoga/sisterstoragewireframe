import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AbandonedCartRequest {
  email: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  sessionId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, cartItems, subtotal, sessionId }: AbandonedCartRequest = await req.json();

    console.log("Processing abandoned cart for:", email);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save abandoned cart to database
    const { data: abandonedCart, error: dbError } = await supabase
      .from("abandoned_carts")
      .insert({
        email,
        cart_items: cartItems,
        subtotal,
        session_id: sessionId,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log("Abandoned cart saved:", abandonedCart.id);

    // Generate cart items HTML
    const cartItemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 10px;">` : ''}
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${item.price.toFixed(2)}
        </td>
      </tr>
    `).join('');

    // Send abandoned cart email
    const emailResponse = await resend.emails.send({
      from: "Sister Storage <onboarding@resend.dev>",
      to: [email],
      subject: "You left items in your cart! 💝",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FF69B4, #FFB6C1); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Don't forget your items! 🛍️</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hi there! 👋
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                You left some beautiful items in your cart at Sister Storage. We saved them for you!
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <thead>
                  <tr style="background: #f9f9f9;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartItemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px;">
                      Subtotal:
                    </td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #FF69B4;">
                      $${subtotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || 'https://your-site.com'}/checkout" 
                   style="display: inline-block; background: linear-gradient(135deg, #FF69B4, #FFB6C1); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Complete Your Purchase
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
                Questions? We're here to help!<br>
                Contact us anytime at support@sisterstorage.com
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>Sister Storage • Your trusted jewelry organization solution</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update abandoned cart with reminder sent timestamp
    await supabase
      .from("abandoned_carts")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", abandonedCart.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        abandonedCartId: abandonedCart.id,
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-abandoned-cart-email function:", error);
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
