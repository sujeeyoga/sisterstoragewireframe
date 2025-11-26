import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FlashSale {
  id: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'bogo';
  discount_value: number;
  applies_to: 'all' | 'products' | 'categories';
  product_ids: number[] | null;
  category_slugs: string[] | null;
  starts_at: string;
  ends_at: string;
  enabled: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export function useFlashSales() {
  return useQuery({
    queryKey: ['flash-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_sales')
        .select('*')
        .order('priority', { ascending: false })
        .order('starts_at', { ascending: false });

      if (error) throw error;
      return data as FlashSale[];
    },
  });
}

export function useActiveFlashSales() {
  return useQuery({
    queryKey: ['flash-sales', 'active'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flash_sales')
        .select('*')
        .eq('enabled', true)
        .lte('starts_at', now)
        .gte('ends_at', now)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as FlashSale[];
    },
  });
}

export function useCreateFlashSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sale: Omit<FlashSale, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('flash_sales')
        .insert([{ ...sale, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast.success('Flash sale created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create flash sale: ${error.message}`);
    },
  });
}

export function useUpdateFlashSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FlashSale> & { id: string }) => {
      const { data, error } = await supabase
        .from('flash_sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast.success('Flash sale updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update flash sale: ${error.message}`);
    },
  });
}

export function useDeleteFlashSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flash_sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-sales'] });
      toast.success('Flash sale deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete flash sale: ${error.message}`);
    },
  });
}

export function getFlashSaleStatus(sale: FlashSale): 'active' | 'scheduled' | 'expired' {
  const now = new Date();
  const start = new Date(sale.starts_at);
  const end = new Date(sale.ends_at);

  if (now >= start && now <= end && sale.enabled) {
    return 'active';
  } else if (now < start) {
    return 'scheduled';
  } else {
    return 'expired';
  }
}

export function applyFlashSaleDiscount(
  price: number,
  sale: FlashSale
): { discountedPrice: number; discount: number } {
  let discount = 0;
  let discountedPrice = price;

  if (sale.discount_type === 'percentage') {
    discount = price * (sale.discount_value / 100);
    discountedPrice = price - discount;
  } else if (sale.discount_type === 'fixed_amount') {
    discount = Math.min(sale.discount_value, price);
    discountedPrice = price - discount;
  }
  // BOGO is handled at cart level, not per-item

  return { discountedPrice, discount };
}
