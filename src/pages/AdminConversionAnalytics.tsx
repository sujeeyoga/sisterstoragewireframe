import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Users, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { useConversionAnalytics } from '@/hooks/useConversionAnalytics';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  ComposedChart
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminConversionAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const dateRangeValues = useMemo(() => {
    const end = new Date();
    let start: Date;

    switch (dateRange) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      default:
        start = subDays(end, 30);
    }

    return { start, end };
  }, [dateRange]);

  const { data, isLoading } = useConversionAnalytics(dateRangeValues);

  // Get top 5 best and worst performing days
  const topPerformingDays = useMemo(() => {
    if (!data?.dailyData) return [];
    return [...data.dailyData]
      .filter(d => d.orders > 0)
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);
  }, [data]);

  const bottomPerformingDays = useMemo(() => {
    if (!data?.dailyData) return [];
    return [...data.dailyData]
      .filter(d => d.orders > 0)
      .sort((a, b) => a.conversionRate - b.conversionRate)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/analytics')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conversion Analytics</h1>
            <p className="text-muted-foreground">
              Track how visitor traffic converts to sales
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
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${data?.overallConversionRate.toFixed(2)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : `${data?.totalOrders} orders from ${data?.uniqueVisitors} visitors`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views Per Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : Math.round(data?.averageViewsPerSale || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : `${data?.totalVisitors} total views`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : data?.totalVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : `${data?.uniqueVisitors.toLocaleString()} unique`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : data?.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              ${isLoading ? '...' : data?.totalRevenue.toFixed(2)} revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views vs Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Views vs Sales Trend</CardTitle>
          <CardDescription>
            Daily visitor traffic and order volume correlation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.dailyData && data.dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis yAxisId="left" className="text-xs" label={{ value: 'Visitors', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" className="text-xs" label={{ value: 'Orders', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Visitors') return [value, 'Visitors'];
                    if (name === 'Orders') return [value, 'Orders'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  fillOpacity={0.2}
                  name="Visitors"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="hsl(var(--secondary))"
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate Over Time</CardTitle>
            <CardDescription>
              Daily conversion percentage trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.dailyData && data.dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Conversion Rate']}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Views Per Sale Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Views Per Sale Ratio</CardTitle>
            <CardDescription>
              Efficiency metric - lower is better
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.dailyData && data.dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.dailyData.filter(d => d.orders > 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [Math.round(value), 'Views per Sale']}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                  <Line
                    type="monotone"
                    dataKey="viewsPerSale"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Days */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Days</CardTitle>
            <CardDescription>Best conversion rates by day</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">Views/Sale</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformingDays.length > 0 ? (
                  topPerformingDays.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">
                        {format(new Date(day.date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {day.conversionRate.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {Math.round(day.viewsPerSale)}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.orders}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bottom Performing Days */}
        <Card>
          <CardHeader>
            <CardTitle>Days Needing Improvement</CardTitle>
            <CardDescription>Lowest conversion rates by day</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">Views/Sale</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottomPerformingDays.length > 0 ? (
                  bottomPerformingDays.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">
                        {format(new Date(day.date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right text-amber-600 font-medium">
                        {day.conversionRate.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {Math.round(day.viewsPerSale)}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.orders}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConversionAnalytics;
