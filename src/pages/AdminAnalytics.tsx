import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, Package, Users, Calendar, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { useAbandonedCartAnalytics } from '@/hooks/useAbandonedCartAnalytics';
import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useOrderTimeSeriesAnalytics } from '@/hooks/useOrderTimeSeriesAnalytics';
import { useAbandonedCartTimeSeriesAnalytics } from '@/hooks/useAbandonedCartTimeSeriesAnalytics';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const dateRangeValues = useMemo(() => {
    const end = new Date();
    const start = subDays(end, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);
    return { start, end };
  }, [dateRange]);

  const { data: abandonedCartData, isLoading: isLoadingAbandoned } = useAbandonedCartAnalytics(dateRangeValues);
  const { data: orderData, isLoading: isLoadingOrders } = useOrderAnalytics(dateRangeValues);
  const { data: orderTimeSeries } = useOrderTimeSeriesAnalytics(dateRangeValues);
  const { data: abandonedCartTimeSeries } = useAbandonedCartTimeSeriesAnalytics(dateRangeValues);

  const reportCards = [
    {
      title: 'Visitor Analytics',
      description: 'Track site visitors by time and location',
      icon: Globe,
      stats: 'Real-time visitor tracking',
      link: '/admin/analytics/visitors',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Abandoned Checkouts',
      description: 'Track and recover abandoned shopping carts',
      icon: ShoppingCart,
      stats: isLoadingAbandoned 
        ? 'Loading...' 
        : `${abandonedCartData?.totalAbandoned || 0} carts worth $${(abandonedCartData?.totalValue || 0).toFixed(2)}`,
      link: '/admin/analytics/abandoned-checkouts',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Sales Reports',
      description: 'Detailed revenue and sales analytics',
      icon: TrendingUp,
      stats: 'Coming soon',
      link: '#',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      disabled: true,
    },
    {
      title: 'Product Reports',
      description: 'Product performance and inventory insights',
      icon: Package,
      stats: 'Coming soon',
      link: '#',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      disabled: true,
    },
    {
      title: 'Customer Reports',
      description: 'Customer behavior and lifetime value',
      icon: Users,
      stats: 'Coming soon',
      link: '#',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      disabled: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your store performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOrders ? '...' : `$${(orderData?.totalRevenue || 0).toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingOrders ? '...' : `$${(orderData?.averageOrderValue || 0).toFixed(2)} avg order`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOrders ? '...' : orderData?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingOrders ? '...' : `${orderData?.pendingOrders || 0} pending, ${orderData?.fulfilledOrders || 0} fulfilled`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandoned Carts</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAbandoned ? '...' : abandonedCartData?.totalAbandoned || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ${isLoadingAbandoned ? '...' : (abandonedCartData?.totalValue || 0).toFixed(2)} total value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAbandoned ? '...' : `${(abandonedCartData?.recoveryRate || 0).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingAbandoned ? '...' : abandonedCartData?.recoveredCount || 0} recovered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportCards.map((report) => (
            <Card
              key={report.title}
              className={`transition-all ${
                report.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md cursor-pointer'
              }`}
              onClick={() => !report.disabled && navigate(report.link)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-muted-foreground">{report.stats}</p>
                {!report.disabled && (
                  <Button variant="link" className="px-0 mt-2">
                    View Report →
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Orders Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>
              Daily revenue and order volume over time
            </CardDescription>
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
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                      if (name === 'orders') return [value, 'Orders'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={0.2}
                    name="Revenue ($)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Orders"
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No order data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abandoned Cart Recovery Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Abandoned Cart Recovery</CardTitle>
            <CardDescription>
              Daily abandoned vs recovered carts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {abandonedCartTimeSeries && abandonedCartTimeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={abandonedCartTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="abandoned" fill="hsl(var(--destructive))" name="Abandoned" />
                  <Bar dataKey="recovered" fill="hsl(var(--primary))" name="Recovered" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No abandoned cart data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recovery Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Rate Trend</CardTitle>
            <CardDescription>
              Percentage of recovered carts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {abandonedCartTimeSeries && abandonedCartTimeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={abandonedCartTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-xs" unit="%" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Recovery Rate']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recoveryRate" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Recovery Rate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No recovery data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
