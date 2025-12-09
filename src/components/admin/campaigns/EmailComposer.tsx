import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipientSelector } from './RecipientSelector';
import { useEmailCampaigns } from '@/hooks/useEmailCampaigns';
import { ArrowLeft, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmailComposerProps {
  onBack: () => void;
}

export const EmailComposer = ({ onBack }: EmailComposerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createCampaign, sendBulkEmail } = useEmailCampaigns();
  
  const [step, setStep] = useState(1);
  const [emailType, setEmailType] = useState<'promotional' | 'announcement'>('promotional');
  const [recipients, setRecipients] = useState<Array<{ email: string; name?: string }>>([]);
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCampaign = async () => {
    if (!campaignName || !subject || !headline || !bodyText || recipients.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (recipients.length > 100 && !confirm(`You are about to send to ${recipients.length} recipients. Continue?`)) {
      return;
    }

    setIsSending(true);
    
    try {
      const templateData = {
        subject,
        previewText,
        headline,
        subheadline,
        bodyText,
        ctaText,
        ctaLink,
        heroImage,
      };

      const campaign = await createCampaign.mutateAsync({
        campaign_name: campaignName,
        email_type: emailType,
        subject,
        preview_text: previewText,
        template_data: templateData,
        recipient_count: recipients.length,
        status: 'draft',
      });

      await sendBulkEmail.mutateAsync({
        campaignId: campaign.id,
        recipients,
        emailType,
        templateData,
      });

      toast({
        title: 'Campaign sent!',
        description: `Your campaign has been sent to ${recipients.length} customers.`,
      });

      navigate('/admin/emails');
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create Email Campaign</h2>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Email Type</CardTitle>
            <CardDescription>Select the type of email you want to send</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setEmailType('promotional')}
                className={`p-6 border-2 rounded-lg text-left transition-colors ${
                  emailType === 'promotional' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold mb-2">Promotional Email</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for sales, new products, and special offers
                </p>
              </button>
              
              <button
                onClick={() => setEmailType('announcement')}
                className={`p-6 border-2 rounded-lg text-left transition-colors ${
                  emailType === 'announcement' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold mb-2">Announcement</h3>
                <p className="text-sm text-muted-foreground">
                  Clean design for updates, news, and important information
                </p>
              </button>
            </div>

            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="e.g., Spring Sale 2024"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <Button onClick={() => setStep(2)} disabled={!campaignName}>
              Next: Select Recipients
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <RecipientSelector onRecipientsChange={setRecipients} />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={recipients.length === 0}>
              Next: Design Email
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design Your Email</CardTitle>
              <CardDescription>Customize the content and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject Line *</Label>
                <Input
                  id="subject"
                  placeholder="🎉 New Collection Launch!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="previewText">Preview Text</Label>
                <Input
                  id="previewText"
                  placeholder="Check out our latest arrivals..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                />
              </div>

              {emailType === 'promotional' && (
                <div>
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    placeholder="https://..."
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  placeholder="Introducing the Eid Collection"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              {emailType === 'promotional' && (
                <div>
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Input
                    id="subheadline"
                    placeholder="Celebrate in style"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="bodyText">Body Text *</Label>
                <Textarea
                  id="bodyText"
                  placeholder="Write your message here..."
                  rows={6}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ctaText">Call-to-Action Button Text</Label>
                <Input
                  id="ctaText"
                  placeholder="Shop Now"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ctaLink">Call-to-Action Link</Label>
                <Input
                  id="ctaLink"
                  placeholder="https://sisterstorage.com/shop"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              onClick={handleSendCampaign} 
              disabled={isSending || !subject || !headline || !bodyText}
            >
              {isSending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {recipients.length} Recipients
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
