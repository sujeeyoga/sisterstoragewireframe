import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ShippingZoneTester = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [address, setAddress] = useState({
    city: '',
    province: '',
    country: 'CA',
    postalCode: '',
  });
  const [subtotal, setSubtotal] = useState('50');

  const runTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('calculate-shipping-zones', {
        body: {
          address,
          subtotal: parseFloat(subtotal),
          items: [],
        },
      });

      if (error) throw error;

      setResult(data);
      toast.success('Zone calculation complete');
    } catch (error) {
      console.error('Test failed:', error);
      toast.error('Failed to calculate shipping zone');
      setResult({ error: String(error) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Zone Tester
        </CardTitle>
        <CardDescription>
          Test zone matching logic with any address and subtotal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Toronto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              value={address.province}
              onChange={(e) => setAddress({ ...address, province: e.target.value })}
              placeholder="ON"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              placeholder="CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal Code</Label>
            <Input
              id="postal"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              placeholder="M5H 2N2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtotal">Order Subtotal ($)</Label>
          <Input
            id="subtotal"
            type="number"
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
            placeholder="50.00"
          />
        </div>

        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Zone Matching
        </Button>

        {result && (
          <div className="mt-4 space-y-3 rounded-lg border p-4">
            {result.error ? (
              <div className="text-destructive">
                <strong>Error:</strong> {result.error}
              </div>
            ) : result.success ? (
              <>
                <div>
                  <strong>Matched Zone:</strong>{' '}
                  <Badge variant="secondary">{result.zone?.name || 'Unknown'}</Badge>
                </div>
                {result.matchedRule && (
                  <div>
                    <strong>Matched Rule:</strong>{' '}
                    <Badge variant="outline">
                      {result.matchedRule.rule_type}: {result.matchedRule.rule_value}
                    </Badge>
                  </div>
                )}
                <div>
                  <strong>Shipping Rates:</strong>
                  {result.rates && result.rates.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {result.rates.map((rate: any) => (
                        <li key={rate.id} className="flex justify-between text-sm">
                          <span>{rate.method_name}</span>
                          <span className={rate.is_free ? 'text-green-600 font-medium' : ''}>
                            {rate.is_free ? 'FREE' : `$${rate.rate_amount.toFixed(2)}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-sm">No rates available</span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">
                <strong>No zone matched</strong>
                {result.fallback_used && (
                  <p className="text-sm mt-1">Using fallback rate: ${result.fallback_rate}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
