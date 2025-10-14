import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, MapPin, Truck, DollarSign, Package, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShippingRule {
  location: string;
  type: 'flat_rate' | 'free' | 'calculated';
  rate?: number;
  threshold?: number;
}

interface ShippingSettingsData {
  toronto_flat_rate: {
    enabled: boolean;
    rate: number;
  };
  gta_free_shipping: {
    enabled: boolean;
    threshold: number;
  };
  default_shipping: {
    provider: string;
    fallback_rate: number;
  };
}

const ShippingSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['shipping-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'shipping_settings')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          toronto_flat_rate: { enabled: true, rate: 3.99 },
          gta_free_shipping: { enabled: true, threshold: 50 },
          default_shipping: { provider: 'stallion', fallback_rate: 9.99 },
        } as ShippingSettingsData;
      }

      return data.setting_value as unknown as ShippingSettingsData;
    },
  });

  const [localSettings, setLocalSettings] = useState<ShippingSettingsData | null>(null);

  // Use localSettings if modified, otherwise use fetched settings
  const currentSettings = localSettings || settings;

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: ShippingSettingsData) => {
      const { error } = await supabase
        .from('store_settings')
        .upsert({
          setting_key: 'shipping_settings',
          setting_value: newSettings as any,
          enabled: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-settings'] });
      toast({
        title: 'Success',
        description: 'Shipping settings updated successfully',
      });
      setLocalSettings(null);
    },
    onError: (error) => {
      console.error('Failed to update shipping settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shipping settings',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (currentSettings) {
      updateSettingsMutation.mutate(currentSettings);
    }
  };

  const updateLocalSettings = (updates: Partial<ShippingSettingsData>) => {
    if (currentSettings) {
      setLocalSettings({ ...currentSettings, ...updates });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Shipping Settings</h2>
        <p className="text-muted-foreground">
          Configure shipping rates and rules for your store
        </p>
      </div>

      {/* Toronto Flat Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
            Toronto Flat Rate
          </CardTitle>
          <CardDescription>
            Set a fixed shipping rate for all Toronto customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="toronto-enabled">Enable Toronto Flat Rate</Label>
              <p className="text-sm text-muted-foreground">
                Applies to customers with "Toronto" in their city
              </p>
            </div>
            <Switch
              id="toronto-enabled"
              checked={currentSettings?.toronto_flat_rate.enabled}
              onCheckedChange={(checked) =>
                updateLocalSettings({
                  toronto_flat_rate: {
                    ...currentSettings!.toronto_flat_rate,
                    enabled: checked,
                  },
                })
              }
            />
          </div>
          
          {currentSettings?.toronto_flat_rate.enabled && (
            <div className="space-y-2">
              <Label htmlFor="toronto-rate">Flat Rate ($CAD)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="toronto-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentSettings.toronto_flat_rate.rate}
                  onChange={(e) =>
                    updateLocalSettings({
                      toronto_flat_rate: {
                        ...currentSettings.toronto_flat_rate,
                        rate: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GTA Free Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            GTA Free Shipping
          </CardTitle>
          <CardDescription>
            Offer free shipping for GTA customers over a threshold
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gta-enabled">Enable GTA Free Shipping</Label>
              <p className="text-sm text-muted-foreground">
                For postal codes starting with M or L1-L9 (excluding Toronto)
              </p>
            </div>
            <Switch
              id="gta-enabled"
              checked={currentSettings?.gta_free_shipping.enabled}
              onCheckedChange={(checked) =>
                updateLocalSettings({
                  gta_free_shipping: {
                    ...currentSettings!.gta_free_shipping,
                    enabled: checked,
                  },
                })
              }
            />
          </div>

          {currentSettings?.gta_free_shipping.enabled && (
            <div className="space-y-2">
              <Label htmlFor="gta-threshold">Minimum Order Amount ($CAD)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="gta-threshold"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentSettings.gta_free_shipping.threshold}
                  onChange={(e) =>
                    updateLocalSettings({
                      gta_free_shipping: {
                        ...currentSettings.gta_free_shipping,
                        threshold: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Orders over this amount get free shipping
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Default Shipping
          </CardTitle>
          <CardDescription>
            Fallback settings for other locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fallback-rate">Fallback Shipping Rate ($CAD)</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                id="fallback-rate"
                type="number"
                step="0.01"
                min="0"
                value={currentSettings?.default_shipping.fallback_rate}
                onChange={(e) =>
                  updateLocalSettings({
                    default_shipping: {
                      ...currentSettings!.default_shipping,
                      fallback_rate: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-32"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used when Stallion Express rates aren't available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending || !localSettings}
            className="w-full"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Shipping Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Rules Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipping Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {currentSettings?.toronto_flat_rate.enabled && (
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <span className="text-sm font-medium">Toronto</span>
              <span className="text-sm text-[hsl(var(--brand-pink))] font-semibold">
                ${currentSettings.toronto_flat_rate.rate.toFixed(2)} flat rate
              </span>
            </div>
          )}
          {currentSettings?.gta_free_shipping.enabled && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">GTA (non-Toronto)</span>
              <span className="text-sm text-green-700 font-semibold">
                FREE over ${currentSettings.gta_free_shipping.threshold.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">Other Locations</span>
            <span className="text-sm text-blue-700 font-semibold">
              Stallion rates (fallback: ${currentSettings?.default_shipping.fallback_rate.toFixed(2)})
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingSettings;
