import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InventorySettings {
  lowStock: {
    threshold: number;
    showBadge: boolean;
    emailNotify: boolean;
    autoHide: boolean;
    adminEmail: string;
  };
  preorders: {
    enabled: boolean;
    showRestockDate: boolean;
    badgeText: string;
    notifyEmail: boolean;
  };
}

export function useInventorySettings() {
  const { data: lowStockData, isLoading: isLoadingLowStock } = useQuery({
    queryKey: ['store-settings', 'low-stock-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'low_stock_alerts')
        .maybeSingle();

      if (error) throw error;

      const value = data?.setting_value as any;
      return {
        threshold: value?.threshold || 5,
        showBadge: value?.showBadge !== false,
        emailNotify: value?.emailNotify || false,
        autoHide: value?.autoHide || false,
        adminEmail: value?.adminEmail || '',
      };
    },
    staleTime: 30000,
  });

  const { data: preorderData, isLoading: isLoadingPreorder } = useQuery({
    queryKey: ['store-settings', 'preorders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'preorders')
        .maybeSingle();

      if (error) throw error;

      const value = data?.setting_value as any;
      return {
        enabled: data?.enabled || false,
        showRestockDate: value?.showRestockDate !== false,
        badgeText: value?.badgeText || 'Pre-Order',
        notifyEmail: value?.notifyEmail || false,
      };
    },
    staleTime: 30000,
  });

  const isLowStock = (stockQuantity: number | undefined) => {
    if (!stockQuantity || !lowStockData) return false;
    return stockQuantity <= lowStockData.threshold && stockQuantity > 0;
  };

  const isOutOfStock = (stockQuantity: number | undefined) => {
    return !stockQuantity || stockQuantity === 0;
  };

  const shouldShowProduct = (stockQuantity: number | undefined) => {
    if (!lowStockData?.autoHide) return true;
    return !isOutOfStock(stockQuantity);
  };

  return {
    lowStock: lowStockData,
    preorders: preorderData,
    isLoading: isLoadingLowStock || isLoadingPreorder,
    isLowStock,
    isOutOfStock,
    shouldShowProduct,
  };
}
