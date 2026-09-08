import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUsShippingEnabled, useSetUsShipping } from '@/hooks/useUsShipping';

export function ShippingDestinationsCard() {
  const { usShippingEnabled, settingReadable, isLoading } = useUsShippingEnabled();
  const setUsShipping = useSetUsShipping();

  const handleToggle = (checked: boolean) => {
    setUsShipping.mutate(checked, {
      onSuccess: () => {
        toast.success(
          checked
            ? 'United States orders are now enabled'
            : 'United States orders are now paused'
        );
      },
      onError: () => {
        toast.error("Couldn't save this setting. The site stays on its current setting.");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Shipping Destinations
        </CardTitle>
        <CardDescription>
          Choose which countries customers can order from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="us-shipping" className="text-base">
              Ship to United States
            </Label>
            <p className="text-sm text-muted-foreground">
              When off, US shoppers can't select the United States at checkout and
              shipping quotes for US addresses are declined.
            </p>
          </div>
          <Switch
            id="us-shipping"
            checked={usShippingEnabled}
            disabled={isLoading || setUsShipping.isPending}
            onCheckedChange={handleToggle}
          />
        </div>

        {!settingReadable && !isLoading && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              This setting can't be read from the store settings right now, so the site
              is using its saved default: United States orders are paused.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
