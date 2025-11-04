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
import { OrdersAnalyticsSummary } from './OrdersAnalyticsSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, RotateCcw, ArrowUpDown } from 'lucide-react';
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
  archived_at?: string;
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
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<OrderFiltersState>({
    dateRange: 'all',
    statuses: [],
    sortBy: 'newest',
  });
  
  const queryClient = useQueryClient();
  
  // Fetch status counts
  const { data: statusCounts } = useQuery({
    queryKey: ['order-status-counts', showArchived],
    queryFn: async () => {
      let wooQuery = supabase
        .from('woocommerce_orders')
        .select('status');
      
      let stripeQuery = supabase
        .from('orders')
        .select('status');
      
      // Filter archived/non-archived orders
      if (showArchived) {
        wooQuery = wooQuery.not('archived_at', 'is', null);
        stripeQuery = stripeQuery.not('archived_at', 'is', null);
      } else {
        wooQuery = wooQuery.is('archived_at', null);
        stripeQuery = stripeQuery.is('archived_at', null);
      }
      
      const [wooResult, stripeResult] = await Promise.all([
        wooQuery,
        stripeQuery
      ]);
      
      const allOrders = [
        ...(wooResult.data || []),
        ...(stripeResult.data || [])
      ];
      
      // Count by status
      const counts: Record<string, number> = {
        all: allOrders.length,
        pending: 0,
        processing: 0,
        completed: 0,
        refunded: 0,
        cancelled: 0,
      };
      
      allOrders.forEach(order => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++;
        }
      });
      
      return counts;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
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
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders', activeStatus, filters, currentPage, search, showArchived],
    queryFn: async () => {
      
      // Fetch ALL orders from both sources (we'll paginate client-side after search)
      let wooQuery = supabase
        .from('woocommerce_orders')
        .select('*');
      
      let stripeQuery = supabase
        .from('orders')
        .select('*');
      
      // Filter archived/non-archived orders
      if (showArchived) {
        wooQuery = wooQuery.not('archived_at', 'is', null);
        stripeQuery = stripeQuery.not('archived_at', 'is', null);
      } else {
        wooQuery = wooQuery.is('archived_at', null);
        stripeQuery = stripeQuery.is('archived_at', null);
      }
      
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
        total: Number(order.total ?? 0),
        subtotal: Number(order.subtotal ?? 0),
        shipping_cost: Number(order.shipping ?? 0),
        tax: Number(order.tax ?? 0),
        currency: 'CAD',
        date_created: order.created_at,
        billing: order.shipping_address ? {
          first_name: order.customer_name?.split(' ')[0] || '',
          last_name: order.customer_name?.split(' ').slice(1).join(' ') || '',
          email: order.customer_email
        } : {},
        shipping_address: order.shipping_address || {},
        shipping: order.shipping_address || {},
        line_items: order.items || [],
        source: 'stripe' as const,
        stripe_session_id: order.stripe_session_id,
        customer_email: order.customer_email,
        order_number: order.order_number
      }));
      
      // Combine orders
      let allOrders = [...wooOrders, ...stripeOrders];
      
      // Apply search filter BEFORE pagination
      if (search) {
        const searchLower = search.toLowerCase();
        allOrders = allOrders.filter(order => {
          const billing = order.billing as any;
          return (
            order.id.toString().includes(searchLower) ||
            billing?.first_name?.toLowerCase().includes(searchLower) ||
            billing?.last_name?.toLowerCase().includes(searchLower) ||
            billing?.email?.toLowerCase().includes(searchLower) ||
            (order as any).customer_email?.toLowerCase().includes(searchLower) ||
            (order as any).order_number?.toLowerCase().includes(searchLower)
          );
        });
      }
      
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
      
      // Apply pagination AFTER search and sort
      const offset = (currentPage - 1) * itemsPerPage;
      const paginatedOrders = allOrders.slice(offset, offset + itemsPerPage);
      
      return {
        orders: paginatedOrders as Order[],
        totalCount: allOrders.length
      };
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
  
  const archiveOrderMutation = useMutation({
    mutationFn: async ({ orderId, source, unarchive = false }: { orderId: number | string; source?: 'woocommerce' | 'stripe'; unarchive?: boolean }) => {
      const tableName = source === 'stripe' ? 'orders' : 'woocommerce_orders';
      const { error } = await supabase
        .from(tableName)
        .update({ 
          archived_at: unarchive ? null : new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(variables.unarchive ? 'Order restored successfully' : 'Order archived successfully');
    },
    onError: (error) => {
      console.error('Failed to archive order:', error);
      toast.error('Failed to archive order');
    },
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
  
  const [isPrintingLabels, setIsPrintingLabels] = useState(false);
  
  const handleBulkPrint = async () => {
    setIsPrintingLabels(true);
    try {
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
    } catch (error) {
      console.error('Error fetching labels:', error);
      toast.error('Failed to fetch shipping labels');
    } finally {
      setIsPrintingLabels(false);
    }
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
  
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleSelectAll = () => {
    if (orders?.orders) {
      const allIds = new Set<string | number>(orders.orders.map(o => o.id));
      setSelectedOrderIds(allIds);
      toast.success(`Selected ${allIds.size} orders on this page`);
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
        onSearchChange={handleSearchChange}
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        onFilterClick={() => setFiltersOpen(true)}
        filterCount={filterCount}
        selectionMode={selectionMode}
        onToggleSelection={toggleSelectionMode}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        selectedCount={selectedOrderIds.size}
        statusCounts={statusCounts}
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
          statusCounts={statusCounts}
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
          onSearchChange={handleSearchChange}
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          onFilterClick={() => setFiltersOpen(true)}
          filterCount={filterCount}
          selectionMode={selectionMode}
          onToggleSelection={toggleSelectionMode}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          selectedCount={selectedOrderIds.size}
          showArchived={showArchived}
          onToggleArchived={() => setShowArchived(!showArchived)}
          statusCounts={statusCounts}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

      <div className="p-4">
        <OrdersAnalyticsSummary />
      </div>
      
      <div className={`p-4 ${viewMode === 'list' ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
        {!orders?.orders || orders.orders.length === 0 ? (
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
        ) : viewMode === 'list' ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    {selectionMode && (
                      <th className="px-4 py-3 text-left w-12"></th>
                    )}
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => setFilters(f => ({ ...f, sortBy: f.sortBy === 'newest' ? 'oldest' : 'newest' }))}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium">Customer</th>
                    <th 
                      className="px-4 py-3 text-right text-xs font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => setFilters(f => ({ ...f, sortBy: f.sortBy === 'amount_high' ? 'amount_low' : 'amount_high' }))}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Total
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => !selectionMode && setSelectedOrder(order)}
                    >
                      {selectionMode && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.has(order.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectOrder(order.id, e.target.checked);
                            }}
                            className="rounded"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        {new Date(order.date_created).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {order.order_number || `#${order.id}`}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.billing?.first_name || order.billing?.email || 'Guest'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'processing' || order.status === 'pending' ? 'secondary' :
                          order.status === 'refunded' ? 'outline' :
                          'destructive'
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>{orders.orders.map((order) => (
             <OrderCard
              key={order.id}
              order={order}
              onView={() => setSelectedOrder(order)}
              isSelected={selectedOrderIds.has(order.id)}
              onSelect={(checked) => handleSelectOrder(order.id, checked)}
              selectionMode={selectionMode}
              onStatusUpdate={(status) => {
                updateStatusMutation.mutate({ 
                  orderId: order.id, 
                  status, 
                  source: order.source 
                });
              }}
              onArchive={() => {
                archiveOrderMutation.mutate({ 
                  orderId: order.id, 
                  source: order.source 
                });
              }}
              onUnarchive={() => {
                archiveOrderMutation.mutate({ 
                  orderId: order.id, 
                  source: order.source,
                  unarchive: true
                });
              }}
              onLongPress={() => {
                if (!selectionMode) {
                  setSelectionMode(true);
                  setSelectedOrderIds(new Set([order.id]));
                  toast.success('Selection mode enabled', {
                    description: 'Tap cards to select more orders'
                  });
                }
               }}
            />
          ))}</>
        )}
        
        {/* Pagination */}
        {orders?.orders && orders.orders.length > 0 && orders.totalCount > itemsPerPage && (
          <div className="flex justify-center pt-8 pb-4">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="cursor-pointer"
                  />
                )}
                {Array.from({ length: Math.ceil((orders?.totalCount || 0) / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and ±1 around current
                    const totalPages = Math.ceil((orders?.totalCount || 0) / itemsPerPage);
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
                {currentPage < Math.ceil((orders?.totalCount || 0) / itemsPerPage) && (
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
        onArchive={async () => {
          const count = selectedOrderIds.size;
          for (const orderId of selectedOrderIds) {
            const order = orders?.orders.find(o => o.id === orderId);
            if (order) {
              await archiveOrderMutation.mutateAsync({
                orderId,
                source: order.source
              });
            }
          }
          setSelectedOrderIds(new Set());
          toast.success(`Archived ${count} orders`);
        }}
        onCancel={() => setSelectedOrderIds(new Set())}
        isPrinting={isPrintingLabels}
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
        onRetryFailed={(failedIds) => {
          // Set selection to only failed orders and reopen dialog
          setSelectedOrderIds(new Set(failedIds));
          setTimeout(() => setBulkFulfillOpen(true), 300);
        }}
      />
    </div>
  );
}
