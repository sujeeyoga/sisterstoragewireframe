import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEmailCampaigns } from '@/hooks/useEmailCampaigns';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export const CampaignList = () => {
  const { campaigns, isLoading } = useEmailCampaigns();

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-muted-foreground">
            Create your first email campaign to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Sent</Badge>;
      case 'sending':
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" /> Sending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {campaign.campaign_name}
                  {getStatusBadge(campaign.status)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {campaign.subject}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Type</p>
                <p className="font-medium capitalize">{campaign.email_type}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Recipients</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {campaign.recipient_count}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Sent</p>
                <p className="font-medium text-green-600">{campaign.sent_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Failed</p>
                <p className="font-medium text-red-600">{campaign.failed_count}</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {campaign.sent_at ? (
                <>Sent {formatDistanceToNow(new Date(campaign.sent_at), { addSuffix: true })}</>
              ) : (
                <>Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
