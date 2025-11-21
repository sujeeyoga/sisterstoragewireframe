import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Mail, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MissingNotificationsWidget() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['missing-notifications-stats'],
    queryFn: async () => {
      // Count fulfilled orders without tracking numbers
      const { count: noTrackingStripe } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('fulfillment_status', 'fulfilled')
        .is('tracking_number', null);

      const { count: noTrackingWoo } = await supabase
        .from('woocommerce_orders')
        .select('*', { count: 'exact', head: true })
        .eq('fulfillment_status', 'fulfilled')
        .is('tracking_number', null);

      // Count fulfilled orders with tracking but no notification
      const { count: noNotificationStripe } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('fulfillment_status', 'fulfilled')
        .not('tracking_number', 'is', null)
        .is('shipping_notification_sent_at', null);

      const { count: noNotificationWoo } = await supabase
        .from('woocommerce_orders')
        .select('*', { count: 'exact', head: true })
        .eq('fulfillment_status', 'fulfilled')
        .not('tracking_number', 'is', null)
        .is('shipping_notification_sent_at', null);

      return {
        noTracking: (noTrackingStripe || 0) + (noTrackingWoo || 0),
        noNotification: (noNotificationStripe || 0) + (noNotificationWoo || 0),
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-4 w-4" />
            Shipping Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="h-8 w-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasIssues = (stats?.noTracking || 0) > 0 || (stats?.noNotification || 0) > 0;

  return (
    <Card className={hasIssues ? 'border-amber-200 bg-amber-50/50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className={`h-4 w-4 ${hasIssues ? 'text-amber-600' : 'text-muted-foreground'}`} />
          Shipping Issues
        </CardTitle>
        <CardDescription>
          {hasIssues ? 'Action required for fulfilled orders' : 'All orders properly notified'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasIssues ? (
          <>
            {(stats?.noTracking || 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-background border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Missing tracking numbers</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {stats?.noTracking}
                </Badge>
              </div>
            )}

            {(stats?.noNotification || 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-background border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Missing notifications</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {stats?.noNotification}
                </Badge>
              </div>
            )}

            <Button
              onClick={() => navigate('/admin/orders/shipping-notifications')}
              variant="outline"
              size="sm"
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Missing Notifications
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              All fulfilled orders have tracking and notifications
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
