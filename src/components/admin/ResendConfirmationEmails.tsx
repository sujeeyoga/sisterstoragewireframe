import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, RefreshCw, X, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailEditor } from "./EmailEditor";
import { EmailHistory } from "./EmailHistory";

export const ResendConfirmationEmails = () => {
  const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["unfulfilled-orders"],
    queryFn: async () => {
      // Only show unfulfilled orders from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("fulfillment_status", "unfulfilled")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  const handleOpenEditor = (order: any) => {
    setSelectedOrder(order);
    setEditorOpen(true);
  };

  const handleSendEmail = async (customData: {
    subject?: string;
    customMessage?: string;
    customerName?: string;
  }) => {
    if (!selectedOrder) return;

    setResendingIds(prev => new Set(prev).add(selectedOrder.id));

    try {
      const { data, error } = await supabase.functions.invoke("resend-order-confirmation", {
        body: { 
          orderId: selectedOrder.id,
          ...customData,
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: `Confirmation email sent to ${selectedOrder.customer_email}`,
      });

      // Dismiss the order after successful send
      setDismissedIds(prev => new Set(prev).add(selectedOrder.id));
      queryClient.invalidateQueries({ queryKey: ["emailLogs"] });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedOrder.id);
        return newSet;
      });
    }
  };

  const handleDismiss = (orderId: string) => {
    setDismissedIds(prev => new Set(prev).add(orderId));
    toast({
      title: "Order dismissed",
      description: "Order removed from the list",
    });
  };

  // Filter out dismissed orders
  const visibleOrders = orders?.filter(order => !dismissedIds.has(order.id));

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  const prepareOrderData = (order: any) => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const shippingAddress = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : order.shipping_address;

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name || shippingAddress.name || "Valued Customer",
      customerEmail: order.customer_email,
      orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: items.map((item: any) => ({
        name: item.name || item.description || "Product",
        quantity: item.quantity || 1,
        price: (item.amount_total || item.price || 0) / 100
      })),
      subtotal: (order.subtotal || 0) / 100,
      shipping: (order.shipping_cost || 0) / 100,
      tax: (order.tax || 0) / 100,
      total: (order.total || 0) / 100,
      shippingAddress,
    };
  };

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Resend Confirmation Emails - Unfulfilled Orders</CardTitle>
              <CardDescription>
                Recent unfulfilled orders from the last 7 days ({visibleOrders?.length || 0} orders). 
                Orders automatically hide after email is sent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibleOrders?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No unfulfilled orders to display
                  </p>
                )}
                {visibleOrders?.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{order.order_number}</span>
                        <Badge variant="outline">{order.payment_status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>{order.customer_email}</div>
                        <div>{order.customer_name}</div>
                        <div>
                          ${((order.total || 0) / 100).toFixed(2)} • {" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleOpenEditor(order)}
                        disabled={resendingIds.has(order.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit & Send
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(order.id)}
                        disabled={resendingIds.has(order.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <EmailHistory />
        </TabsContent>
      </Tabs>

      {selectedOrder && (
        <EmailEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          orderData={prepareOrderData(selectedOrder)}
          onSend={handleSendEmail}
        />
      )}
    </>
  );
};
