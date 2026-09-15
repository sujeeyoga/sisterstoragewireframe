import { useState } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, ExternalLink, AlertCircle } from 'lucide-react';
import { functionsClient } from '@/integrations/supabase/functionsClient';

interface Shipment {
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  status: string | null;
  updatedAt: string | null;
}

interface TrackResult {
  order: { orderNumber: string; placedAt: string; fulfillmentStatus: string };
  shipments: Shipment[];
}

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error: fnError } = await functionsClient.functions.invoke('track-order', {
        body: { orderNumber, email },
      });

      if (fnError) throw fnError;

      if (!data?.success) {
        setError(data?.error || 'We could not find that order. Please check the details and try again.');
        return;
      }

      setResult({ order: data.order, shipments: data.shipments ?? [] });
    } catch {
      setError('Something went wrong looking up your order. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout variant="standard" pageId="track-order">
      <SEO
        title="Track Your Order | Sister Storage"
        description="Enter your order number and email to see your Sister Storage shipment status and tracking link."
      />
      <div className="container max-w-2xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Track your order</h1>
        <p className="text-muted-foreground mb-8">
          Enter your order number and the email you used at checkout. No account needed.
        </p>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order number</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#1042"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email used at checkout</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                Find my order
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order {result.order.orderNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Placed {new Date(result.order.placedAt).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {result.shipments.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This order hasn't shipped yet. As soon as it's on its way, your tracking link
                    will appear here and we'll email it to you.
                  </AlertDescription>
                </Alert>
              ) : (
                result.shipments.map((shipment, index) => (
                  <div key={index} className="rounded-lg border p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-medium">{shipment.carrier || 'Standard Shipping'}</p>
                    <p className="text-sm text-muted-foreground">Tracking number</p>
                    <p className="font-medium break-all">{shipment.trackingNumber}</p>
                    {shipment.trackingUrl && (
                      <Button asChild className="w-full sm:w-auto">
                        <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer">
                          Track this package
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}

              <p className="text-sm text-muted-foreground">
                Need help? Email{' '}
                <a className="underline" href="mailto:sisterstorageinc@gmail.com">
                  sisterstorageinc@gmail.com
                </a>
                .
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseLayout>
  );
};

export default TrackOrder;
