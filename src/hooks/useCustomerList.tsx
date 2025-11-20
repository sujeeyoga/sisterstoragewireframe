import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  customer_email: string;
  customer_name: string;
  order_count: number;
  total_spent: number;
  last_order_date: string;
  first_order_date: string;
}

export const useCustomerList = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customer-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_list')
        .select('*')
        .order('total_spent', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
  });

  const getSegmentedCustomers = (segment: string, customFilter?: any) => {
    if (!customers) return [];

    switch (segment) {
      case 'all':
        return customers;
      
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return customers.filter(c => new Date(c.last_order_date) > thirtyDaysAgo);
      
      case 'high-value':
        return customers.filter(c => c.total_spent > 200);
      
      case 'first-time':
        return customers.filter(c => c.order_count === 1);
      
      case 'repeat':
        return customers.filter(c => c.order_count > 1);
      
      case 'custom':
        if (customFilter) {
          return customers.filter(c => {
            let matches = true;
            
            if (customFilter.minSpent) {
              matches = matches && c.total_spent >= customFilter.minSpent;
            }
            
            if (customFilter.minOrders) {
              matches = matches && c.order_count >= customFilter.minOrders;
            }
            
            if (customFilter.lastOrderDays) {
              const cutoffDate = new Date();
              cutoffDate.setDate(cutoffDate.getDate() - customFilter.lastOrderDays);
              matches = matches && new Date(c.last_order_date) > cutoffDate;
            }
            
            return matches;
          });
        }
        return customers;
      
      default:
        return customers;
    }
  };

  return {
    customers,
    isLoading,
    getSegmentedCustomers,
  };
};
