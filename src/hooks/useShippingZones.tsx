import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShippingZone, Address } from '@/lib/shippingZoneEngine';
import { toast } from 'sonner';

export const useShippingZones = () => {
  const queryClient = useQueryClient();

  // Fetch all zones with their rules and rates
  const { data: zones, isLoading, error } = useQuery({
    queryKey: ['shipping-zones'],
    queryFn: async () => {
      const { data: zonesData, error: zonesError } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('priority', { ascending: false });

      if (zonesError) throw zonesError;

      // Fetch rules for all zones
      const { data: rulesData, error: rulesError } = await supabase
        .from('shipping_zone_rules')
        .select('*');

      if (rulesError) throw rulesError;

      // Fetch rates for all zones
      const { data: ratesData, error: ratesError } = await supabase
        .from('shipping_zone_rates')
        .select('*')
        .order('display_order', { ascending: true });

      if (ratesError) throw ratesError;

      // Combine data
      const zones: ShippingZone[] = zonesData.map(zone => ({
        id: zone.id,
        name: zone.name,
        description: zone.description,
        priority: zone.priority,
        enabled: zone.enabled,
        rules: rulesData
          .filter(rule => rule.zone_id === zone.id)
          .map(rule => ({
            ...rule,
            rule_type: rule.rule_type as 'country' | 'province' | 'postal_code_pattern' | 'city',
          })),
        rates: ratesData
          .filter(rate => rate.zone_id === zone.id)
          .map(rate => ({
            ...rate,
            rate_type: rate.rate_type as 'flat_rate' | 'free_threshold',
          })),
      }));

      return zones;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch fallback settings
  const { data: fallbackSettings } = useQuery({
    queryKey: ['shipping-fallback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_fallback_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Calculate shipping using edge function
  const calculateShipping = async (address: Address, subtotal: number) => {
    const { data, error } = await supabase.functions.invoke('calculate-shipping-zones', {
      body: { address, subtotal },
    });

    if (error) throw error;
    return data;
  };

  // Create zone mutation
  const createZoneMutation = useMutation({
    mutationFn: async (zone: {
      name: string;
      description?: string;
      priority?: number;
      rules: Array<{ rule_type: string; rule_value: string }>;
      rates: Array<{
        method_name: string;
        rate_type: string;
        rate_amount: number;
        free_threshold?: number;
        display_order?: number;
      }>;
    }) => {
      // Create zone
      const { data: zoneData, error: zoneError } = await supabase
        .from('shipping_zones')
        .insert({
          name: zone.name,
          description: zone.description,
          priority: zone.priority || 100,
        })
        .select()
        .single();

      if (zoneError) throw zoneError;

      // Create rules
      if (zone.rules.length > 0) {
        const { error: rulesError } = await supabase
          .from('shipping_zone_rules')
          .insert(
            zone.rules.map(rule => ({
              zone_id: zoneData.id,
              rule_type: rule.rule_type,
              rule_value: rule.rule_value,
            }))
          );

        if (rulesError) throw rulesError;
      }

      // Create rates
      if (zone.rates.length > 0) {
        const { error: ratesError } = await supabase
          .from('shipping_zone_rates')
          .insert(
            zone.rates.map((rate, index) => ({
              zone_id: zoneData.id,
              method_name: rate.method_name,
              rate_type: rate.rate_type,
              rate_amount: rate.rate_amount,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order ?? index,
            }))
          );

        if (ratesError) throw ratesError;
      }

      return zoneData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      toast.success('Shipping zone created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create shipping zone');
      console.error(error);
    },
  });

  // Update zone mutation
  const updateZoneMutation = useMutation({
    mutationFn: async (zone: {
      id: string;
      name?: string;
      description?: string;
      priority?: number;
      enabled?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('shipping_zones')
        .update({
          name: zone.name,
          description: zone.description,
          priority: zone.priority,
          enabled: zone.enabled,
        })
        .eq('id', zone.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      toast.success('Shipping zone updated');
    },
    onError: () => {
      toast.error('Failed to update shipping zone');
    },
  });

  // Delete zone mutation
  const deleteZoneMutation = useMutation({
    mutationFn: async (zoneId: string) => {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', zoneId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      toast.success('Shipping zone deleted');
    },
    onError: () => {
      toast.error('Failed to delete shipping zone');
    },
  });

  // Update fallback settings mutation
  const updateFallbackMutation = useMutation({
    mutationFn: async (settings: {
      fallback_rate: number;
      fallback_method_name: string;
      enabled: boolean;
    }) => {
      // Check if fallback exists
      const { data: existing } = await supabase
        .from('shipping_fallback_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('shipping_fallback_settings')
          .update(settings)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipping_fallback_settings')
          .insert(settings);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-fallback'] });
      toast.success('Fallback settings updated');
    },
    onError: () => {
      toast.error('Failed to update fallback settings');
    },
  });

  return {
    zones,
    isLoading,
    error,
    fallbackSettings,
    calculateShipping,
    createZone: createZoneMutation.mutate,
    updateZone: updateZoneMutation.mutate,
    deleteZone: deleteZoneMutation.mutate,
    updateFallback: updateFallbackMutation.mutate,
    isCreating: createZoneMutation.isPending,
    isUpdating: updateZoneMutation.isPending,
    isDeleting: deleteZoneMutation.isPending,
  };
};
