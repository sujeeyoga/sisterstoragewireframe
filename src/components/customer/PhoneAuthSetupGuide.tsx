import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';

export const PhoneAuthSetupGuide = () => {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Phone Authentication Not Configured</CardTitle>
        <CardDescription>
          To use this feature, phone authentication needs to be set up in Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This feature requires phone authentication to be enabled. If you're the administrator, 
            please follow these steps:
          </AlertDescription>
        </Alert>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-medium">Enable Phone Authentication</p>
              <p className="text-muted-foreground">
                Go to Supabase Dashboard → Authentication → Providers → Phone
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-medium">Configure SMS Provider</p>
              <p className="text-muted-foreground">
                Set up Twilio, MessageBird, or another SMS provider for OTP delivery
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-medium">Test the Setup</p>
              <p className="text-muted-foreground">
                Verify that OTP codes are being delivered successfully
              </p>
            </div>
          </div>
        </div>

        <Button className="w-full bg-brand-pink hover:bg-brand-pink/90" asChild>
          <a 
            href="https://supabase.com/dashboard/project/attczdhexkpxpyqyasgz/auth/providers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Configure in Supabase Dashboard
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
