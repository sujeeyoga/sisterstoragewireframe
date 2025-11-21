import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Loader2, Mail, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface OrderWithoutNotification {
  id: string | number;
  order_number?: string;
  customer_email?: string;
  customer_name?: string;
  tracking_number: string;
  carrier_name?: string;
  fulfilled_at: string;
  source: 'stripe' | 'woocommerce';
  items?: any;
  line_items?: any;
  billing?: any;
}

export function BulkShippingNotificationTool() {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<Array<{ orderId: string | number; success: boolean; error?: string }>>([]);

  // Fetch fulfilled orders without shipping notifications
  const { data: ordersWithoutNotifications, isLoading, refetch } = useQuery({
    queryKey: ['orders-without-shipping-notifications'],
    queryFn: async () => {
      // Fetch from Stripe orders
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('fulfillment_status', 'fulfilled')
        .is('shipping_notification_sent_at', null)
        .not('tracking_number', 'is', null)
        .order('fulfilled_at', { ascending: false });

      // Fetch from WooCommerce orders
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('*')
        .eq('fulfillment_status', 'fulfilled')
        .is('shipping_notification_sent_at', null)
        .not('tracking_number', 'is', null)
        .order('fulfilled_at', { ascending: false });

      const allOrders: OrderWithoutNotification[] = [
        ...(stripeOrders || []).map(o => ({ ...o, source: 'stripe' as const })),
        ...(wooOrders || []).map(o => ({ ...o, source: 'woocommerce' as const }))
      ];

      return allOrders;
    },
  });

  const handleSendNotifications = async () => {
    if (!ordersWithoutNotifications || ordersWithoutNotifications.length === 0) {
      toast.error('No orders to process');
      return;
    }

    setSending(true);
    setProgress({ current: 0, total: ordersWithoutNotifications.length });
    const sendResults: Array<{ orderId: string | number; success: boolean; error?: string }> = [];

    for (let i = 0; i < ordersWithoutNotifications.length; i++) {
      const order = ordersWithoutNotifications[i];
      setProgress({ current: i + 1, total: ordersWithoutNotifications.length });

      try {
        const customerEmail = order.customer_email || (order.source === 'woocommerce' && order.billing ? (order.billing as any).email : '');
        const customerName = order.customer_name || (order.source === 'woocommerce' && order.billing ? 
          `${(order.billing as any).first_name || ''} ${(order.billing as any).last_name || ''}`.trim() : 'Customer');
        
        const { error } = await supabase.functions.invoke('send-shipping-notification', {
          body: {
            orderId: order.id,
            customerEmail: customerEmail || '',
            customerName: customerName || 'Customer',
            orderNumber: order.order_number || String(order.id),
            trackingNumber: order.tracking_number,
            carrier: order.carrier_name || 'Carrier',
            items: order.items || order.line_items || []
          }
        });

        if (error) {
          throw error;
        }

        sendResults.push({ orderId: order.id, success: true });
      } catch (error: any) {
        console.error(`Failed to send notification for order ${order.id}:`, error);
        sendResults.push({ 
          orderId: order.id, 
          success: false, 
          error: error.message || 'Unknown error' 
        });
      }
    }

    setResults(sendResults);
    setSending(false);

    const successCount = sendResults.filter(r => r.success).length;
    const failedCount = sendResults.length - successCount;

    if (successCount > 0) {
      toast.success(`Sent ${successCount} shipping notification(s)`);
    }
    if (failedCount > 0) {
      toast.error(`Failed to send ${failedCount} notification(s)`);
    }

    // Refresh the list
    refetch();
  };

  const handleReset = () => {
    setResults([]);
    setProgress({ current: 0, total: 0 });
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Bulk Shipping Notifications
          </CardTitle>
          <CardDescription>
            Send shipping notifications to customers who haven't received them
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Bulk Shipping Notifications
        </CardTitle>
        <CardDescription>
          Send shipping notifications to customers who haven't received them
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 ? (
          <>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Orders without shipping notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Fulfilled orders with tracking numbers but no notification sent
                </p>
              </div>
              <Badge variant={ordersWithoutNotifications && ordersWithoutNotifications.length > 0 ? "destructive" : "secondary"} className="text-lg px-3 py-1">
                {ordersWithoutNotifications?.length || 0}
              </Badge>
            </div>

            {ordersWithoutNotifications && ordersWithoutNotifications.length > 0 && (
              <>
                <ScrollArea className="h-[300px] border rounded-lg">
                  <div className="p-4 space-y-2">
                    {ordersWithoutNotifications.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Order #{order.order_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer_name} • {order.customer_email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Package className="h-3 w-3 mr-1" />
                              {order.tracking_number}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {order.carrier_name || 'Unknown Carrier'}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(order.fulfilled_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendNotifications}
                    disabled={sending}
                    className="flex-1"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending {progress.current}/{progress.total}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send All Notifications
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {ordersWithoutNotifications && ordersWithoutNotifications.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  All fulfilled orders have shipping notifications sent!
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Successfully sent
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {results.filter(r => r.success).length}
                </Badge>
              </div>

              {results.some(r => !r.success) && (
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">
                      Failed to send
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {results.filter(r => !r.success).length}
                  </Badge>
                </div>
              )}
            </div>

            {results.some(r => !r.success) && (
              <ScrollArea className="h-[200px] border rounded-lg">
                <div className="p-4 space-y-2">
                  {results.filter(r => !r.success).map((result) => {
                    const order = ordersWithoutNotifications?.find(o => o.id === result.orderId);
                    return (
                      <div key={result.orderId} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-red-900">
                            Order #{order?.order_number || result.orderId}
                          </p>
                          <p className="text-xs text-red-700">
                            {result.error}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full">
              Back to Orders List
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
