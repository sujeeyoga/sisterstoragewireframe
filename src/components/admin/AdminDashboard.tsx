import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Package, Truck, Clock, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import HomeImageOptimizer from './HomeImageOptimizer';

export const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Real-time subscription for order updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['admin-recent-orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Get last 30 days data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch WooCommerce orders
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('*')
        .gte('date_created', thirtyDaysAgo.toISOString());

      // Fetch Stripe orders
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Combine all orders
      const allOrders = [
        ...(wooOrders || []).map(o => ({ 
          total: Number(o.total), 
          status: o.status,
          fulfillment_status: null 
        })),
        ...(stripeOrders || []).map(o => ({ 
          total: Number(o.total), 
          status: o.status,
          fulfillment_status: o.fulfillment_status 
        }))
      ];

      const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = allOrders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Order status breakdown
      const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'on-hold').length;
      const processingOrders = allOrders.filter(o => o.status === 'processing').length;
      const completedOrders = allOrders.filter(o => o.status === 'completed').length;

      // Fulfillment status (from Stripe orders only)
      const unfulfilledOrders = (stripeOrders || []).filter(o => 
        o.fulfillment_status === 'unfulfilled' || !o.fulfillment_status
      ).length;
      const fulfilledOrders = (stripeOrders || []).filter(o => 
        o.fulfillment_status === 'fulfilled'
      ).length;

      // Products stats
      const { count: totalProducts } = await supabase
        .from('woocommerce_products')
        .select('*', { count: 'exact', head: true });

      const { count: outOfStock } = await supabase
        .from('woocommerce_products')
        .select('*', { count: 'exact', head: true })
        .eq('in_stock', false);

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        pendingOrders,
        processingOrders,
        completedOrders,
        unfulfilledOrders,
        fulfilledOrders,
        totalProducts: totalProducts || 0,
        outOfStock: outOfStock || 0,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const [wooResult, stripeResult] = await Promise.all([
        supabase
          .from('woocommerce_orders')
          .select('*')
          .order('date_created', { ascending: false })
          .limit(3),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      const wooOrders = (wooResult.data || []).map(order => ({
        id: order.id,
        order_number: order.id.toString(),
        customer: `${(order.billing as any)?.first_name || ''} ${(order.billing as any)?.last_name || ''}`.trim() || 'Guest',
        total: Number(order.total),
        status: order.status,
        fulfillment_status: null,
        date: order.date_created,
        source: 'woocommerce' as const
      }));

      const stripeOrdersList = (stripeResult.data || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        customer: order.customer_name || 'Guest',
        total: Number(order.total),
        status: order.status,
        fulfillment_status: order.fulfillment_status,
        date: order.created_at,
        source: 'stripe' as const
      }));

      return [...wooOrders, ...stripeOrdersList]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    },
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'Pending' },
      'on-hold': { variant: 'secondary', label: 'On Hold' },
      processing: { variant: 'default', label: 'Processing' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      refunded: { variant: 'destructive', label: 'Refunded' },
      failed: { variant: 'destructive', label: 'Failed' },
    };

    const statusInfo = config[status] || config.pending;
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    );
  };

  const getFulfillmentBadge = (status: string | null) => {
    if (!status || status === 'unfulfilled') {
      return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Unfulfilled</Badge>;
    }
    if (status === 'fulfilled') {
      return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Fulfilled</Badge>;
    }
    if (status === 'processing') {
      return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
    }
    return null;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of your store performance (last 30 days)
        </p>
      </div>

      {/* Revenue & Orders KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${stats?.totalRevenue.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gross sales (30d)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All orders (30d)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${stats?.avgOrderValue.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per order average
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Awaiting Fulfillment
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.unfulfilledOrders || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need processing
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Status & Fulfillment Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Status
            </CardTitle>
            <CardDescription>Breakdown by order status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700">
                    {stats?.pendingOrders || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Processing</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    {stats?.processingOrders || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {stats?.completedOrders || 0}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Fulfillment Status
            </CardTitle>
            <CardDescription>Shipping & delivery tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Unfulfilled</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700">
                    {stats?.unfulfilledOrders || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Fulfilled</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {stats?.fulfilledOrders || 0}
                  </Badge>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/admin/orders">
                    <Button variant="outline" className="w-full">
                      <Truck className="h-4 w-4 mr-2" />
                      Manage Fulfillment
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders?.map((order) => (
                  <div key={`${order.source}-${order.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">#{order.order_number}</p>
                        {order.source === 'stripe' && (
                          <Badge variant="outline" className="text-xs">Stripe</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.date), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                      {getStatusBadge(order.status)}
                      {order.fulfillment_status && getFulfillmentBadge(order.fulfillment_status)}
                    </div>
                  </div>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent orders
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/admin/settings">
                <TrendingUp className="mr-2 h-4 w-4" />
                Store Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Product Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Products</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-2xl font-bold text-red-600">{stats?.outOfStock || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Out of Stock</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <Link to="/admin/products">
                <Button variant="outline" size="sm" className="mt-2">
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Optimizer */}
      <HomeImageOptimizer />
    </div>
  );
};
