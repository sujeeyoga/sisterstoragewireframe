import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

interface AbandonedCartFilters {
  dateRange: { start: Date; end: Date };
  recoveryStatus: 'all' | 'pending' | 'recovered';
  reminderSent: 'all' | 'sent' | 'not_sent';
}

export const useAbandonedCartsList = (filters: AbandonedCartFilters) => {
  return useQuery({
    queryKey: ['abandoned-carts-list', filters],
    queryFn: async () => {
      let query = supabase
        .from('abandoned_carts')
        .select('*')
        .gte('created_at', startOfDay(filters.dateRange.start).toISOString())
        .lte('created_at', endOfDay(filters.dateRange.end).toISOString())
        .order('created_at', { ascending: false });

      // Apply recovery status filter
      if (filters.recoveryStatus === 'pending') {
        query = query.is('recovered_at', null);
      } else if (filters.recoveryStatus === 'recovered') {
        query = query.not('recovered_at', 'is', null);
      }

      // Apply reminder sent filter
      if (filters.reminderSent === 'sent') {
        query = query.not('reminder_sent_at', 'is', null);
      } else if (filters.reminderSent === 'not_sent') {
        query = query.is('reminder_sent_at', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    },
  });
};
