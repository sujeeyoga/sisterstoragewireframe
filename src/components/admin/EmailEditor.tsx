import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EmailEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    orderDate: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: any;
  };
  onSend: (customData: {
    subject?: string;
    customMessage?: string;
    customerName?: string;
  }) => Promise<void>;
}

export const EmailEditor = ({ open, onOpenChange, orderData, onSend }: EmailEditorProps) => {
  const [subject, setSubject] = useState(`Your Sister Storage Order #${orderData.orderNumber}`);
  const [customMessage, setCustomMessage] = useState("");
  const [customerName, setCustomerName] = useState(orderData.customerName);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend({
        subject: subject !== `Your Sister Storage Order #${orderData.orderNumber}` ? subject : undefined,
        customMessage: customMessage.trim() || undefined,
        customerName: customerName !== orderData.customerName ? customerName : undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit & Send Email</DialogTitle>
          <DialogDescription>
            Customize the email before sending to {orderData.customerEmail}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal note that will appear at the top of the email..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                This message will appear at the top of the email, before the order details.
              </p>
            </div>

            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">Order Details (Read-only)</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Order #:</span> {orderData.orderNumber}</p>
                <p><span className="font-medium">Email:</span> {orderData.customerEmail}</p>
                <p><span className="font-medium">Date:</span> {orderData.orderDate}</p>
                <p><span className="font-medium">Total:</span> ${(orderData.total / 100).toFixed(2)}</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-muted-foreground">Subject:</p>
                  <p className="font-semibold">{subject}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Thank you for your order, {customerName}!
                  </h3>

                  {customMessage && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                      <p className="whitespace-pre-wrap">{customMessage}</p>
                    </div>
                  )}

                  <p className="text-muted-foreground mb-4">
                    We've received your order and are getting it ready. Here are your order details:
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold">Order #{orderData.orderNumber}</p>
                    <p className="text-sm">Order Date: {orderData.orderDate}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Items:</h4>
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${(orderData.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>${(orderData.shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>${(orderData.tax / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${(orderData.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
