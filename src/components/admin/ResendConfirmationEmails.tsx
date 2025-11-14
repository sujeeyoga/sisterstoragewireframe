import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ResendConfirmationEmails = () => {
  const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["unfulfilled-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("fulfillment_status", "unfulfilled")
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

      toast.success(`Confirmation email resent to ${email}`);
    } catch (error: any) {
      console.error("Error resending email:", error);
      toast.error(`Failed to resend email: ${error.message}`);
    } finally {
      setResendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resend Confirmation Emails - Unfulfilled Orders</CardTitle>
        <CardDescription>
          Send confirmation emails to customers with unfulfilled orders ({orders?.length || 0} orders)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders?.map((order) => (
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
