import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useShippingRateSource, useSetShippingRateSource } from '@/hooks/useShippingRateSource';

/**
 * Chooses whether checkout prices come from the zones below (dashboard) or from
 * the built-in rules shipped with the site.
 */
export const ShippingRateSourceCard = () => {
  const { useDatabaseRates, settingReadable, isLoading } = useShippingRateSource();
  const setSource = useSetShippingRateSource();

  const handleToggle = (next: boolean) => {
    setSource.mutate(next, {
      onSuccess: () =>
        toast.success(
          next
            ? 'Checkout now uses the shipping zones below'
            : 'Checkout is back on the built-in shipping rules'
        ),
      onError: () => toast.error('Could not save. Please try again.'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Where checkout gets its shipping prices
        </CardTitle>
        <CardDescription>
          Built-in rules: Toronto &amp; GTA $11.50 (free over $60), rest of Canada $15.00 flat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <p className="font-medium">Use the shipping zones below</p>
            <p className="text-sm text-muted-foreground">
              When off, checkout ignores these zones and uses the built-in rules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={useDatabaseRates ? 'default' : 'secondary'}>
              {useDatabaseRates ? 'Zones below' : 'Built-in rules'}
            </Badge>
            <Switch
              checked={useDatabaseRates}
              disabled={isLoading || setSource.isPending}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>

        {!settingReadable && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This setting could not be loaded, so checkout is using the built-in rules.
            </AlertDescription>
          </Alert>
        )}

        {useDatabaseRates && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Live: every price below is what customers are charged. Double-check each zone's
              amount and free-shipping threshold before leaving this page.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
