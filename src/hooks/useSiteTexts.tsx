import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteText {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  enabled: boolean;
}

export function useSiteTexts(sectionKey?: string) {
  const { data, isLoading } = useQuery({
    queryKey: sectionKey ? ['site-texts', sectionKey] : ['site-texts'],
    queryFn: async () => {
      if (sectionKey) {
        const { data, error } = await supabase
          .from('site_texts')
          .select('*')
          .eq('enabled', true)
          .eq('section_key', sectionKey)
          .single();
        if (error) throw error;
        return data as SiteText;
      } else {
        const { data, error } = await supabase
          .from('site_texts')
          .select('*')
          .eq('enabled', true);
        if (error) throw error;
        return data as SiteText[];
      }
    },
    staleTime: 60000, // Cache for 1 minute
  });

  const getText = (key: string): SiteText | undefined => {
    if (Array.isArray(data)) {
      return data.find((text) => text.section_key === key);
    }
    return undefined;
  };

  return {
    texts: data,
    isLoading,
    getText,
  };
}
