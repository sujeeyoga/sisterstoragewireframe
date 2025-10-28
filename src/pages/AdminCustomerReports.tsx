import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, UserPlus, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays, format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminCustomerReports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '6m' | '12m'>('30d');
  
  const dateRangeValues = useMemo(() => {
    const end = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : dateRange === '6m' ? 180 : 365;
    return { start: subDays(end, days), end };
  }, [dateRange]);

  // Fetch customer data
  const { data: customerData } = useQuery({
    queryKey: ['customer-analytics', dateRangeValues],
    queryFn: async () => {
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('billing, total, date_created')
        .gte('date_created', dateRangeValues.start.toISOString())
        .lte('date_created', dateRangeValues.end.toISOString());

      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('customer_email, total, created_at')
        .gte('created_at', dateRangeValues.start.toISOString())
        .lte('created_at', dateRangeValues.end.toISOString());

      // Build customer map
      const customerMap = new Map<string, { email: string; orders: number; revenue: number; firstOrder: Date; lastOrder: Date }>();

      wooOrders?.forEach(order => {
        const billing = order.billing as any;
        const email = billing?.email?.toLowerCase();
        if (!email) return;

        const existing = customerMap.get(email);
        const orderDate = new Date(order.date_created);

        customerMap.set(email, {
          email,
          orders: (existing?.orders || 0) + 1,
          revenue: (existing?.revenue || 0) + Number(order.total || 0),
          firstOrder: existing ? (orderDate < existing.firstOrder ? orderDate : existing.firstOrder) : orderDate,
          lastOrder: existing ? (orderDate > existing.lastOrder ? orderDate : existing.lastOrder) : orderDate
        });
      });

      stripeOrders?.forEach(order => {
        const email = order.customer_email?.toLowerCase();
        if (!email) return;

        const existing = customerMap.get(email);
        const orderDate = new Date(order.created_at);

        customerMap.set(email, {
          email,
          orders: (existing?.orders || 0) + 1,
          revenue: (existing?.revenue || 0) + Number(order.total || 0),
          firstOrder: existing ? (orderDate < existing.firstOrder ? orderDate : existing.firstOrder) : orderDate,
          lastOrder: existing ? (orderDate > existing.lastOrder ? orderDate : existing.lastOrder) : orderDate
        });
      });

      const customers = Array.from(customerMap.values());
      const newCustomers = customers.filter(c => c.firstOrder >= dateRangeValues.start);
      const returningCustomers = customers.filter(c => c.orders > 1);
      const avgLifetimeValue = customers.reduce((sum, c) => sum + c.revenue, 0) / customers.length;

      return {
        total: customers.length,
        new: newCustomers.length,
        returning: returningCustomers.length,
        avgLifetimeValue: avgLifetimeValue || 0,
        topCustomers: customers.sort((a, b) => b.revenue - a.revenue).slice(0, 10),
        customerSegments: [
          { name: 'One-time', value: customers.filter(c => c.orders === 1).length },
          { name: '2-3 Orders', value: customers.filter(c => c.orders >= 2 && c.orders <= 3).length },
          { name: '4-5 Orders', value: customers.filter(c => c.orders >= 4 && c.orders <= 5).length },
          { name: '6+ Orders', value: customers.filter(c => c.orders >= 6).length }
        ]
      };
    },
  });

  // Geographic distribution
  const { data: geoData } = useQuery({
    queryKey: ['geo-distribution', dateRangeValues],
    queryFn: async () => {
      const { data } = await supabase
        .from('woocommerce_orders')
        .select('billing')
        .gte('date_created', dateRangeValues.start.toISOString())
        .lte('date_created', dateRangeValues.end.toISOString());

      const stateMap = new Map<string, number>();
      data?.forEach(order => {
        const billing = order.billing as any;
        const state = billing?.state;
        if (state) {
          stateMap.set(state, (stateMap.get(state) || 0) + 1);
        }
      });

      return Array.from(stateMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    },
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/analytics')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Reports</h1>
            <p className="text-muted-foreground">
              Customer behavior and lifetime value insights
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.new || 0}</div>
            <p className="text-xs text-muted-foreground">
              First-time buyers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.returning || 0}</div>
            <p className="text-xs text-muted-foreground">
              {customerData?.total ? Math.round((customerData.returning / customerData.total) * 100) : 0}% retention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(customerData?.avgLifetimeValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Revenue</CardTitle>
            <CardDescription>Highest value customers</CardDescription>
          </CardHeader>
          <CardContent>
            {customerData && customerData.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {customerData.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.orders} orders
                      </p>
                    </div>
                    <p className="font-bold">${customer.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No customer data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Distribution by order frequency</CardDescription>
          </CardHeader>
          <CardContent>
            {customerData && customerData.customerSegments.some(s => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customerData.customerSegments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {customerData.customerSegments.map((entry, index) => (
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
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Orders by state/region</CardDescription>
          </CardHeader>
          <CardContent>
            {geoData && geoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geoData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    name="Orders"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No geographic data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomerReports;
