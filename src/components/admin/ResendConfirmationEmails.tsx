import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ResendConfirmationEmails = () => {
  const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
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

  const handleResendEmail = async (orderId: string, email: string, orderNumber: string) => {
    setResendingIds(prev => new Set(prev).add(orderId));

    try {
      const { data, error } = await supabase.functions.invoke("resend-order-confirmation", {
        body: { orderId },
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: `Confirmation email resent to ${email}`,
      });

      // Dismiss the order after successful send
      setDismissedIds(prev => new Set(prev).add(orderId));
    } catch (error: any) {
      console.error("Error resending email:", error);
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
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

  return (
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
                  variant="outline"
                  onClick={() => handleResendEmail(order.id, order.customer_email, order.order_number)}
                  disabled={resendingIds.has(order.id)}
                >
                  {resendingIds.has(order.id) ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Email
                    </>
                  )}
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
  );
};
