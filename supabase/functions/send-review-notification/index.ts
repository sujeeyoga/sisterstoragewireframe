import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewNotificationRequest {
  review_id: string;
  customer_email: string;
  customer_name: string;
  product_name: string;
  rating: number;
  review_text: string;
  notification_type: 'submission' | 'approval' | 'rejection';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      review_id,
      customer_email,
      customer_name,
      product_name,
      rating,
      review_text,
      notification_type
    }: ReviewNotificationRequest = await req.json();

    console.log("Sending review notification:", { review_id, notification_type, customer_email });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get admin email from settings or use default
    const { data: settings } = await supabase
      .from('store_settings')
      .select('setting_value')
      .eq('setting_key', 'reviews')
      .single();

    const adminEmail = "sisterstorageinc@gmail.com"; // Default admin email

    const emails = [];

    // Send email based on notification type
    if (notification_type === 'submission') {
      // 1. Send confirmation to customer
      const customerEmailResponse = await resend.emails.send({
        from: "Sister Storage <sisterstorageinc@gmail.com>",
        to: [customer_email],
        subject: "Thank you for your review! 💖",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FC0079;">Thank You for Your Review!</h1>
            <p>Hi ${customer_name},</p>
            <p>Thank you for taking the time to review <strong>${product_name}</strong>!</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Review:</h3>
              <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
              <p><strong>Review:</strong> ${review_text}</p>
            </div>
            
            <p>Your review is currently pending approval and will be published on our website once it has been reviewed by our team. This typically takes 1-2 business days.</p>
            
            <p>We truly appreciate you sharing your experience with our Sister Storage community!</p>
            
            <p>With love,<br>
            <strong>The Sister Storage Team</strong> 💕</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #666;">
              Sister Storage<br>
              <a href="https://sisterstorage.com" style="color: #FC0079;">sisterstorage.com</a>
            </p>
          </div>
        `,
      });

      emails.push(customerEmailResponse);

      // 2. Send notification to admin
      const adminEmailResponse = await resend.emails.send({
        from: "Sister Storage Reviews <sisterstorageinc@gmail.com>",
        to: [adminEmail],
        subject: "New Product Review Submitted ⭐",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FC0079;">New Review Awaiting Approval</h1>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Review Details:</h3>
              <p><strong>Product:</strong> ${product_name}</p>
              <p><strong>Customer:</strong> ${customer_name} (${customer_email})</p>
              <p><strong>Rating:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
              <p><strong>Review:</strong></p>
              <p style="border-left: 3px solid #FC0079; padding-left: 15px; font-style: italic;">
                ${review_text}
              </p>
            </div>
            
            <p>
              <a href="https://sisterstorage.com/admin" 
                 style="display: inline-block; background: #FC0079; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Review in Admin Panel →
              </a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Note:</strong> This review will not appear on the website until you approve it.
            </p>
          </div>
        `,
      });

      emails.push(adminEmailResponse);
    }

    if (notification_type === 'approval') {
      // Send approval email to customer
      const approvalEmailResponse = await resend.emails.send({
        from: "Sister Storage <sisterstorageinc@gmail.com>",
        to: [customer_email],
        subject: "Your review has been published! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FC0079;">Your Review is Live! 🎉</h1>
            <p>Hi ${customer_name},</p>
            <p>Great news! Your review for <strong>${product_name}</strong> has been approved and is now live on our website!</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
              <p><strong>Your Review:</strong> ${review_text}</p>
            </div>
            
            <p>Thank you for helping other sisters make informed decisions about their jewelry storage needs!</p>
            
            <p>
              <a href="https://sisterstorage.com/shop" 
                 style="display: inline-block; background: #FC0079; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Your Review →
              </a>
            </p>
            
            <p>With love,<br>
            <strong>The Sister Storage Team</strong> 💕</p>
          </div>
        `,
      });

      emails.push(approvalEmailResponse);
    }

    // Log email sends to database
    for (const emailResult of emails) {
      await supabase.from('email_logs').insert({
        recipient_email: notification_type === 'submission' ? customer_email : adminEmail,
        email_type: `review_${notification_type}`,
        subject: notification_type === 'submission' 
          ? 'Thank you for your review!' 
          : 'Your review has been published!',
        sent_successfully: true,
        email_data: {
          review_id,
          product_name,
          rating,
          notification_type
        }
      });
    }

    console.log("Review notification emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Review notification emails sent',
        emails_sent: emails.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-review-notification:", error);
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
