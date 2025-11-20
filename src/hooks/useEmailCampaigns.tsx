import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmailCampaign {
  id: string;
  created_at: string;
  sent_at?: string;
  created_by?: string;
  campaign_name: string;
  email_type: string;
  subject: string;
  preview_text?: string;
  template_data: any;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: 'draft' | 'sending' | 'sent' | 'failed' | 'cancelled';
}

export const useEmailCampaigns = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailCampaign[];
    },
  });

  const createCampaign = useMutation({
    mutationFn: async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'sent_count' | 'failed_count'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          ...campaign,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as EmailCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast({
        title: 'Campaign created',
        description: 'Your email campaign has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const sendBulkEmail = useMutation({
    mutationFn: async ({ 
      campaignId, 
      recipients, 
      emailType, 
      templateData 
    }: {
      campaignId: string;
      recipients: Array<{ email: string; name?: string }>;
      emailType: 'promotional' | 'announcement';
      templateData: any;
    }) => {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { campaignId, recipients, emailType, templateData },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      toast({
        title: 'Campaign sent',
        description: `Successfully sent ${data.sentCount} emails${data.failedCount > 0 ? `, ${data.failedCount} failed` : ''}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error sending campaign',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    campaigns,
    isLoading,
    createCampaign,
    sendBulkEmail,
  };
};
