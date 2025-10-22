import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LaunchCard } from "@/types/launch-card";

export const useLaunchCards = () => {
  return useQuery({
    queryKey: ['launch-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_cards')
        .select('*')
        .eq('enabled', true)
        .eq('status', 'upcoming')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as LaunchCard[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
