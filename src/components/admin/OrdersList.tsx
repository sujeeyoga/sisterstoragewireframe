import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrderCard } from './OrderCard';
import { OrdersHeader } from './OrdersHeader';
import { OrderFilters, OrderFiltersState } from './OrderFilters';
import { OrderBulkBar } from './OrderBulkBar';
import { OrderDrawer } from './OrderDrawer';
import { BulkFulfillmentDialog } from './BulkFulfillmentDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Package, RotateCcw } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const [bulkFulfillOpen, setBulkFulfillOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [filters, setFilters] = useState<OrderFiltersState>({
    dateRange: 'all',
    statuses: [],
    sortBy: 'newest',
  });
  
  const queryClient = useQueryClient();
  
  // Real-time subscription for new orders
  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
          
          if (payload.eventType === 'INSERT') {
            toast.success('New order received!', {
              description: `Order #${payload.new.order_number || payload.new.id}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Get total count for pagination
  const { data: totalCount } = useQuery({
    queryKey: ['admin-orders-count', activeStatus, filters],
    queryFn: async () => {
      let wooQuery = supabase
        .from('woocommerce_orders')
        .select('id', { count: 'exact', head: true });
      
      let stripeQuery = supabase
        .from('orders')
        .select('id', { count: 'exact', head: true });
      
      if (activeStatus !== 'all') {
        wooQuery = wooQuery.eq('status', activeStatus);
        stripeQuery = stripeQuery.eq('status', activeStatus);
      }
      
      if (filters.statuses.length > 0) {
        wooQuery = wooQuery.in('status', filters.statuses);
        stripeQuery = stripeQuery.in('status', filters.statuses);
      }
      
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
      
      const [wooResult, stripeResult] = await Promise.all([wooQuery, stripeQuery]);
      
      return (wooResult.count || 0) + (stripeResult.count || 0);
    },
  });

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders', activeStatus, filters, currentPage],
    queryFn: async () => {
      // Calculate offset for pagination
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Fetch from both WooCommerce and Stripe orders with pagination
      let wooQuery = supabase
        .from('woocommerce_orders')
        .select('*')
        .range(offset, offset + itemsPerPage - 1);
      
      let stripeQuery = supabase
        .from('orders')
        .select('*')
        .range(offset, offset + itemsPerPage - 1);
      
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
    setBulkFulfillOpen(true);
  };
  
  const handleBulkPrint = async () => {
    // Fetch orders to get label URLs
    const stringIds = Array.from(selectedOrderIds).filter(id => typeof id === 'string');
    const numberIds = Array.from(selectedOrderIds).filter(id => typeof id === 'number');
    
    const { data: stripeOrders } = stringIds.length > 0 ? await supabase
      .from('orders')
      .select('id, shipping_label_url, order_number')
      .in('id', stringIds as string[]) : { data: [] };
    
    const { data: wooOrders } = numberIds.length > 0 ? await supabase
      .from('woocommerce_orders')
      .select('id, shipping_label_url')
      .in('id', numberIds as number[]) : { data: [] };
    
    const allOrders = [...(stripeOrders || []), ...(wooOrders || [])];
    const ordersWithLabels = allOrders.filter(o => o.shipping_label_url);
    
    if (ordersWithLabels.length === 0) {
      toast.error('No shipping labels found for selected orders');
      return;
    }
    
    // Open each label in a new tab with slight delay
    ordersWithLabels.forEach((order, index) => {
      setTimeout(() => {
        window.open(order.shipping_label_url, '_blank');
      }, index * 300); // 300ms delay between each to avoid popup blocking
    });
    
    toast.success(`Opening ${ordersWithLabels.length} label(s)`, {
      description: ordersWithLabels.length < allOrders.length 
        ? `${allOrders.length - ordersWithLabels.length} order(s) don't have labels yet`
        : undefined
    });
  };
  
  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectedOrderIds(new Set());
    }
    setSelectionMode(!selectionMode);
  };
  
  const handleStatusChange = (newStatus: string) => {
    // Clear selection when changing filters
    if (selectedOrderIds.size > 0) {
      setSelectedOrderIds(new Set());
      toast.info('Selection cleared due to filter change');
    }
    setActiveStatus(newStatus);
    setCurrentPage(1); // Reset to first page
  };
  
  const handleSelectAll = () => {
    if (filteredOrders) {
      const allIds = new Set(filteredOrders.map(o => o.id));
      setSelectedOrderIds(allIds);
      toast.success(`Selected ${allIds.size} orders`);
    }
  };
  
  const handleDeselectAll = () => {
    setSelectedOrderIds(new Set());
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
          onStatusChange={handleStatusChange}
          onFilterClick={() => setFiltersOpen(true)}
          filterCount={filterCount}
          selectionMode={selectionMode}
          onToggleSelection={toggleSelectionMode}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          selectedCount={selectedOrderIds.size}
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
          selectionMode={selectionMode}
          onToggleSelection={toggleSelectionMode}
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
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <OrdersHeader
        search={search}
        onSearchChange={setSearch}
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        onFilterClick={() => setFiltersOpen(true)}
        filterCount={filterCount}
        selectionMode={selectionMode}
        onToggleSelection={toggleSelectionMode}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        selectedCount={selectedOrderIds.size}
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
        
        {/* Pagination */}
        {filteredOrders && filteredOrders.length > 0 && totalCount && totalCount > itemsPerPage && (
          <div className="flex justify-center pt-8 pb-4">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="cursor-pointer"
                  />
                )}
                {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and ±1 around current
                    const totalPages = Math.ceil(totalCount / itemsPerPage);
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if gap exists
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <PaginationEllipsis />}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}
                {currentPage < Math.ceil((totalCount || 0) / itemsPerPage) && (
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="cursor-pointer"
                  />
                )}
              </PaginationContent>
            </Pagination>
          </div>
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

      <BulkFulfillmentDialog
        orderIds={Array.from(selectedOrderIds)}
        open={bulkFulfillOpen}
        onClose={() => setBulkFulfillOpen(false)}
        onSuccess={() => {
          setSelectedOrderIds(new Set());
          setBulkFulfillOpen(false);
        }}
      />
    </div>
  );
}
