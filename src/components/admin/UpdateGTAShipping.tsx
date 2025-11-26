import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function UpdateGTAShipping() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Auto-run on mount
    if (!hasRun) {
      handleUpdate();
    }
  }, [hasRun]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Find GTA shipping zones
      const { data: zones, error: zonesError } = await supabase
        .from('shipping_zones')
        .select('id, name')
        .or('name.ilike.%GTA%,name.ilike.%Toronto%');

      if (zonesError) throw zonesError;

      const zoneIds = zones?.map(z => z.id) || [];

      // Update all rates for these zones
      const { error: updateError } = await supabase
        .from('shipping_zone_rates')
        .update({
          rate_amount: 4.99,
          free_threshold: 50
        })
        .in('zone_id', zoneIds);

      if (updateError) throw updateError;

      // Invalidate shipping queries
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-thresholds'] });

      toast.success('GTA shipping updated: $4.99 flat rate, free over $50');
      setHasRun(true);
    } catch (error: any) {
      console.error('Error updating GTA shipping:', error);
      toast.error(error.message || 'Failed to update shipping rates');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdate} 
      disabled={isUpdating}
      variant="outline"
      size="sm"
    >
      {isUpdating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 h-4 w-4" />
      )}
      {hasRun ? 'Re-update' : 'Updating'} GTA Rates
    </Button>
  );
}
