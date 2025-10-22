import { useState, useEffect } from 'react';
import { useShippingZones } from '@/hooks/useShippingZones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const FallbackSettings = () => {
  const { fallbackSettings, updateFallback } = useShippingZones();
  const [rate, setRate] = useState('9.99');
  const [methodName, setMethodName] = useState('Standard Shipping');
  const [enabled, setEnabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (fallbackSettings) {
      setRate(fallbackSettings.fallback_rate.toString());
      setMethodName(fallbackSettings.fallback_method_name);
      setEnabled(fallbackSettings.enabled);
    }
  }, [fallbackSettings]);

  useEffect(() => {
    if (fallbackSettings) {
      const changed =
        rate !== fallbackSettings.fallback_rate.toString() ||
        methodName !== fallbackSettings.fallback_method_name ||
        enabled !== fallbackSettings.enabled;
      setHasChanges(changed);
    }
  }, [rate, methodName, enabled, fallbackSettings]);

  const handleSave = () => {
    updateFallback({
      fallback_rate: parseFloat(rate),
      fallback_method_name: methodName,
      enabled,
    });
    setHasChanges(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Fallback Shipping Rate</h3>
          <p className="text-sm text-muted-foreground">
            Used when customer address doesn't match any shipping zone
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="fallback-rate">Fallback Rate</Label>
          <Input
            id="fallback-rate"
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="fallback-method">Method Name</Label>
          <Input
            id="fallback-method"
            value={methodName}
            onChange={(e) => setMethodName(e.target.value)}
            placeholder="Standard Shipping"
          />
        </div>

        <div className="flex items-end">
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Label>Enabled</Label>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Fallback Settings
        </Button>
      </div>
    </Card>
  );
};
