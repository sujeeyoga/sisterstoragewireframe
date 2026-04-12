import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShopSection {
  id: string;
  name: string;
  title: string;
  subtitle: string | null;
  background_color: string | null;
  display_order: number;
  visible: boolean;
  layout_columns: number | null;
  category_filter: string | null;
}

// Map DB category_filter display names to product category slugs
const categoryFilterToSlug: Record<string, string[]> = {
  'Bundles': ['bundles'],
  'Bangle Boxes': ['bangle-boxes'],
  'Organizers': ['organizers'],
  'Open Box': ['open-box'],
};

export function slugsForFilter(filter: string | null): string[] {
  if (!filter) return [];
  return categoryFilterToSlug[filter] || [filter.toLowerCase().replace(/\s+/g, '-')];
}

export function useShopSections() {
  return useQuery({
    queryKey: ['shop-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_sections')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as ShopSection[];
    },
    staleTime: 60000,
  });
}
