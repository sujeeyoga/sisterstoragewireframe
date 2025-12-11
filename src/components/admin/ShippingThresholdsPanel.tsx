import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Truck, DollarSign } from 'lucide-react';

interface ZoneThreshold {
  zone_id: string;
  zone_name: string;
  rate_id: string;
  method_name: string;
  rate_amount: number;
  free_threshold: number | null;
}

export function ShippingThresholdsPanel() {
  const queryClient = useQueryClient();
  const [editedThresholds, setEditedThresholds] = useState<Record<string, { rate_amount: number; free_threshold: number | null }>>({});

  const { data: thresholds, isLoading } = useQuery({
    queryKey: ['shipping-thresholds-admin'],
    queryFn: async () => {
      const { data: zones, error: zonesError } = await supabase
        .from('shipping_zones')
        .select(`
          id,
          name,
          shipping_zone_rates (
            id,
            method_name,
            rate_amount,
            free_threshold,
            enabled
          )
        `)
        .eq('enabled', true)
        .order('priority', { ascending: true });

      if (zonesError) throw zonesError;

      const result: ZoneThreshold[] = [];
      
      zones?.forEach(zone => {
        zone.shipping_zone_rates
          ?.filter((rate: any) => rate.enabled)
          ?.forEach((rate: any) => {
            result.push({
              zone_id: zone.id,
              zone_name: zone.name,
              rate_id: rate.id,
              method_name: rate.method_name,
              rate_amount: rate.rate_amount,
              free_threshold: rate.free_threshold,
            });
          });
      });

      return result;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: { rate_id: string; rate_amount: number; free_threshold: number | null }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('shipping_zone_rates')
          .update({
            rate_amount: update.rate_amount,
            free_threshold: update.free_threshold,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.rate_id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-thresholds-admin'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-thresholds'] });
      setEditedThresholds({});
      toast.success('Shipping thresholds updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const handleThresholdChange = (rateId: string, field: 'rate_amount' | 'free_threshold', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setEditedThresholds(prev => ({
      ...prev,
      [rateId]: {
        ...prev[rateId],
        rate_amount: prev[rateId]?.rate_amount ?? thresholds?.find(t => t.rate_id === rateId)?.rate_amount ?? 0,
        free_threshold: prev[rateId]?.free_threshold ?? thresholds?.find(t => t.rate_id === rateId)?.free_threshold ?? null,
        [field]: numValue,
      },
    }));
  };

  const getValue = (rateId: string, field: 'rate_amount' | 'free_threshold'): string => {
    if (editedThresholds[rateId] !== undefined) {
      const value = editedThresholds[rateId][field];
      return value === null ? '' : String(value);
    }
    const threshold = thresholds?.find(t => t.rate_id === rateId);
    if (!threshold) return '';
    const value = threshold[field];
    return value === null ? '' : String(value);
  };

  const hasChanges = Object.keys(editedThresholds).length > 0;

  const handleSave = () => {
    const updates = Object.entries(editedThresholds).map(([rate_id, values]) => ({
      rate_id,
      rate_amount: values.rate_amount,
      free_threshold: values.free_threshold,
    }));

    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group thresholds by zone
  const groupedByZone = thresholds?.reduce((acc, t) => {
    if (!acc[t.zone_id]) {
      acc[t.zone_id] = { zone_name: t.zone_name, rates: [] };
    }
    acc[t.zone_id].rates.push(t);
    return acc;
  }, {} as Record<string, { zone_name: string; rates: ZoneThreshold[] }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping Thresholds</h1>
          <p className="text-muted-foreground">
            Manage flat rates and free shipping thresholds for each zone
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupedByZone && Object.entries(groupedByZone).map(([zoneId, { zone_name, rates }]) => (
          <Card key={zoneId}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-muted-foreground" />
                {zone_name}
              </CardTitle>
              <CardDescription>
                {rates.length} shipping method{rates.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rates.map((rate) => (
                <div key={rate.rate_id} className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{rate.method_name}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Flat Rate
                      </Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={getValue(rate.rate_id, 'rate_amount')}
                          onChange={(e) => handleThresholdChange(rate.rate_id, 'rate_amount', e.target.value)}
                          className="pl-6 h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Free Over</Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          placeholder="None"
                          value={getValue(rate.rate_id, 'free_threshold')}
                          onChange={(e) => handleThresholdChange(rate.rate_id, 'free_threshold', e.target.value)}
                          className="pl-6 h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!thresholds || thresholds.length === 0) && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No shipping zones configured. Go to Shipping Zones to add zones first.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
