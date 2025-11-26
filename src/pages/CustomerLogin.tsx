import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Phone, KeyRound, ArrowRight, AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CustomerLogin = () => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'email' | 'otp' | 'email-sent'>('phone');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { user, signInWithPhone, signInWithEmail, verifyOTP } = useCustomerAuth();

  // Remember phone number
  useEffect(() => {
    const savedPhone = localStorage.getItem('customer_phone');
    if (savedPhone) setPhone(savedPhone);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/customer/dashboard');
    }
  }, [user, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format phone to E.164
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
    
    try {
      await signInWithPhone.mutateAsync(formattedPhone);
      localStorage.setItem('customer_phone', phone);
      setStep('otp');
      setCountdown(60);
    } catch (error) {
      // Error is handled by mutation's onError
      console.error('Failed to send OTP:', error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
    await verifyOTP.mutateAsync({ phone: formattedPhone, token: otp });
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
      signInWithPhone.mutate(formattedPhone);
      setCountdown(60);
    }
  };

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
              Sign in to view your order status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(signInWithPhone.isError || signInWithEmail.isError) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {signInWithPhone.error?.message || signInWithEmail.error?.message || 'Authentication failed'}
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs value={authMethod} onValueChange={(v) => {
              setAuthMethod(v as 'phone' | 'email');
              setStep(v as 'phone' | 'email');
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4 mt-0">
                {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the phone number you used during checkout
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-brand-pink hover:bg-brand-pink/90"
                  disabled={signInWithPhone.isPending || !phone}
                >
                  {signInWithPhone.isPending ? 'Sending...' : 'Send Verification Code'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
                ) : step === 'otp' ? (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-lg tracking-widest text-center"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {phone}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-brand-pink hover:bg-brand-pink/90"
                  disabled={verifyOTP.isPending || otp.length !== 6}
                >
                  {verifyOTP.isPending ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                  >
                    Change Number
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </Button>
                </div>
              </form>
                ) : null}
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-0">
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
                ) : step === 'email-sent' ? (
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleResendEmail}
                        disabled={signInWithEmail.isPending}
                        className="flex-1"
                      >
                        {signInWithEmail.isPending ? 'Sending...' : 'Resend Link'}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setStep('phone');
                          setAuthMethod('phone');
                        }}
                        className="flex-1"
                      >
                        Use Phone
                      </Button>
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default CustomerLogin;
