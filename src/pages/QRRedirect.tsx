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
      if (!shortCode) throw new Error('No short code provided');

      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('short_code', shortCode)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) throw new Error('QR code not found');

      return data;
    },
    enabled: !!shortCode,
  });

  useEffect(() => {
    const trackAndRedirect = async () => {
      if (qrCode && shortCode) {
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
        } catch (error) {
          console.error('Error tracking scan:', error);
        }

        // Redirect to destination
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
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h1 className="text-4xl font-bold">QR Code Not Found</h1>
            <p className="text-lg text-muted-foreground">
              This QR code is invalid or has been disabled.
            </p>
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
