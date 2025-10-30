import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShippingAnalytics } from '@/hooks/useShippingAnalytics';
import { DollarSign, Package, Globe, Gift, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShippingLossTracker } from '@/components/admin/ShippingLossTracker';

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1'];

const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode === 'Unknown') return '🌍';
  
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return '🌍';
  
  return String.fromCodePoint(
    ...[...code].map(char => 127397 + char.charCodeAt(0))
  );
};

export default function AdminShippingAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  const { data: analytics, isLoading } = useShippingAnalytics(dateRange);

  if (isLoading) {
    return <div>Loading shipping analytics...</div>;
  }

  if (!analytics) {
    return <div>No shipping data available</div>;
  }

  const freeShippingRate = analytics.totalOrders > 0 
    ? Math.round((analytics.freeShippingOrders / analytics.totalOrders) * 100) 
    : 0;

  const hasStallionData = analytics.ordersWithStallionCost > 0;
  const isProfit = analytics.shippingProfit >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipping Analytics</h1>
        <p className="text-muted-foreground">Last 30 days shipping performance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loss-tracker">Loss Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {!hasStallionData && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Stallion cost tracking is not yet configured. The profit/loss metrics will show once you start tracking actual Stallion shipping costs in order records.
              </AlertDescription>
            </Alert>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shipping Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalShippingRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {analytics.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Shipping Cost
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.averageShippingCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Shipping Orders
            </CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.freeShippingOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {freeShippingRate}% of total orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Countries Served
            </CardTitle>
            <Globe className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.countriesServed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique destinations
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              You're Paying (Stallion)
            </CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${analytics.totalStallionCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Actual shipping costs · {analytics.ordersWithStallionCost} orders
            </p>
          </CardContent>
        </Card>

        <Card className={isProfit ? 'border-green-200' : 'border-red-200'}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isProfit ? 'Profit' : 'Loss'}
            </CardTitle>
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{analytics.shippingProfit >= 0 ? '$' : '-$'}{Math.abs(analytics.shippingProfit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.profitMargin.toFixed(1)}% margin
            </p>
          </CardContent>
          </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Shipping by Country - Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Revenue by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.shippingByCountry.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="country" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => getCountryFlag(value)}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      labelFormatter={(label) => `${getCountryFlag(label)} ${label}`}
                    />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders by Country - Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Order Distribution by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.shippingByCountry.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${getCountryFlag(entry.country)} ${entry.orders}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="orders"
                    >
                      {analytics.shippingByCountry.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name, entry: any) => [
                        `${value} orders`,
                        `${getCountryFlag(entry.payload.country)} ${entry.payload.country}`
                      ]}
                    />
                    <Legend 
                      formatter={(value, entry: any) => `${getCountryFlag(entry.payload.country)} ${entry.payload.country}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Countries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Shipping Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.shippingByCountry.slice(0, 10).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCountryFlag(country.country)}</span>
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-sm text-muted-foreground">{country.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${country.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(country.revenue / country.orders).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loss-tracker" className="mt-6">
          <ShippingLossTracker startDate={dateRange.start} endDate={dateRange.end} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
