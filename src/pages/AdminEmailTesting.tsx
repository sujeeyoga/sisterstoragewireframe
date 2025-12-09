import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EmailType = 
  | 'order_confirmation' 
  | 'shipping_notification' 
  | 'admin_welcome' 
  | 'admin_promotion'
  | 'announcement'
  | 'promotional';

interface EmailTemplate {
  label: string;
  description: string;
  sampleData: any;
}

const emailTemplates: Record<EmailType, EmailTemplate> = {
  order_confirmation: {
    label: 'Order Confirmation',
    description: 'Sent when customer completes checkout',
    sampleData: {
      customerName: 'Sarah Johnson',
      orderNumber: 'SS-1001',
      orderDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [
        { name: 'Sister Staples (Set of 4 Bangle Boxes)', quantity: 1, price: 89.00 },
        { name: 'Large Bangle Box (4-Rod)', quantity: 2, price: 59.98 },
      ],
      subtotal: 148.98,
      shipping: 12.00,
      tax: 15.00,
      total: 175.98,
      shippingAddress: {
        name: 'Sarah Johnson',
        address: '123 Queen Street West',
        city: 'Toronto',
        state: 'ON',
        postal_code: 'M5H 2N2',
        country: 'Canada'
      }
    }
  },
  shipping_notification: {
    label: 'Shipping Notification',
    description: 'Sent when order is shipped with tracking',
    sampleData: {
      customerName: 'Sarah Johnson',
      orderNumber: 'SS-1001',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'Canada Post',
      estimatedDelivery: 'January 31, 2025',
      items: [
        { name: 'Sister Staples (Set of 4 Bangle Boxes)', quantity: 1 },
        { name: 'Large Bangle Box (4-Rod)', quantity: 2 },
      ],
      shippingAddress: {
        name: 'Sarah Johnson',
        address: '123 Queen Street West',
        city: 'Toronto',
        state: 'ON',
        postal_code: 'M5H 2N2',
        country: 'Canada'
      }
    }
  },
  admin_welcome: {
    label: 'Admin Welcome',
    description: 'Sent when new admin is added',
    sampleData: {
      adminName: 'Admin User',
      adminEmail: 'admin@example.com',
      dashboardUrl: 'https://sisterstorage.ca/admin'
    }
  },
  admin_promotion: {
    label: 'Admin Promotion/Alert',
    description: 'Custom admin notifications',
    sampleData: {
      subject: 'New Feature Available',
      preview: 'Check out the new email testing tool',
      body: 'We\'ve added a new email testing tool to help you preview and test all email templates. You can find it in the admin panel under Settings.',
      ctaText: 'View Admin Panel',
      ctaUrl: 'https://sisterstorage.ca/admin'
    }
  },
  announcement: {
    label: 'Announcement Email',
    description: 'General announcements to customers',
    sampleData: {
      subject: 'Important Update from Sister Storage',
      preview: 'New products launching soon!',
      headline: 'Exciting News! 🎉',
      body: 'We\'re thrilled to announce the launch of our new collection coming this February. Stay tuned for exclusive early access!',
      ctaText: 'Learn More',
      ctaUrl: 'https://sisterstorage.ca/shop'
    }
  },
  promotional: {
    label: 'Promotional Email',
    description: 'Marketing and promotional campaigns',
    sampleData: {
      subject: 'Special Offer: 20% Off This Weekend',
      preview: 'Limited time offer - don\'t miss out!',
      headline: 'Weekend Sale! 💝',
      body: 'Get 20% off all bangle storage solutions this weekend only. Use code WEEKEND20 at checkout.',
      ctaText: 'Shop Now',
      ctaUrl: 'https://sisterstorage.ca/shop',
      disclaimer: 'Offer valid until January 31, 2025. Cannot be combined with other offers.'
    }
  }
};

const AdminEmailTesting = () => {
  const [selectedType, setSelectedType] = useState<EmailType>('order_confirmation');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customData, setCustomData] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const currentTemplate = emailTemplates[selectedType];

  const handleSendTest = async () => {
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    setSendStatus('idle');
    setErrorMessage('');

    try {
      // Parse custom data or use sample data
      let emailData;
      try {
        emailData = customData ? JSON.parse(customData) : currentTemplate.sampleData;
      } catch (e) {
        throw new Error('Invalid JSON in custom data');
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: selectedType,
          to: recipientEmail,
          data: emailData
        }
      });

      if (error) throw error;

      setSendStatus('success');
      toast({
        title: "Test Email Sent! 📧",
        description: `Email successfully sent to ${recipientEmail}`,
      });
    } catch (error: any) {
      console.error('Error sending test email:', error);
      setSendStatus('error');
      setErrorMessage(error.message || 'Failed to send test email');
      toast({
        title: "Failed to Send",
        description: error.message || 'An error occurred while sending the test email',
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetCustomData = () => {
    setCustomData('');
    setSendStatus('idle');
    setErrorMessage('');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8 text-primary" />
            Email Testing Tool
          </h1>
          <p className="text-muted-foreground mt-2">
            Preview and send test emails to verify all templates are working correctly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Select email template and configure test settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-type">Email Template</Label>
                <Select 
                  value={selectedType} 
                  onValueChange={(value) => {
                    setSelectedType(value as EmailType);
                    resetCustomData();
                  }}
                >
                  <SelectTrigger id="email-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(emailTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {currentTemplate.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Email</Label>
                <Input
                  id="recipient"
                  type="email"
                  placeholder="test@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Email will be sent to this address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-data">Custom Data (Optional)</Label>
                <Textarea
                  id="custom-data"
                  placeholder="Leave empty to use sample data, or paste custom JSON data..."
                  value={customData}
                  onChange={(e) => setCustomData(e.target.value)}
                  className="font-mono text-xs min-h-32"
                />
                <p className="text-xs text-muted-foreground">
                  Override sample data with custom JSON
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSendTest} 
                  disabled={isSending}
                  className="flex-1"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetCustomData}
                  disabled={isSending}
                >
                  Reset
                </Button>
              </div>

              {sendStatus === 'success' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Test email sent successfully! Check {recipientEmail}
                  </AlertDescription>
                </Alert>
              )}

              {sendStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Sample Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Data Preview</CardTitle>
              <CardDescription>
                Data that will be sent to the email template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs font-mono">
                {JSON.stringify(currentTemplate.sampleData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Email Template Reference</CardTitle>
            <CardDescription>
              Quick overview of all available email templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(emailTemplates).map(([key, template]) => (
                <div 
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedType === key 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedType(key as EmailType);
                    resetCustomData();
                  }}
                >
                  <h3 className="font-semibold text-sm mb-1">{template.label}</h3>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Alert className="mt-6">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> All emails are sent from sisterstorageinc@gmail.com. 
            Make sure this email is verified in your Resend account for emails to send successfully.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailTesting;
