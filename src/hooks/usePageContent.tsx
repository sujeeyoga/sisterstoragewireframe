import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  video_url: string | null;
  image_url: string | null;
  display_order: number;
  enabled: boolean;
}

export function usePageContent(pageSlug: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('display_order');
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 60000,
  });

  const getSection = (sectionKey: string): PageContent | undefined => {
    return data?.find((item) => item.section_key === sectionKey);
  };

  const getSections = (prefix: string): PageContent[] => {
    return (data || []).filter((item) => item.section_key.startsWith(prefix));
  };

  return { content: data || [], isLoading, refetch, getSection, getSections };
}
