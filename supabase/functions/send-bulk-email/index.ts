import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';

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

// Promotional Email Template
const PromotionalEmail = ({ customerName, subject, previewText, heroImage, headline, subheadline, bodyText, ctaText, ctaLink, productCards, footerText }: any) => {
  const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' };
  const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px' };
  const greeting = { fontSize: '16px', lineHeight: '26px', color: '#333', marginBottom: '20px' };
  const heroSection = { marginBottom: '32px' };
  const heroImg = { width: '100%', height: 'auto', borderRadius: '8px' };
  const h1 = { color: '#333', fontSize: '32px', fontWeight: 'bold', margin: '30px 0', padding: '0', lineHeight: '42px', textAlign: 'center' as const };
  const subheading = { color: '#666', fontSize: '18px', lineHeight: '28px', textAlign: 'center' as const, margin: '0 0 30px' };
  const bodyTextStyle = { color: '#333', fontSize: '16px', lineHeight: '26px', margin: '0 0 30px' };
  const ctaSection = { textAlign: 'center' as const, margin: '32px 0' };
  const button = { backgroundColor: '#FF69B4', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '14px 32px' };
  const hr = { borderColor: '#e6e6e6', margin: '40px 0' };
  const footer = { color: '#666', fontSize: '14px', lineHeight: '24px', textAlign: 'center' as const };
  const link = { color: '#FF69B4', textDecoration: 'underline' };
  const unsubscribe = { color: '#999', fontSize: '12px', lineHeight: '20px', textAlign: 'center' as const, marginTop: '32px' };

  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, previewText || subject),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        customerName && React.createElement(Text, { style: greeting }, `Hi ${customerName},`),
        heroImage && React.createElement(Section, { style: heroSection },
          React.createElement(Img, { src: heroImage, alt: headline, style: heroImg })
        ),
        React.createElement(Heading, { style: h1 }, headline),
        subheadline && React.createElement(Text, { style: subheading }, subheadline),
        React.createElement(Text, { style: bodyTextStyle }, bodyText),
        React.createElement(Section, { style: ctaSection },
          React.createElement(Button, { style: button, href: ctaLink }, ctaText)
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(Text, { style: footer }, footerText || 'Thank you for being a valued customer at Sister Storage.'),
        React.createElement(Text, { style: footer },
          React.createElement(Link, { href: 'https://sisterstorage.ca', style: link }, 'Visit our website'),
          ' • ',
          React.createElement(Link, { href: 'https://instagram.com/sisterstorage', style: link }, 'Follow us on Instagram')
        ),
        React.createElement(Text, { style: unsubscribe },
          'Don\'t want to receive these emails? ',
          React.createElement(Link, { href: '#', style: link }, 'Unsubscribe')
        )
      )
    )
  );
};

// Announcement Email Template
const AnnouncementEmail = ({ customerName, subject, previewText, image, headline, bodyText, ctaText, ctaLink, footerText }: any) => {
  const main = { backgroundColor: '#f6f6f6', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' };
  const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' };
  const greeting = { fontSize: '16px', lineHeight: '26px', color: '#333', marginBottom: '30px' };
  const announcementBox = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' };
  const h1 = { color: '#333', fontSize: '36px', fontWeight: 'bold', margin: '0 0 30px', padding: '0', lineHeight: '44px', textAlign: 'center' as const };
  const imageSection = { margin: '30px 0' };
  const img = { width: '100%', height: 'auto', borderRadius: '8px' };
  const bodyTextStyle = { color: '#333', fontSize: '18px', lineHeight: '28px', margin: '0 0 30px', textAlign: 'center' as const };
  const ctaSection = { textAlign: 'center' as const, margin: '32px 0 0' };
  const button = { backgroundColor: '#FF69B4', borderRadius: '8px', color: '#fff', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '16px 40px' };
  const hr = { borderColor: '#e6e6e6', margin: '32px 0' };
  const footer = { color: '#666', fontSize: '14px', lineHeight: '24px', textAlign: 'center' as const };
  const link = { color: '#FF69B4', textDecoration: 'underline' };
  const unsubscribe = { color: '#999', fontSize: '12px', lineHeight: '20px', textAlign: 'center' as const, marginTop: '32px' };

  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, previewText || subject),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        customerName && React.createElement(Text, { style: greeting }, `Hi ${customerName},`),
        React.createElement(Section, { style: announcementBox },
          React.createElement(Heading, { style: h1 }, headline),
          image && React.createElement(Section, { style: imageSection },
            React.createElement(Img, { src: image, alt: headline, style: img })
          ),
          React.createElement(Text, { style: bodyTextStyle }, bodyText),
          ctaText && ctaLink && React.createElement(Section, { style: ctaSection },
            React.createElement(Button, { style: button, href: ctaLink }, ctaText)
          )
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(Text, { style: footer }, footerText || 'Thank you for being part of the Sister Storage community.'),
        React.createElement(Text, { style: footer },
          React.createElement(Link, { href: 'https://sisterstorage.ca', style: link }, 'Visit our website'),
          ' • ',
          React.createElement(Link, { href: 'https://instagram.com/sisterstorage', style: link }, 'Follow us on Instagram')
        ),
        React.createElement(Text, { style: unsubscribe },
          'Don\'t want to receive these emails? ',
          React.createElement(Link, { href: '#', style: link }, 'Unsubscribe')
        )
      )
    )
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { campaignId, recipients, emailType, templateData }: BulkEmailRequest = await req.json();

    console.log(`Starting bulk email send for campaign ${campaignId} to ${recipients.length} recipients`);

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

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      
      const results = await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
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

            const { data, error } = await resend.emails.send({
              from: 'Sister Storage <sisterstorageinc@gmail.com>',
              to: [recipient.email],
              subject: templateData.subject,
              html,
            });

            if (error) {
              throw error;
            }

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

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      await supabase
        .from('email_campaigns')
        .update({ 
          sent_count: sentCount,
          failed_count: failedCount 
        })
        .eq('id', campaignId);

      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

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
