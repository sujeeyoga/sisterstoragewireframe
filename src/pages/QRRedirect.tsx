import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function QRRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const { data: qrCode, isLoading, error } = useQuery({
    queryKey: ['qr-redirect', shortCode],
    queryFn: async () => {
      console.log('QR Redirect - Short code:', shortCode);
      
      if (!shortCode) {
        console.error('QR Redirect - No short code provided');
        throw new Error('No short code provided');
      }

      console.log('QR Redirect - Fetching QR code from database...');
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('short_code', shortCode)
        .eq('is_active', true)
        .maybeSingle();

      console.log('QR Redirect - Database response:', { data, error });

      if (error) {
        console.error('QR Redirect - Database error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('QR Redirect - QR code not found in database');
        throw new Error('QR code not found');
      }

      console.log('QR Redirect - QR code found:', data);
      return data;
    },
    enabled: !!shortCode,
  });

  useEffect(() => {
    const trackAndRedirect = async () => {
      if (qrCode && shortCode) {
        console.log('QR Redirect - Starting tracking and redirect...');
        console.log('QR Redirect - Destination URL:', qrCode.destination_url);
        
        // Track the scan
        try {
          // Increment scan count
          await supabase
            .from('qr_codes')
            .update({ scan_count: qrCode.scan_count + 1 })
            .eq('id', qrCode.id);

          // Track individual scan for analytics
          await supabase.from('qr_scans').insert({
            qr_code_id: qrCode.id,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });
          
          console.log('QR Redirect - Tracking completed');
        } catch (error) {
          console.error('QR Redirect - Error tracking scan:', error);
        }

        // Redirect to destination
        console.log('QR Redirect - Redirecting to:', qrCode.destination_url);
        window.location.href = qrCode.destination_url;
      }
    };

    trackAndRedirect();
  }, [qrCode, shortCode]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !qrCode) {
    console.error('QR Redirect - Error state:', { error, qrCode, shortCode });
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h1 className="text-4xl font-bold">QR Code Not Found</h1>
            <p className="text-lg text-muted-foreground">
              This QR code is invalid or has been disabled.
            </p>
            {error && (
              <p className="text-sm text-destructive">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            )}
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}
