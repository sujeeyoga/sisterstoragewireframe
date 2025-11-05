import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetProfitAnalytics } from "@/hooks/useNetProfitAnalytics";
import { DollarSign, TrendingUp, TrendingDown, Package, Truck, RotateCcw } from "lucide-react";
import { subDays, subMonths } from "date-fns";

const AdminProfitAnalytics = () => {
  const [dateRange, setDateRange] = useState("30");

  const dateRangeValues = useMemo(() => {
    const now = new Date();
    const start = dateRange === "7" ? subDays(now, 7) :
                 dateRange === "30" ? subDays(now, 30) :
                 dateRange === "90" ? subDays(now, 90) :
                 subMonths(now, 12);
    return { start, end: now };
  }, [dateRange]);

  const { data: analytics, isLoading, error } = useNetProfitAnalytics(dateRangeValues);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  console.log('AdminProfitAnalytics render:', { isLoading, hasData: !!analytics, analytics });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-destructive">Error loading analytics: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Net Profit Analytics</h1>
            <p className="text-muted-foreground">
              Track your actual earnings after costs
            </p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.netProfit)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercentage(analytics.profitMargin)} margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.grossRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.orderCount} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipping Costs</CardTitle>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(analytics.shippingCosts)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Carrier charges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refunds</CardTitle>
              <RotateCcw className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(analytics.refunds)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Money returned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Breakdown</CardTitle>
            <CardDescription>
              How your profit is calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Gross Revenue</span>
              <span className="font-semibold">{formatCurrency(analytics.grossRevenue)}</span>
            </div>
            <div className="flex justify-between items-center text-orange-600 pb-2 border-b">
              <span>Less: Shipping Costs</span>
              <span className="font-semibold">- {formatCurrency(analytics.shippingCosts)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600 pb-2 border-b">
              <span>Less: Refunds</span>
              <span className="font-semibold">- {formatCurrency(analytics.refunds)}</span>
            </div>
            {analytics.taxCollected > 0 && (
              <div className="flex justify-between items-center text-muted-foreground pb-2 border-b">
                <span>Tax Collected (informational)</span>
                <span className="font-semibold">{formatCurrency(analytics.taxCollected)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-bold text-green-600 pt-2">
              <span>Net Profit</span>
              <span>{formatCurrency(analytics.netProfit)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Profit Per Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.avgProfitPerOrder)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.profitMargin.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Shipping Cost Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.grossRevenue > 0 
                  ? ((analytics.shippingCosts / analytics.grossRevenue) * 100).toFixed(1)
                  : "0.0"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Of revenue
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfitAnalytics;
