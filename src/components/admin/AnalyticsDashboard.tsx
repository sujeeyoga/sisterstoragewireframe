import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingCart, TrendingUp, RotateCcw, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch WooCommerce and Stripe orders in parallel
      const [wooRes, stripeRes] = await Promise.all([
        supabase
          .from('woocommerce_orders')
          .select('*')
          .gte('date_created', thirtyDaysAgo.toISOString()),
        supabase
          .from('orders')
          .select('*')
          .gte('created_at', thirtyDaysAgo.toISOString()),
      ]);

      if (wooRes.error) throw wooRes.error;
      if (stripeRes.error) throw stripeRes.error;

      const wooOrders = wooRes.data || [];
      const stripeOrders = stripeRes.data || [];

      const allOrders = [
        ...wooOrders.map((o) => ({
          total: typeof o.total === 'number' ? o.total : parseFloat(String(o.total || '0')),
          status: o.status as string,
          refunded: (o.status as string) === 'refunded',
        })),
        ...stripeOrders.map((o: any) => ({
          total: typeof o.total === 'number' ? o.total : parseFloat(String(o.total || '0')),
          status: (o.status as string) || 'pending',
          refunded: ((o.payment_status as string) === 'refunded') || ((o.status as string) === 'refunded'),
        })),
      ];

      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, o) => sum + (Number.isFinite(o.total) ? o.total : 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const refundedOrders = allOrders.filter((o) => o.refunded).length;

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        refundedOrders,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const [wooRes, stripeRes] = await Promise.all([
        supabase
          .from('woocommerce_orders')
          .select('*')
          .order('date_created', { ascending: false })
          .limit(5),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (wooRes.error) throw wooRes.error;
      if (stripeRes.error) throw stripeRes.error;

      const wooOrders = (wooRes.data || []).map((order: any) => ({
        id: order.id,
        order_number: String(order.id),
        customer_name: `${order?.billing?.first_name || ''} ${order?.billing?.last_name || ''}`.trim() || 'Guest',
        total: typeof order.total === 'number' ? order.total : parseFloat(String(order.total || '0')),
        status: order.status as string,
        date: order.date_created as string,
        source: 'woocommerce' as const,
      }));

      const stripeOrders = (stripeRes.data || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number as string,
        customer_name: (order.customer_name as string) || 'Guest',
        total: typeof order.total === 'number' ? order.total : parseFloat(String(order.total || '0')),
        status: (order.status as string) || 'pending',
        date: order.created_at as string,
        source: 'stripe' as const,
      }));

      return [...wooOrders, ...stripeOrders]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    },
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('manage_stock', true)
        .lte('stock_quantity', 5)
        .eq('in_stock', true)
        .order('stock_quantity', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'default',
      'on-hold': 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      refunded: 'destructive',
      failed: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store performance (last 30 days)
        </p>
      </div>

      {/* KPI Cards - Bento Box Style */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Gross Merchandise Value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.averageOrderValue.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <RotateCcw className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.refundedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Refunded orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.map((order: any) => {
                const total = typeof order.total === 'number' ? order.total : parseFloat(String(order.total || '0'));
                return (
                  <div key={`${order.source}-${order.id}`} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Order #{order.order_number}</p>
                        <Badge variant="outline" className="text-xs">{order.source === 'stripe' ? 'Stripe' : 'Woo'}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.date), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        ${total.toFixed(2)}
                      </p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                );
              })}
              {(!recentOrders || recentOrders.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent orders
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="bg-white rounded-xl border-[0.5px] border-pink-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alert</CardTitle>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts?.map((product) => {
                const productPrice = product.price as any;
                const price = typeof productPrice === 'number' ? productPrice : parseFloat(String(productPrice || '0'));
                return (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="destructive">{product.stock_quantity} left</Badge>
                    </div>
                  </div>
                );
              })}
              {(!lowStockProducts || lowStockProducts.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All products have healthy stock levels
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Uploader */}
      <ImageUploader />
    </div>
  );
}
