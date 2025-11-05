import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useProductProfitAnalytics } from '@/hooks/useProductProfitAnalytics';

const AdminProductReports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '6m' | '12m'>('30d');
  
  const dateRangeValues = useMemo(() => {
    const end = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : dateRange === '6m' ? 180 : 365;
    return { start: subDays(end, days), end };
  }, [dateRange]);

  const { data: profitData, isLoading: isLoadingProfit } = useProductProfitAnalytics(dateRangeValues);

  const getProfitMarginColor = (margin: number) => {
    if (margin > 30) return 'text-green-600';
    if (margin >= 15) return 'text-amber-600';
    return 'text-red-600';
  };

  // Fetch product performance data from both WooCommerce and Stripe orders
  const { data: productPerformance, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['product-performance', dateRangeValues],
    queryFn: async () => {
      // Fetch WooCommerce orders
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('line_items')
        .gte('date_created', dateRangeValues.start.toISOString())
        .lte('date_created', dateRangeValues.end.toISOString());

      // Fetch Stripe orders
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('items')
        .gte('created_at', dateRangeValues.start.toISOString())
        .lte('created_at', dateRangeValues.end.toISOString());

      const productMap = new Map<string, { name: string; quantity: number; revenue: number; orders: number }>();

      // Process WooCommerce orders
      wooOrders?.forEach(order => {
        const items = order.line_items as any[];
        items?.forEach(item => {
          const existing = productMap.get(item.name) || { name: item.name, quantity: 0, revenue: 0, orders: 0 };
          productMap.set(item.name, {
            name: item.name,
            quantity: existing.quantity + (item.quantity || 1),
            revenue: existing.revenue + Number(item.total || 0),
            orders: existing.orders + 1
          });
        });
      });

      // Process Stripe orders
      stripeOrders?.forEach(order => {
        const items = order.items as any[];
        items?.forEach(item => {
          const productName = item.name || item.title || 'Unknown Product';
          const existing = productMap.get(productName) || { name: productName, quantity: 0, revenue: 0, orders: 0 };
          productMap.set(productName, {
            name: productName,
            quantity: existing.quantity + (item.quantity || 1),
            revenue: existing.revenue + Number(item.price || 0) * (item.quantity || 1),
            orders: existing.orders + 1
          });
        });
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.quantity - a.quantity);
    },
  });

  // Fetch inventory data
  const { data: inventoryData } = useQuery({
    queryKey: ['inventory-status'],
    queryFn: async () => {
      const { data } = await supabase
        .from('woocommerce_products')
        .select('name, id');

      // Since we don't have stock fields, we'll use placeholder data
      return {
        lowStock: [],
        outOfStock: [],
        inStock: data || [],
        total: data?.length || 0
      };
    },
  });

  const topProducts = productPerformance?.slice(0, 10) || [];
  const slowMovers = productPerformance?.slice(-5).reverse() || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/analytics')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Reports</h1>
            <p className="text-muted-foreground">
              Product performance and inventory insights
            </p>
          </div>
        </div>
        <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              In catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingProducts ? '...' : (productPerformance?.reduce((sum, p) => sum + p.quantity, 0) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {inventoryData?.lowStock.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Need restock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventoryData?.outOfStock.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unavailable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Profitable</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoadingProfit ? (
              <div className="text-2xl font-bold">...</div>
            ) : profitData?.mostProfitable ? (
              <>
                <div className="text-2xl font-bold">${profitData.mostProfitable.profit.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground truncate">
                  {profitData.mostProfitable.name}
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold">$0.00</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Sellers with Profit */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products by units sold with profit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProfit ? (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Loading product data...
              </div>
            ) : profitData && profitData.products.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={profitData.products.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    className="text-xs"
                    width={150}
                    tickFormatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary) / 0.3)" name="Revenue ($)" />
                  <Bar dataKey="quantity" fill="hsl(var(--secondary))" name="Units Sold" />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" name="Profit ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">No sales data available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Product sales will appear here once orders are placed
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Recently added products</CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryData && inventoryData.inStock.length > 0 ? (
              <div className="space-y-3">
                {inventoryData.inStock.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No products found</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slow Movers with Profit Margin */}
        <Card>
          <CardHeader>
            <CardTitle>Slow Moving Products</CardTitle>
            <CardDescription>Products with low sales and margins</CardDescription>
          </CardHeader>
          <CardContent>
            {profitData && profitData.products.length > 0 ? (
              <div className="space-y-3">
                {profitData.products.slice(-5).reverse().map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.quantity} units • <span className={getProfitMarginColor(product.profitMargin)}>{product.profitMargin.toFixed(1)}% margin</span>
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ${product.revenue.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                {isLoadingProfit ? 'Loading...' : 'No data available'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProductReports;
