import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Phone, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CustomerLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { user, signInWithPhone, verifyOTP } = useCustomerAuth();

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

  return (
    <BaseLayout variant="standard" pageId="customer-login">
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">Track Your Order</CardTitle>
            <CardDescription className="text-center">
              Sign in with your phone number to view your order status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signInWithPhone.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {signInWithPhone.error?.message || 'Failed to send verification code. Please ensure phone authentication is configured in Supabase.'}
                </AlertDescription>
              </Alert>
            )}
            
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
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default CustomerLogin;
