import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, TrendingUp, Package, Users, Calendar, Globe, Target, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAbandonedCartAnalytics } from '@/hooks/useAbandonedCartAnalytics';
import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useOrderTimeSeriesAnalytics } from '@/hooks/useOrderTimeSeriesAnalytics';
import { useAbandonedCartTimeSeriesAnalytics } from '@/hooks/useAbandonedCartTimeSeriesAnalytics';
import { useActiveCartAnalytics } from '@/hooks/useActiveCartAnalytics';
import { BackfillActiveCarts } from '@/components/admin/BackfillActiveCarts';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d' | '6m' | '12m' | '24m'>('today');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [useCustomRange, setUseCustomRange] = useState(false);
  
  const dateRangeValues = useMemo(() => {
    const end = new Date();
    let start: Date;
    
    switch (dateRange) {
      case 'today':
        start = startOfDay(end);
        break;
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      case '6m':
        start = subDays(end, 180);
        break;
      case '12m':
        start = subDays(end, 365);
        break;
      case '24m':
        start = subDays(end, 730);
        break;
      default:
        start = startOfDay(end);
    }
    
    return { start, end };
  }, [dateRange]);

  const revenueChartDateRange = useMemo(() => {
    if (useCustomRange && customDateRange.from && customDateRange.to) {
      return {
        start: startOfDay(customDateRange.from),
        end: endOfDay(customDateRange.to)
      };
    }
    return dateRangeValues;
  }, [useCustomRange, customDateRange, dateRangeValues]);

  const { data: abandonedCartData, isLoading: isLoadingAbandoned } = useAbandonedCartAnalytics(dateRangeValues);
  const { data: orderData, isLoading: isLoadingOrders } = useOrderAnalytics(dateRangeValues);
  const { data: orderTimeSeries } = useOrderTimeSeriesAnalytics(revenueChartDateRange);
  const { data: abandonedCartTimeSeries } = useAbandonedCartTimeSeriesAnalytics(dateRangeValues);
  const { data: activeCartData, isLoading: isLoadingActiveCarts } = useActiveCartAnalytics();

  const reportCards = [
    {
      title: 'Conversion Analytics',
      description: 'Track views-to-sale ratio and conversion trends',
      icon: Target,
      stats: 'Optimize conversion rates',
      link: '/admin/analytics/conversion',
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
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
      title: 'Active Carts',
      description: 'Real-time shoppers with items in cart',
      icon: ShoppingBag,
      stats: isLoadingActiveCarts 
        ? 'Loading...' 
        : `${activeCartData?.totalCarts || 0} shoppers | $${(activeCartData?.totalValue || 0).toFixed(2)} value`,
      link: '/admin/analytics/active-carts',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Sales Reports',
      description: 'Detailed revenue and sales analytics',
      icon: TrendingUp,
      stats: isLoadingOrders 
        ? 'Loading...' 
        : `$${(orderData?.totalRevenue || 0).toFixed(2)} revenue`,
      link: '/admin/analytics/sales',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Product Reports',
      description: 'Product performance and inventory insights',
      icon: Package,
      stats: 'View detailed insights',
      link: '/admin/analytics/products',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Customer Reports',
      description: 'Customer behavior and lifetime value',
      icon: Users,
      stats: 'Analyze customer data',
      link: '/admin/analytics/customers',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
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
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="24m">Last 24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Test Data Tool - Only for development */}
      <BackfillActiveCarts />

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
              className="hover:shadow-md cursor-pointer transition-all"
              onClick={() => navigate(report.link)}
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
                <Button variant="link" className="px-0 mt-2">
                  View Report →
                </Button>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Revenue & Orders Trend
                  {useCustomRange && (
                    <span className="text-xs text-muted-foreground font-normal">
                      (Custom Range)
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Daily revenue and order volume over time
                </CardDescription>
              </div>
              
              {/* Custom Date Range Picker */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal",
                        !customDateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {customDateRange.from ? (
                        customDateRange.to ? (
                          <>
                            {format(customDateRange.from, "MMM d, yyyy")} -{" "}
                            {format(customDateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(customDateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Pick dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={customDateRange.from}
                      selected={{
                        from: customDateRange.from,
                        to: customDateRange.to
                      }}
                      onSelect={(range) => {
                        setCustomDateRange({
                          from: range?.from,
                          to: range?.to
                        });
                        if (range?.from && range?.to) {
                          setUseCustomRange(true);
                        }
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date > new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                {/* Clear Custom Range Button */}
                {useCustomRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUseCustomRange(false);
                      setCustomDateRange({ from: undefined, to: undefined });
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
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
