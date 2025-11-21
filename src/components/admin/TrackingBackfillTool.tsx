import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  PackageX,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface OrderWithoutTracking {
  id: string | number;
  order_number?: string;
  customer_email: string;
  customer_name?: string;
  fulfilled_at: string;
  source: 'stripe' | 'woocommerce';
  tracking_number?: string;
  shipping_notification_sent_at?: string;
  billing?: any;
}

export function TrackingBackfillTool() {
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [sendingEmails, setSendingEmails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const queryClient = useQueryClient();

  // Fetch orders missing tracking numbers
  const { data: ordersWithoutTracking, isLoading: loadingWithoutTracking } = useQuery({
    queryKey: ['orders-without-tracking'],
    queryFn: async () => {
      const [stripeResult, wooResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('fulfillment_status', 'fulfilled')
          .is('tracking_number', null)
          .order('fulfilled_at', { ascending: false }),
        supabase
          .from('woocommerce_orders')
          .select('*')
          .eq('fulfillment_status', 'fulfilled')
          .is('tracking_number', null)
          .order('fulfilled_at', { ascending: false })
      ]);

      const stripeOrders: OrderWithoutTracking[] = (stripeResult.data || []).map(o => ({
        ...o,
        source: 'stripe' as const
      }));

      const wooOrders: OrderWithoutTracking[] = (wooResult.data || []).map(o => {
        const billing = o.billing as any;
        return {
          ...o,
          source: 'woocommerce' as const,
          customer_email: billing?.email || '',
          customer_name: `${billing?.first_name || ''} ${billing?.last_name || ''}`.trim()
        };
      });

      return [...stripeOrders, ...wooOrders];
    }
  });

  // Fetch orders with tracking but no notification sent
  const { data: ordersWithoutNotification, isLoading: loadingWithoutNotification } = useQuery({
    queryKey: ['orders-without-notification'],
    queryFn: async () => {
      const [stripeResult, wooResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('fulfillment_status', 'fulfilled')
          .not('tracking_number', 'is', null)
          .is('shipping_notification_sent_at', null)
          .order('fulfilled_at', { ascending: false }),
        supabase
          .from('woocommerce_orders')
          .select('*')
          .eq('fulfillment_status', 'fulfilled')
          .not('tracking_number', 'is', null)
          .is('shipping_notification_sent_at', null)
          .order('fulfilled_at', { ascending: false })
      ]);

      const stripeOrders: OrderWithoutTracking[] = (stripeResult.data || []).map(o => ({
        ...o,
        source: 'stripe' as const
      }));

      const wooOrders: OrderWithoutTracking[] = (wooResult.data || []).map(o => {
        const billing = o.billing as any;
        return {
          ...o,
          source: 'woocommerce' as const,
          customer_email: billing?.email || '',
          customer_name: `${billing?.first_name || ''} ${billing?.last_name || ''}`.trim()
        };
      });

      return [...stripeOrders, ...wooOrders];
    }
  });

  // Mutation to add tracking number
  const addTrackingMutation = useMutation({
    mutationFn: async ({ orderId, trackingNumber, source }: { orderId: string | number, trackingNumber: string, source: 'stripe' | 'woocommerce' }) => {
      const table = source === 'stripe' ? 'orders' : 'woocommerce_orders';
      const { error } = await supabase
        .from(table)
        .update({ tracking_number: trackingNumber })
        .eq('id', orderId);

      if (error) throw error;
      return { orderId, trackingNumber, source };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-without-tracking'] });
      queryClient.invalidateQueries({ queryKey: ['orders-without-notification'] });
      toast.success('Tracking number added successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to add tracking: ${error.message}`);
    }
  });

  // Send notifications for orders with tracking
  const handleSendNotifications = async (orders: OrderWithoutTracking[]) => {
    setSendingEmails(true);
    setProgress(0);
    setResults(null);

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      setProgress(((i + 1) / orders.length) * 100);

      try {
        const { error } = await supabase.functions.invoke('send-shipping-notification', {
          body: {
            orderId: order.id,
            orderNumber: order.source === 'stripe' ? order.order_number : order.id.toString(),
            customerEmail: order.customer_email,
            customerName: order.customer_name || 'Valued Customer',
            trackingNumber: order.tracking_number,
            carrierName: 'Carrier',
            source: order.source
          }
        });

        if (error) throw error;
        success++;
      } catch (error: any) {
        failed++;
        errors.push(`Order ${order.order_number || order.id}: ${error.message}`);
      }
    }

    setResults({ success, failed, errors });
    setSendingEmails(false);
    queryClient.invalidateQueries({ queryKey: ['orders-without-notification'] });
    toast.success(`Sent ${success} notifications`);
  };

  const handleAddTracking = (orderId: string | number, trackingNumber: string, source: 'stripe' | 'woocommerce') => {
    if (!trackingNumber || trackingNumber.trim().length < 5) {
      toast.error('Please enter a valid tracking number');
      return;
    }
    addTrackingMutation.mutate({ orderId, trackingNumber: trackingNumber.trim(), source });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tracking Backfill Tool</h1>
          <p className="text-muted-foreground mt-2">
            Fix historical orders missing tracking information or notifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="missing-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missing-tracking">
            <PackageX className="h-4 w-4 mr-2" />
            Missing Tracking ({ordersWithoutTracking?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="missing-notification">
            <Mail className="h-4 w-4 mr-2" />
            Missing Notifications ({ordersWithoutNotification?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missing-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fulfilled Orders Without Tracking Numbers</CardTitle>
              <CardDescription>
                Add tracking numbers to these orders. Once added, tracking emails will be sent automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingWithoutTracking ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : ordersWithoutTracking?.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    All fulfilled orders have tracking numbers! 🎉
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {ordersWithoutTracking?.map((order) => (
                    <Card key={`${order.source}-${order.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{order.source.toUpperCase()}</Badge>
                              <span className="font-semibold">
                                Order #{order.order_number || order.id}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div>{order.customer_name}</div>
                              <div>{order.customer_email}</div>
                              <div>Fulfilled: {order.fulfilled_at ? format(new Date(order.fulfilled_at), 'MMM d, yyyy') : 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="space-y-2">
                              <Label htmlFor={`tracking-${order.id}`} className="text-xs">Tracking Number</Label>
                              <Input
                                id={`tracking-${order.id}`}
                                placeholder="Enter tracking..."
                                value={trackingNumbers[`${order.source}-${order.id}`] || ''}
                                onChange={(e) => setTrackingNumbers(prev => ({
                                  ...prev,
                                  [`${order.source}-${order.id}`]: e.target.value
                                }))}
                                className="w-64"
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddTracking(
                                order.id,
                                trackingNumbers[`${order.source}-${order.id}`] || '',
                                order.source
                              )}
                              disabled={addTrackingMutation.isPending}
                            >
                              {addTrackingMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Package className="h-4 w-4 mr-2" />
                                  Add & Send
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing-notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders With Tracking But No Notification Sent</CardTitle>
              <CardDescription>
                These orders have tracking numbers but customers haven't been notified yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingWithoutNotification ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : ordersWithoutNotification?.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    All orders with tracking have been notified! 🎉
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {ordersWithoutNotification?.length} order(s) pending notification
                    </p>
                    <Button
                      onClick={() => ordersWithoutNotification && handleSendNotifications(ordersWithoutNotification)}
                      disabled={sendingEmails || !ordersWithoutNotification?.length}
                    >
                      {sendingEmails ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send All Notifications
                        </>
                      )}
                    </Button>
                  </div>

                  {sendingEmails && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-center text-muted-foreground">
                        Sending notifications... {Math.round(progress)}%
                      </p>
                    </div>
                  )}

                  {results && (
                    <Alert variant={results.failed > 0 ? 'destructive' : 'default'}>
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {results.failed === 0 ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="font-semibold">
                              Sent {results.success} notification(s), {results.failed} failed
                            </span>
                          </div>
                          {results.errors.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm font-semibold">Errors:</p>
                              {results.errors.map((error, i) => (
                                <p key={i} className="text-xs">{error}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    {ordersWithoutNotification?.map((order) => (
                      <Card key={`${order.source}-${order.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{order.source.toUpperCase()}</Badge>
                                <span className="font-semibold">
                                  Order #{order.order_number || order.id}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <div>{order.customer_name}</div>
                                <div>{order.customer_email}</div>
                                <div>Tracking: {order.tracking_number}</div>
                                <div>Fulfilled: {order.fulfilled_at ? format(new Date(order.fulfilled_at), 'MMM d, yyyy') : 'N/A'}</div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendNotifications([order])}
                              disabled={sendingEmails}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
