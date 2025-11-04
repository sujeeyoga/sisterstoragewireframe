import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useAbandonedCartAnalytics } from '@/hooks/useAbandonedCartAnalytics';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays } from 'date-fns';

export function OrdersAnalyticsSummary() {
  const dateRange = {
    start: subDays(new Date(), 30),
    end: new Date()
  };

  const { data: orderData, isLoading: orderLoading, error: orderError } = useOrderAnalytics(dateRange);
  const { data: cartData, isLoading: cartLoading, error: cartError } = useAbandonedCartAnalytics(dateRange);

  console.log('[OrdersAnalyticsSummary] Loading states:', { orderLoading, cartLoading });
  console.log('[OrdersAnalyticsSummary] Data:', { orderData, cartData });
  console.log('[OrdersAnalyticsSummary] Errors:', { orderError, cartError });

  if (orderLoading || cartLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
        <p className="text-2xl font-bold text-foreground">
          ${orderData?.totalRevenue.toFixed(2) || '0.00'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ${orderData?.averageOrderValue.toFixed(2) || '0.00'} avg order
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-muted-foreground mb-1">Orders</p>
        <p className="text-2xl font-bold text-foreground">
          {orderData?.totalOrders || 0}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {orderData?.pendingOrders || 0} pending, {orderData?.fulfilledOrders || 0} fulfilled
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-muted-foreground mb-1">Abandoned Carts</p>
        <p className="text-2xl font-bold text-foreground">
          {cartData?.totalAbandoned || 0}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ${cartData?.totalValue.toFixed(2) || '0.00'} total value
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
        <p className="text-2xl font-bold text-foreground">
          {cartData?.recoveryRate.toFixed(1) || '0.0'}%
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {cartData?.recoveredCount || 0} recovered
        </p>
      </Card>
    </div>
  );
}
