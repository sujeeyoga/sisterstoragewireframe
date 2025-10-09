import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Percent, Save } from 'lucide-react';
import { toast } from 'sonner';

interface StoreSetting {
  id: string;
  setting_key: string;
  setting_value: {
    percentage?: number;
    name?: string;
  };
  enabled: boolean;
}

export function StoreSettings() {
  const queryClient = useQueryClient();
  const [discountPercentage, setDiscountPercentage] = useState(20);
  const [discountName, setDiscountName] = useState('Store-Wide Sale');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'store_wide_discount')
        .single();

      if (error) throw error;
      
      if (data) {
        const value = data.setting_value as any;
        setDiscountPercentage(value?.percentage || 20);
        setDiscountName(value?.name || 'Store-Wide Sale');
      }
      
      return data as StoreSetting;
    },
  });

  const toggleDiscountMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('store_settings')
        .update({ enabled })
        .eq('setting_key', 'store_wide_discount');

      if (error) throw error;
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast.success(enabled ? 'Store-wide discount activated!' : 'Store-wide discount deactivated');
    },
    onError: () => {
      toast.error('Failed to update discount setting');
    },
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('store_settings')
        .update({
          setting_value: {
            percentage: discountPercentage,
            name: discountName,
          },
        })
        .eq('setting_key', 'store_wide_discount');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast.success('Discount settings updated');
    },
    onError: () => {
      toast.error('Failed to update discount settings');
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage global store configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Store-Wide Discount
          </CardTitle>
          <CardDescription>
            Apply a percentage discount to all products at checkout. Product prices remain unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="discount-toggle" className="text-base font-medium">
                Enable Store-Wide Discount
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, discount will be applied at checkout
              </p>
            </div>
            <Switch
              id="discount-toggle"
              checked={settings?.enabled || false}
              onCheckedChange={(checked) => toggleDiscountMutation.mutate(checked)}
              disabled={toggleDiscountMutation.isPending}
            />
          </div>

          {/* Discount Configuration */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="discount-percentage">Discount Percentage</Label>
              <div className="flex gap-2">
                <Input
                  id="discount-percentage"
                  type="number"
                  min="1"
                  max="99"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
                  className="max-w-[200px]"
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Percentage to discount from all products (1-99%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-name">Promotion Name</Label>
              <Input
                id="discount-name"
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                placeholder="e.g., Store-Wide Sale"
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Name displayed to customers at checkout
              </p>
            </div>

            <Button
              onClick={() => updateDiscountMutation.mutate()}
              disabled={updateDiscountMutation.isPending}
              className="mt-4"
            >
              {updateDiscountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          {settings?.enabled && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="font-medium text-primary mb-2">🎉 Active Promotion Preview</p>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">{discountName}</span> - {discountPercentage}% off all products
                </p>
                <p className="text-xs text-muted-foreground">
                  Example: $100 product → ${(100 * (1 - discountPercentage / 100)).toFixed(2)} at checkout
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
