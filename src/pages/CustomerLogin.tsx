import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { ArrowRight, AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'email-sent'>('email');
  const navigate = useNavigate();
  const { user, signInWithEmail } = useCustomerAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/customer/dashboard');
    }
  }, [user, navigate]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmail.mutateAsync(email.trim());
    setStep('email-sent');
  };

  const handleResendEmail = async () => {
    await signInWithEmail.mutateAsync(email.trim());
  };

  return (
    <BaseLayout variant="standard" pageId="customer-login">
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">Track Your Order</CardTitle>
            <CardDescription className="text-center">
              Enter your email to view your order status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signInWithEmail.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {signInWithEmail.error?.message || 'Authentication failed'}
                </AlertDescription>
              </Alert>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-lg"
                    autoComplete="email"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the email you used during checkout
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-pink hover:bg-brand-pink/90"
                  disabled={signInWithEmail.isPending || !email}
                >
                  {signInWithEmail.isPending ? 'Sending...' : 'Send Login Link'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="rounded-lg bg-muted p-6 space-y-3">
                  <Mail className="h-12 w-12 mx-auto text-brand-pink" />
                  <h3 className="font-semibold text-lg">Check Your Email!</h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a login link to:
                  </p>
                  <p className="font-medium break-all">{email}</p>
                </div>
                <p className="text-sm text-muted-foreground px-4">
                  Click the link in your email to sign in and view your orders.
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={signInWithEmail.isPending}
                  className="w-full"
                >
                  {signInWithEmail.isPending ? 'Sending...' : 'Resend Link'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default CustomerLogin;
