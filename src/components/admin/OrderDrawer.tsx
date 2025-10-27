import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Package, DollarSign, User, MapPin, CreditCard, Truck, ExternalLink, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { StallionFulfillmentDialog } from './StallionFulfillmentDialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OrderDrawerProps {
  order: {
    id: number | string;
    status: string;
    total: number;
    currency?: string;
    date_created: string;
    billing: any;
    shipping: any;
    shipping_address?: any;
    line_items: any[];
    payment_method_title?: string;
    fulfillment_status?: string;
    tracking_number?: string;
    stallion_shipment_id?: string;
    shipping_label_url?: string;
    customer_name?: string;
    customer_email?: string;
    stripe_payment_intent_id?: string;
    refund_amount?: number;
  };
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}

export function OrderDrawer({ order, open, onClose, onStatusUpdate }: OrderDrawerProps) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [fulfillmentDialogOpen, setFulfillmentDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>(order.total.toString());
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [refundNotes, setRefundNotes] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundType, setRefundType] = useState<'stripe' | 'manual'>('stripe');
  const [manualRefundConfirmed, setManualRefundConfirmed] = useState(false);

  // Reset refund form when order changes
  useEffect(() => {
    setRefundAmount(order.total.toString());
    setRefundReason('requested_by_customer');
    setRefundNotes('');
    setRefundType(order.stripe_payment_intent_id ? 'stripe' : 'manual');
    setManualRefundConfirmed(false);
    setNewStatus(order.status);
  }, [order.id, order.total, order.status, order.stripe_payment_intent_id]);

  const handleStatusUpdate = () => {
    onStatusUpdate(newStatus);
  };
  
  const handleRefund = async () => {
    if (refundType === 'manual' && !manualRefundConfirmed) {
      toast.error('Please confirm that you have processed this refund manually in Stripe Dashboard');
      return;
    }

    setIsRefunding(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-refund', {
        body: {
          orderId: order.id,
          amount: parseFloat(refundAmount),
          reason: refundReason,
          notes: refundNotes,
          refundType,
        },
      });

      if (error) throw error;

      if (data.success) {
        const message = refundType === 'manual'
          ? data.message
          : `Refund of $${parseFloat(refundAmount).toFixed(2)} processed successfully`;
        
        toast.success(message);
        setRefundDialogOpen(false);
        setManualRefundConfirmed(false);
        
        const isFullRefund = parseFloat(refundAmount) >= order.total;
        if (isFullRefund) {
          onStatusUpdate('refunded');
        }
        onClose();
      } else {
        throw new Error(data.error || 'Refund failed');
      }
    } catch (error: any) {
      console.error('Refund error:', error);
      toast.error(error.message || 'Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };
  
  const validateTrackingNumber = (trackingNum: string): boolean => {
    // Basic validation - not empty and reasonable length
    if (!trackingNum || trackingNum.trim().length < 5) {
      return false;
    }
    // Could add more specific validation based on carrier format
    return true;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'default',
      'on-hold': 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      refunded: 'destructive',
      failed: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>
            View and manage order details.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Order Status</h3>
          </div>
          <div className="flex items-center justify-between">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </div>
          <Separator />

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input type="text" value={order.customer_name || order.billing?.first_name + ' ' + order.billing?.last_name || 'N/A'} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={order.customer_email || order.billing?.email || 'N/A'} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Billing Address</Label>
                <Textarea value={
                  order.billing?.address_1 + '\n' +
                  order.billing?.address_2 + '\n' +
                  order.billing?.city + ', ' + order.billing?.state + ' ' + order.billing?.postcode + '\n' +
                  order.billing?.country
                  || 'N/A'} readOnly className="resize-none" />
              </div>
              <div>
                <Label>Shipping Address</Label>
                <Textarea value={
                  order.shipping?.address_1 + '\n' +
                  order.shipping?.address_2 + '\n' +
                  order.shipping?.city + ', ' + order.shipping?.state + ' ' + order.shipping?.postcode + '\n' +
                  order.shipping?.country
                  || order.shipping_address?.address_1 + '\n' +
                  order.shipping_address?.address_2 + '\n' +
                  order.shipping_address?.city + ', ' + order.shipping_address?.state + ' ' + order.shipping_address?.postcode + '\n' +
                  order.shipping_address?.country
                  || 'N/A'} readOnly className="resize-none" />
              </div>
            </div>
          </div>
          <Separator />

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Order Details</h3>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order Number</Label>
                <Input type="text" value={order.id} readOnly />
              </div>
              <div>
                <Label>Order Date</Label>
                <Input type="text" value={format(new Date(order.date_created), 'MMMM d, yyyy h:mm a')} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Input type="text" value={order.payment_method_title || 'N/A'} readOnly />
              </div>
              <div>
                <Label>Total</Label>
                <Input type="text" value={`${order.total} ${order.currency || 'CAD'}`} readOnly />
              </div>
            </div>

            <div>
              <Label>Items</Label>
              <div className="border rounded-md p-2">
                {order.line_items?.map((item: any) => (
                  <div key={item.id} className="py-2 border-b last:border-b-0">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} x {item.price} = {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator />

          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Fulfillment</h3>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fulfillment Status</Label>
                <div>{getStatusBadge(order.fulfillment_status || 'pending')}</div>
              </div>
              <div>
                <Label>Tracking Number</Label>
                <div className="flex items-center space-x-2">
                  <Input type="text" value={order.tracking_number || ''} readOnly />
                  {order.tracking_number && validateTrackingNumber(order.tracking_number) ? (
                    <a
                      href={`https://www.google.com/search?q=track+${order.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {order.stallion_shipment_id ? (
              <div className="space-y-1">
                <Label>Stallion Shipment ID</Label>
                <Input type="text" value={order.stallion_shipment_id} readOnly />
                {order.shipping_label_url ? (
                  <a
                    href={order.shipping_label_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Shipping Label
                  </a>
                ) : (
                  <Alert className="my-2">
                    <AlertDescription>
                      No shipping label URL found for this shipment.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert className="my-2">
                <AlertDescription>
                  This order has not been fulfilled through Stallion.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={() => setFulfillmentDialogOpen(true)} size="sm">
              Manage Fulfillment
            </Button>
          </div>
        </div>
        
        <div className="space-y-6 pb-6">
          {/* Refund Management Section */}
          {order.status !== 'refunded' && (
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setRefundType(order.stripe_payment_intent_id ? 'stripe' : 'manual');
                  setRefundDialogOpen(true);
                }}
                variant="destructive"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {order.stripe_payment_intent_id ? 'Process Stripe Refund' : 'Record Manual Refund'}
              </Button>
            </div>
          )}
        </div>

        <StallionFulfillmentDialog
          order={order}
          open={fulfillmentDialogOpen}
          onClose={() => setFulfillmentDialogOpen(false)}
          onSuccess={() => {
            setFulfillmentDialogOpen(false);
            onClose();
          }}
        />

        <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {refundType === 'manual' ? 'Record Manual Refund' : 'Process Stripe Refund'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {refundType === 'manual'
                  ? 'Record a refund that you will process manually in Stripe Dashboard.'
                  : 'Issue a refund to the customer\'s original payment method. This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {refundType === 'manual' && (
              <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Manual Refund Process:</strong>
                  <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm">
                    <li>Open the <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer" className="underline font-medium">Stripe Dashboard</a></li>
                    <li>Process the refund manually for order {order.id}</li>
                    <li>Return here and confirm below to record it in the system</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="refundAmount">Refund Amount (CAD)</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={order.total - (order.refund_amount || 0)}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={order.total.toString()}
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Order total: ${order.total.toFixed(2)} CAD</p>
                  {order.refund_amount && order.refund_amount > 0 && (
                    <>
                      <p className="text-amber-600">Already refunded: ${order.refund_amount.toFixed(2)} CAD</p>
                      <p className="font-medium">Maximum refundable: ${(order.total - order.refund_amount).toFixed(2)} CAD</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundReason">Reason</Label>
                <Select value={refundReason} onValueChange={setRefundReason}>
                  <SelectTrigger id="refundReason">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested_by_customer">Requested by Customer</SelectItem>
                    <SelectItem value="duplicate">Duplicate Order</SelectItem>
                    <SelectItem value="fraudulent">Fraudulent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundNotes">Notes (Optional)</Label>
                <Textarea
                  id="refundNotes"
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  placeholder="Internal notes about this refund"
                />
              </div>

              {refundType === 'manual' && (
                <div className="flex items-start space-x-2 rounded-md border border-amber-500 bg-amber-50 dark:bg-amber-950 p-4">
                  <Checkbox
                    id="manual-confirmation"
                    checked={manualRefundConfirmed}
                    onCheckedChange={(checked) => setManualRefundConfirmed(checked as boolean)}
                  />
                  <Label htmlFor="manual-confirmation" className="font-normal cursor-pointer text-amber-800 dark:text-amber-200">
                    I confirm that I have processed this refund manually in the Stripe Dashboard
                  </Label>
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRefunding}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleRefund();
                }}
                disabled={isRefunding || !refundAmount || parseFloat(refundAmount) <= 0 || (refundType === 'manual' && !manualRefundConfirmed)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isRefunding ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>{refundType === 'manual' ? 'Record Refund' : `Refund $${parseFloat(refundAmount || '0').toFixed(2)}`}</>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
