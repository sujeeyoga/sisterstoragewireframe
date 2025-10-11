import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrderCard } from './OrderCard';
import { OrdersHeader } from './OrdersHeader';
import { OrderFilters, OrderFiltersState } from './OrderFilters';
import { OrderBulkBar } from './OrderBulkBar';
import { OrderDrawer } from './OrderDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Package, RotateCcw } from 'lucide-react';

interface Order {
  id: number | string;
  status: string;
  total: number;
  currency?: string;
  date_created: string;
  billing: any;
  shipping: any;
  line_items: any[];
  payment_method_title?: string;
  meta_data?: any;
  source?: 'woocommerce' | 'stripe';
  stripe_session_id?: string;
  customer_email?: string;
  order_number?: string;
}

export function OrdersList() {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number | string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersState>({
    dateRange: 'all',
    statuses: [],
    sortBy: 'newest',
  });
  
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders', activeStatus, filters],
    queryFn: async () => {
      // Fetch from both WooCommerce and Stripe orders
      let wooQuery = supabase
        .from('woocommerce_orders')
        .select('*');
      
      let stripeQuery = supabase
        .from('orders')
        .select('*');
      
      // Apply status filter
      if (activeStatus !== 'all') {
        wooQuery = wooQuery.eq('status', activeStatus);
        stripeQuery = stripeQuery.eq('status', activeStatus);
      }
      
      // Apply additional filters
      if (filters.statuses.length > 0) {
        wooQuery = wooQuery.in('status', filters.statuses);
        stripeQuery = stripeQuery.in('status', filters.statuses);
      }
      
      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        if (filters.dateRange === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (filters.dateRange === '7d') {
          startDate.setDate(now.getDate() - 7);
        } else if (filters.dateRange === '30d') {
          startDate.setDate(now.getDate() - 30);
        }
        
        wooQuery = wooQuery.gte('date_created', startDate.toISOString());
        stripeQuery = stripeQuery.gte('created_at', startDate.toISOString());
      }
      
      // Fetch both
      const [wooResult, stripeResult] = await Promise.all([
        wooQuery,
        stripeQuery
      ]);
      
      if (wooResult.error) {
        console.error('WooCommerce orders fetch error:', wooResult.error);
      }
      if (stripeResult.error) {
        console.error('Stripe orders fetch error:', stripeResult.error);
      }
      
      // Transform and combine orders
      const wooOrders = (wooResult.data || []).map(order => ({
        ...order,
        source: 'woocommerce' as const,
        date_created: order.date_created || order.created_at
      }));
      
      const stripeOrders = (stripeResult.data || []).map(order => ({
        id: order.id,
        status: order.status,
        total: Number(order.total),
        currency: 'CAD',
        date_created: order.created_at,
        billing: order.shipping_address ? {
          first_name: order.customer_name?.split(' ')[0] || '',
          last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
          email: order.customer_email
        } : {},
        shipping: order.shipping_address || {},
        line_items: order.items || [],
        source: 'stripe' as const,
        stripe_session_id: order.stripe_session_id,
        customer_email: order.customer_email,
        order_number: order.order_number
      }));
      
      // Combine and sort
      const allOrders = [...wooOrders, ...stripeOrders];
      
      // Apply sorting
      const sortByAmount = filters.sortBy.includes('amount');
      const ascending = filters.sortBy === 'oldest' || filters.sortBy === 'amount_low';
      
      allOrders.sort((a, b) => {
        if (sortByAmount) {
          return ascending ? a.total - b.total : b.total - a.total;
        } else {
          const aDate = new Date(a.date_created).getTime();
          const bDate = new Date(b.date_created).getTime();
          return ascending ? aDate - bDate : bDate - aDate;
        }
      });
      
      return allOrders as Order[];
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, source }: { orderId: number | string; status: string; source?: 'woocommerce' | 'stripe' }) => {
      const tableName = source === 'stripe' ? 'orders' : 'woocommerce_orders';
      const { error } = await supabase
        .from(tableName)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order status');
    },
  });
  
  const filteredOrders = orders?.filter(order => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(searchLower) ||
      order.billing?.first_name?.toLowerCase().includes(searchLower) ||
      order.billing?.last_name?.toLowerCase().includes(searchLower) ||
      order.billing?.email?.toLowerCase().includes(searchLower) ||
      order.customer_email?.toLowerCase().includes(searchLower) ||
      order.order_number?.toLowerCase().includes(searchLower);
    
    return matchesSearch;
  });
  
  const handleSelectOrder = (orderId: number | string, checked: boolean) => {
    const newSelected = new Set(selectedOrderIds);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrderIds(newSelected);
  };
  
  const handleBulkFulfill = () => {
    toast.info('Bulk fulfill functionality coming soon');
  };
  
  const handleBulkPrint = () => {
    toast.info('Bulk print functionality coming soon');
  };
  
  const filterCount = 
    (filters.dateRange !== 'all' ? 1 : 0) + 
    filters.statuses.length + 
    (filters.sortBy !== 'newest' ? 1 : 0);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <OrdersHeader
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          onFilterClick={() => setFiltersOpen(true)}
          filterCount={filterCount}
        />
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <OrdersHeader
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          onFilterClick={() => setFiltersOpen(true)}
          filterCount={filterCount}
        />
        <div className="p-8 text-center space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <div>
            <p className="text-destructive font-semibold">Failed to load orders</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  const selectionMode = selectedOrderIds.size > 0;
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <OrdersHeader
        search={search}
        onSearchChange={setSearch}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        onFilterClick={() => setFiltersOpen(true)}
        filterCount={filterCount}
      />
      
      <div className="p-4 space-y-4">
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-semibold text-lg">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {search || filterCount > 0 
                  ? 'Try adjusting your search or filters' 
                  : 'Orders will appear here once customers make purchases'}
              </p>
            </div>
            {(search || filterCount > 0) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch('');
                  setFilters({ dateRange: 'all', statuses: [], sortBy: 'newest' });
                  setActiveStatus('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={() => setSelectedOrder(order)}
              isSelected={selectedOrderIds.has(order.id)}
              onSelect={(checked) => handleSelectOrder(order.id, checked)}
              selectionMode={selectionMode}
            />
          ))
        )}
      </div>
      
      <OrderBulkBar
        selectedCount={selectedOrderIds.size}
        onFulfill={handleBulkFulfill}
        onPrint={handleBulkPrint}
        onCancel={() => setSelectedOrderIds(new Set())}
      />
      
      <OrderFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
      />
      
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(newStatus) => {
            updateStatusMutation.mutate({ 
              orderId: selectedOrder.id, 
              status: newStatus,
              source: selectedOrder.source 
            });
          }}
        />
      )}
    </div>
  );
}
