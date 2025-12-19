import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, ShoppingCart, Package, User, Calendar, Download, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { subDays, format, differenceInDays } from 'date-fns';
import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useOrderTimeSeriesAnalytics } from '@/hooks/useOrderTimeSeriesAnalytics';
import { useProductProfitAnalytics } from '@/hooks/useProductProfitAnalytics';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AdminSalesReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '6m' | '12m' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  
  const dateRangeValues = useMemo(() => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      return { start: customStartDate, end: customEndDate };
    }
    const end = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : dateRange === '6m' ? 180 : 365;
    return { start: subDays(end, days), end };
  }, [dateRange, customStartDate, customEndDate]);

  const periodDays = differenceInDays(dateRangeValues.end, dateRangeValues.start) || 1;

  const { data: orderData, isLoading: isLoadingOrders } = useOrderAnalytics(dateRangeValues);
  const { data: orderTimeSeries } = useOrderTimeSeriesAnalytics(dateRangeValues);
  const { data: profitData, isLoading: isLoadingProfit } = useProductProfitAnalytics(dateRangeValues);

  // Fetch sales by product
  const { data: productSales } = useQuery({
    queryKey: ['product-sales', dateRangeValues],
    queryFn: async () => {
      // Fetch from WooCommerce orders
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('line_items, total')
        .gte('date_created', dateRangeValues.start.toISOString())
        .lte('date_created', dateRangeValues.end.toISOString());

      // Fetch from Stripe orders
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('items')
        .gte('created_at', dateRangeValues.start.toISOString())
        .lte('created_at', dateRangeValues.end.toISOString())
        .eq('payment_status', 'paid');

      const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

      // Process WooCommerce orders
      wooOrders?.forEach(order => {
        const items = order.line_items as any[];
        items?.forEach(item => {
          const existing = productMap.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
          productMap.set(item.name, {
            name: item.name,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.total || 0)
          });
        });
      });

      // Process Stripe orders
      stripeOrders?.forEach(order => {
        const items = order.items as any[];
        items?.forEach(item => {
          const existing = productMap.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
          productMap.set(item.name, {
            name: item.name,
            quantity: existing.quantity + (item.quantity || 1),
            revenue: existing.revenue + (item.price * (item.quantity || 1))
          });
        });
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
    },
  });

  // Fetch customers who bought the selected product
  const { data: productCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['product-customers', selectedProduct, dateRangeValues],
    queryFn: async () => {
      if (!selectedProduct) return [];

      const customers = new Map<string, { email: string; name: string; quantity: number; revenue: number }>();

      // Fetch from WooCommerce orders
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('line_items, billing, total')
        .gte('date_created', dateRangeValues.start.toISOString())
        .lte('date_created', dateRangeValues.end.toISOString());

      wooOrders?.forEach(order => {
        const items = order.line_items as any[];
        const billing = order.billing as any;
        const matchingItem = items?.find(item => item.name === selectedProduct);
        
        if (matchingItem && billing?.email) {
          const existing = customers.get(billing.email) || { 
            email: billing.email, 
            name: `${billing.first_name || ''} ${billing.last_name || ''}`.trim() || billing.email,
            quantity: 0, 
            revenue: 0 
          };
          customers.set(billing.email, {
            ...existing,
            quantity: existing.quantity + matchingItem.quantity,
            revenue: existing.revenue + (matchingItem.total || 0)
          });
        }
      });

      // Fetch from Stripe orders
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('items, customer_email, customer_name')
        .gte('created_at', dateRangeValues.start.toISOString())
        .lte('created_at', dateRangeValues.end.toISOString())
        .eq('payment_status', 'paid');

      stripeOrders?.forEach(order => {
        const items = order.items as any[];
        const matchingItem = items?.find(item => item.name === selectedProduct);
        
        if (matchingItem && order.customer_email) {
          const existing = customers.get(order.customer_email) || { 
            email: order.customer_email, 
            name: order.customer_name || order.customer_email,
            quantity: 0, 
            revenue: 0 
          };
          customers.set(order.customer_email, {
            ...existing,
            quantity: existing.quantity + (matchingItem.quantity || 1),
            revenue: existing.revenue + (matchingItem.price * (matchingItem.quantity || 1))
          });
        }
      });

      return Array.from(customers.values())
        .sort((a, b) => b.revenue - a.revenue);
    },
    enabled: !!selectedProduct,
  });

  const handleProductClick = (productName: string) => {
    setSelectedProduct(productName);
    setIsCustomerDialogOpen(true);
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin > 30) return 'text-green-600';
    if (margin >= 15) return 'text-amber-600';
    return 'text-red-600';
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate sales velocity
  const totalUnits = productSales?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const totalRevenue = orderData?.totalRevenue || 0;
  const unitsPerDay = (totalUnits / periodDays).toFixed(1);
  const revenuePerDay = (totalRevenue / periodDays).toFixed(2);

  // Export to CSV
  const handleExportCSV = () => {
    if (!profitData?.products || profitData.products.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }

    const headers = ['Product Name', 'Quantity Sold', 'Revenue', 'Shipping Cost', 'Refunds', 'Profit', 'Profit Margin %'];
    const rows = profitData.products.map(p => [
      `"${p.name}"`,
      p.quantity,
      p.revenue.toFixed(2),
      p.shippingCost.toFixed(2),
      p.refunds.toFixed(2),
      p.profit.toFixed(2),
      p.profitMargin.toFixed(1)
    ]);

    const csvContent = [
      `Sales Report: ${format(dateRangeValues.start, 'MMM d, yyyy')} - ${format(dateRangeValues.end, 'MMM d, yyyy')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(dateRangeValues.start, 'yyyy-MM-dd')}-${format(dateRangeValues.end, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "CSV exported successfully" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/analytics')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
            <p className="text-muted-foreground">
              {format(dateRangeValues.start, 'MMM d, yyyy')} - {format(dateRangeValues.end, 'MMM d, yyyy')} ({periodDays} days)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !customStartDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, "MMM d, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !customEndDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, "MMM d, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <Button variant="outline" size="icon" onClick={handleExportCSV} title="Export to CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoadingOrders ? '...' : (orderData?.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {orderData?.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isLoadingOrders ? '...' : (orderData?.averageOrderValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOrders ? '...' : orderData?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {orderData?.pendingOrders || 0} pending
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
              {totalUnits}
            </div>
            <p className="text-xs text-muted-foreground">
              Total units
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Velocity</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {unitsPerDay}/day
            </div>
            <p className="text-xs text-muted-foreground">
              ${revenuePerDay}/day revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isLoadingProfit ? '' : getProfitMarginColor(profitData?.averageProfitMargin || 0)}`}>
              {isLoadingProfit ? '...' : `${(profitData?.averageProfitMargin || 0).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily revenue and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            {orderTimeSeries && orderTimeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={orderTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--secondary))" strokeWidth={2} name="Orders" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products by Revenue with Profit Margin */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            <CardDescription>Best performing products with profit margins</CardDescription>
          </CardHeader>
          <CardContent>
            {profitData && profitData.products.length > 0 ? (
              <div className="space-y-4">
                {profitData.products.slice(0, 5).map((product, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleProductClick(product.name)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.quantity} units • <span className={getProfitMarginColor(product.profitMargin)}>{product.profitMargin.toFixed(1)}% margin</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">${product.profit.toFixed(2)} profit</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                {isLoadingProfit ? 'Loading...' : 'No product data'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profit Margin by Product */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin by Product</CardTitle>
            <CardDescription>Top 5 products by margin percentage</CardDescription>
          </CardHeader>
          <CardContent>
            {profitData && profitData.products.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData.products.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                  />
                  <YAxis className="text-xs" label={{ value: 'Margin %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Bar 
                    dataKey="profitMargin" 
                    fill="hsl(var(--primary))" 
                    name="Profit Margin"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {isLoadingProfit ? 'Loading...' : 'No data available'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Sales breakdown by product</CardDescription>
          </CardHeader>
          <CardContent>
            {productSales && productSales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productSales.slice(0, 5)}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `$${entry.revenue.toFixed(0)}`}
                  >
                    {productSales.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customers who purchased {selectedProduct}</DialogTitle>
            <DialogDescription>
              Customer purchase history for this product in the selected date range
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto">
            {isLoadingCustomers ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Loading customers...
              </div>
            ) : productCustomers && productCustomers.length > 0 ? (
              <div className="space-y-3">
                {productCustomers.map((customer, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${customer.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{customer.quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No customers found for this product
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSalesReports;
