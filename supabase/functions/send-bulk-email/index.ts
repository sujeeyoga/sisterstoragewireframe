import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { PromotionalEmail } from '../send-email/_templates/promotional.tsx';
import { AnnouncementEmail } from '../send-email/_templates/announcement.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkEmailRequest {
  campaignId: string;
  recipients: Array<{
    email: string;
    name?: string;
  }>;
  emailType: 'promotional' | 'announcement';
  templateData: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { campaignId, recipients, emailType, templateData }: BulkEmailRequest = await req.json();

    console.log(`Starting bulk email send for campaign ${campaignId} to ${recipients.length} recipients`);

    // Update campaign status to sending
    await supabase
      .from('email_campaigns')
      .update({ 
        status: 'sending',
        recipient_count: recipients.length 
      })
      .eq('id', campaignId);

    let sentCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 50;

    // Process in batches
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      
      // Send emails in batch
      const results = await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            // Render email template
            let html: string;
            
            if (emailType === 'promotional') {
              html = await renderAsync(
                React.createElement(PromotionalEmail, {
                  customerName: recipient.name,
                  ...templateData,
                })
              );
            } else if (emailType === 'announcement') {
              html = await renderAsync(
                React.createElement(AnnouncementEmail, {
                  customerName: recipient.name,
                  ...templateData,
                })
              );
            } else {
              throw new Error(`Unknown email type: ${emailType}`);
            }

            // Send email
            const { data, error } = await resend.emails.send({
              from: 'Sister Storage <hello@sisterstorage.ca>',
              to: [recipient.email],
              subject: templateData.subject,
              html,
            });

            if (error) {
              throw error;
            }

            // Log successful send
            await supabase.from('email_logs').insert({
              campaign_id: campaignId,
              recipient_email: recipient.email,
              email_type: emailType,
              subject: templateData.subject,
              sent_successfully: true,
              email_data: { templateData, recipient },
            });

            return { success: true, email: recipient.email };
          } catch (error) {
            console.error(`Failed to send to ${recipient.email}:`, error);
            
            // Log failed send
            await supabase.from('email_logs').insert({
              campaign_id: campaignId,
              recipient_email: recipient.email,
              email_type: emailType,
              subject: templateData.subject,
              sent_successfully: false,
              error_message: error.message,
              email_data: { templateData, recipient },
            });

            return { success: false, email: recipient.email, error: error.message };
          }
        })
      );

      // Count successes and failures
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      // Update campaign progress
      await supabase
        .from('email_campaigns')
        .update({ 
          sent_count: sentCount,
          failed_count: failedCount 
        })
        .eq('id', campaignId);

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status to sent
    await supabase
      .from('email_campaigns')
      .update({ 
        status: sentCount > 0 ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        sent_count: sentCount,
        failed_count: failedCount 
      })
      .eq('id', campaignId);

    console.log(`Bulk email send completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        sentCount,
        failedCount,
        totalCount: recipients.length 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-bulk-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
