import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, MapPin, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OverchargedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  subtotal: number;
  shipping: number;
  total: number;
  shipping_address: any;
  created_at: string;
  status: string;
  stripe_payment_intent_id: string | null;
}

export function BulkShippingRefundTool() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [refundType, setRefundType] = useState<'stripe' | 'manual'>('manual');
  const [manualRefundConfirmed, setManualRefundConfirmed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to find GTA orders over $50 that were charged shipping
  const { data: overchargedOrders, isLoading } = useQuery({
    queryKey: ['overcharged-shipping-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gt('shipping', 0)
        .gte('subtotal', 50)
        .neq('status', 'refunded')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter for GTA cities
      const gtaCities = [
        'toronto', 'mississauga', 'brampton', 'markham', 'vaughan',
        'richmond hill', 'oakville', 'burlington', 'pickering', 'ajax',
        'whitby', 'oshawa', 'newmarket', 'aurora', 'milton', 'scarborough'
      ];

      const filtered = (data || []).filter(order => {
        const shippingAddr = order.shipping_address as any;
        const city = (shippingAddr?.city || '').toLowerCase();
        return gtaCities.some(gtaCity => city.includes(gtaCity));
      });

      return filtered as OverchargedOrder[];
    },
  });

  // Filter orders based on refund type capability
  const filteredOrders = overchargedOrders?.filter(order => {
    if (refundType === 'stripe') {
      // Only show orders with payment intent IDs for Stripe API mode
      return order.stripe_payment_intent_id != null;
    }
    // Show all orders for manual mode
    return true;
  });

  const bulkRefundMutation = useMutation({
    mutationFn: async (orderIds: string[]) => {
      const refunds = orderIds.map(orderId => {
        const order = overchargedOrders?.find(o => o.id === orderId);
        return {
          orderId,
          amount: order?.shipping || 15,
          reason: 'requested_by_customer',
          notes: 'GTA free shipping over $50 - shipping charge refund',
          refundType
        };
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('create-bulk-refund', {
        body: { refunds },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      const message = refundType === 'manual'
        ? `Recorded ${data.successful} manual refunds. Please process them in Stripe Dashboard.`
        : `Successfully processed ${data.successful} refunds via Stripe API.`;
      
      toast({
        title: "Bulk Refund Complete",
        description: `${message} ${data.failed > 0 ? `${data.failed} failed.` : ''}`,
      });
      setSelectedOrders(new Set());
      setManualRefundConfirmed(false);
      queryClient.invalidateQueries({ queryKey: ['overcharged-shipping-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Refund Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const toggleAll = () => {
    if (selectedOrders.size === filteredOrders?.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders?.map(o => o.id) || []));
    }
  };

  const handleBulkRefund = () => {
    if (selectedOrders.size === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order to refund.",
        variant: "destructive",
      });
      return;
    }

    if (refundType === 'manual' && !manualRefundConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you will process these refunds manually in Stripe Dashboard.",
        variant: "destructive",
      });
      return;
    }

    bulkRefundMutation.mutate(Array.from(selectedOrders));
  };

  const totalRefundAmount = filteredOrders
    ?.filter(order => selectedOrders.has(order.id))
    .reduce((sum, order) => sum + order.shipping, 0) || 0;

  const ordersWithPaymentIntent = overchargedOrders?.filter(o => o.stripe_payment_intent_id != null).length || 0;
  const ordersWithoutPaymentIntent = overchargedOrders?.filter(o => o.stripe_payment_intent_id == null).length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refund Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Processing Method</CardTitle>
          <CardDescription>
            Choose how to process these refunds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="refundType"
                value="manual"
                checked={refundType === 'manual'}
                onChange={(e) => setRefundType(e.target.value as 'manual')}
                className="h-4 w-4"
              />
              <div>
                <div className="font-medium">Manual (Record Only)</div>
                <div className="text-sm text-muted-foreground">
                  Records refunds in the system. You must process them manually in Stripe Dashboard.
                </div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="refundType"
                value="stripe"
                checked={refundType === 'stripe'}
                onChange={(e) => setRefundType(e.target.value as 'stripe')}
                className="h-4 w-4"
              />
              <div>
                <div className="font-medium">Automatic (Stripe API)</div>
                <div className="text-sm text-muted-foreground">
                  Processes refunds automatically through Stripe API.
                </div>
              </div>
            </label>
          </div>

          <Alert className={refundType === 'manual' ? "border-amber-500 bg-amber-50 dark:bg-amber-950" : "border-blue-500 bg-blue-50 dark:bg-blue-950"}>
            <AlertCircle className={refundType === 'manual' ? "h-4 w-4 text-amber-600 dark:text-amber-400" : "h-4 w-4 text-blue-600 dark:text-blue-400"} />
            <AlertDescription className={refundType === 'manual' ? "text-amber-800 dark:text-amber-200 text-sm" : "text-blue-800 dark:text-blue-200 text-sm"}>
              {refundType === 'manual' ? (
                <>
                  <strong>Manual Refund Process:</strong> Select orders and process them in <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a>
                </>
              ) : (
                <>
                  <strong>Automatic Refund:</strong> {ordersWithPaymentIntent} order(s) can be refunded via Stripe API. {ordersWithoutPaymentIntent > 0 && `${ordersWithoutPaymentIntent} order(s) without payment intents are hidden (switch to Manual mode to see them).`}
                </>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Bulk Shipping Refund Tool
          </CardTitle>
          <CardDescription>
            GTA orders over $50 that were incorrectly charged shipping
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                {refundType === 'stripe' 
                  ? 'No orders with Stripe payment intents found. Switch to Manual mode to see orders without payment intents.'
                  : 'No overcharged orders found'}
              </p>
            </div>
          ) : (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {filteredOrders.length} Orders {refundType === 'stripe' ? 'with Payment Intent' : 'Available'}
                </Badge>
                <Badge variant="secondary">
                  {selectedOrders.size} Selected
                </Badge>
                {selectedOrders.size > 0 && (
                  <Badge variant="default">
                    ${totalRefundAmount.toFixed(2)} Total Refund
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAll}
                >
                  {selectedOrders.size === filteredOrders.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  onClick={handleBulkRefund}
                  disabled={selectedOrders.size === 0 || bulkRefundMutation.isPending || (refundType === 'manual' && !manualRefundConfirmed)}
                  size="sm"
                >
                  {bulkRefundMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {refundType === 'manual' ? 'Record' : 'Process'} Refunds ({selectedOrders.size})
                </Button>
              </div>
            </div>

            {refundType === 'manual' && selectedOrders.size > 0 && (
              <div className="flex items-start space-x-2 rounded-md border border-amber-500 bg-amber-50 dark:bg-amber-950 p-4">
                <Checkbox
                  id="bulk-manual-confirmation"
                  checked={manualRefundConfirmed}
                  onCheckedChange={(checked) => setManualRefundConfirmed(checked as boolean)}
                />
                <Label htmlFor="bulk-manual-confirmation" className="font-normal cursor-pointer text-sm text-amber-800 dark:text-amber-200">
                  I confirm that I will process these {selectedOrders.size} refund{selectedOrders.size !== 1 ? 's' : ''} manually in the Stripe Dashboard
                </Label>
              </div>
            )}

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Shipping</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleOrder(order.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(order.shipping_address as any)?.city || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        ${order.shipping.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
