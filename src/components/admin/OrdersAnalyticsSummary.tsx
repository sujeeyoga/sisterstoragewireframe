import { useOrderAnalytics } from '@/hooks/useOrderAnalytics';
import { useAbandonedCartAnalytics } from '@/hooks/useAbandonedCartAnalytics';
import { useVisitorPresence } from '@/hooks/useVisitorPresence';
import { useActiveCartAnalytics } from '@/hooks/useActiveCartAnalytics';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, DollarSign, ShoppingCart, Package, Clock, Users, TrendingUp, RotateCcw } from 'lucide-react';

export function OrdersAnalyticsSummary() {
  const navigate = useNavigate();
  
  const dateRange = useMemo(() => ({
    start: subDays(new Date(), 30),
    end: new Date()
  }), []);

  const { data: orderData, isLoading: orderLoading } = useOrderAnalytics(dateRange);
  const { data: cartData, isLoading: cartLoading } = useAbandonedCartAnalytics(dateRange);
  const { visitorCount } = useVisitorPresence();
  const { data: activeCartData, isLoading: activeCartLoading } = useActiveCartAnalytics();

  const awaitingFulfillment = (orderData?.pendingOrders || 0);

  if (orderLoading || cartLoading || activeCartLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      {/* Live Visitors */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/visitors')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Live Visitors</p>
            <p className="text-2xl font-bold text-foreground">{visitorCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently browsing</p>
          </div>
          <Activity className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Net Revenue */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/sales')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Net Revenue</p>
            <p className="text-2xl font-bold text-foreground">
              ${orderData?.totalRevenue.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">After $0.00 in refunds</p>
          </div>
          <DollarSign className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Total Orders */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-foreground">
              {orderData?.totalOrders || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All orders (30d)</p>
          </div>
          <ShoppingCart className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Avg Order Value */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/sales')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-foreground">
              ${orderData?.averageOrderValue.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Per order average</p>
          </div>
          <TrendingUp className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Awaiting Fulfillment */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.dispatchEvent(new CustomEvent('filter-pending-orders'));
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Awaiting Fulfillment</p>
            <p className="text-2xl font-bold text-foreground">{awaitingFulfillment}</p>
            <p className="text-xs text-muted-foreground mt-1">Need processing</p>
          </div>
          <Package className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Active Carts */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/active-carts')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Active Carts</p>
            <p className="text-2xl font-bold text-foreground">
              {activeCartData?.totalCarts || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ${activeCartData?.totalValue.toFixed(2) || '0.00'} total value
            </p>
          </div>
          <Users className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Abandoned Carts */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/abandoned-checkouts')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Abandoned Carts</p>
            <p className="text-2xl font-bold text-foreground">
              {cartData?.totalAbandoned || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ${cartData?.totalValue.toFixed(2) || '0.00'} total value
            </p>
          </div>
          <Clock className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>

      {/* Recovery Rate */}
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all group" 
        onClick={() => navigate('/admin/analytics/abandoned-checkouts')}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
            <p className="text-2xl font-bold text-foreground">
              {cartData?.recoveryRate.toFixed(1) || '0.0'}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {cartData?.recoveredCount || 0} recovered
            </p>
          </div>
          <RotateCcw className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
        </div>
      </Card>
    </div>
  );
}
