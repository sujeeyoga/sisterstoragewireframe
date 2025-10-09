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
  id: number;
  status: string;
  total: number;
  currency: string;
  date_created: string;
  billing: any;
  shipping: any;
  line_items: any[];
  payment_method_title?: string;
  meta_data?: any;
}

export function OrdersList() {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
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
      let query = supabase
        .from('woocommerce_orders')
        .select('*');
      
      // Apply status filter
      if (activeStatus !== 'all') {
        query = query.eq('status', activeStatus);
      }
      
      // Apply additional filters
      if (filters.statuses.length > 0) {
        query = query.in('status', filters.statuses);
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
        
        query = query.gte('date_created', startDate.toISOString());
      }
      
      // Apply sorting
      const sortColumn = filters.sortBy.includes('amount') ? 'total' : 'date_created';
      const ascending = filters.sortBy === 'oldest' || filters.sortBy === 'amount_low';
      query = query.order(sortColumn, { ascending });
      
      const { data, error } = await query;
      if (error) {
        console.error('Orders fetch error:', error);
        throw error;
      }
      return data as Order[];
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const { error } = await supabase
        .from('woocommerce_orders')
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
      order.billing?.email?.toLowerCase().includes(searchLower);
    
    return matchesSearch;
  });
  
  const handleSelectOrder = (orderId: number, checked: boolean) => {
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
            updateStatusMutation.mutate({ orderId: selectedOrder.id, status: newStatus });
          }}
        />
      )}
    </div>
  );
}
