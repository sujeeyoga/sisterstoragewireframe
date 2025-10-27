import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, MapPin } from "lucide-react";
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
}

export function BulkShippingRefundTool() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
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
        'whitby', 'oshawa', 'newmarket', 'aurora', 'milton'
      ];

      const filtered = (data || []).filter(order => {
        const shippingAddr = order.shipping_address as any;
        const city = (shippingAddr?.city || '').toLowerCase();
        return gtaCities.some(gtaCity => city.includes(gtaCity));
      });

      return filtered as OverchargedOrder[];
    },
  });

  const bulkRefundMutation = useMutation({
    mutationFn: async (orderIds: string[]) => {
      const refunds = orderIds.map(orderId => {
        const order = overchargedOrders?.find(o => o.id === orderId);
        return {
          orderId,
          amount: order?.shipping || 15,
          reason: 'requested_by_customer',
          notes: 'GTA free shipping over $50 - shipping charge refund'
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
      toast({
        title: "Bulk Refund Complete",
        description: `Successfully refunded ${data.successful} orders. ${data.failed} failed.`,
      });
      setSelectedOrders(new Set());
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
    if (selectedOrders.size === overchargedOrders?.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(overchargedOrders?.map(o => o.id) || []));
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

    bulkRefundMutation.mutate(Array.from(selectedOrders));
  };

  const totalRefundAmount = overchargedOrders
    ?.filter(order => selectedOrders.has(order.id))
    .reduce((sum, order) => sum + order.shipping, 0) || 0;

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
        {!overchargedOrders || overchargedOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No overcharged orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {overchargedOrders.length} Orders Found
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
                  {selectedOrders.size === overchargedOrders.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  onClick={handleBulkRefund}
                  disabled={selectedOrders.size === 0 || bulkRefundMutation.isPending}
                  size="sm"
                >
                  {bulkRefundMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Process Refunds ({selectedOrders.size})
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedOrders.size === overchargedOrders.length}
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
                  {overchargedOrders.map((order) => (
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
  );
}
