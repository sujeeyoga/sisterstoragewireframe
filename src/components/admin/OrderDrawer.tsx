import { useState } from 'react';
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
import { format } from 'date-fns';
import { Package, DollarSign, User, MapPin, CreditCard, Truck, ExternalLink, AlertTriangle } from 'lucide-react';
import { StallionFulfillmentDialog } from './StallionFulfillmentDialog';
import { toast } from 'sonner';

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
  };
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}

export function OrderDrawer({ order, open, onClose, onStatusUpdate }: OrderDrawerProps) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [fulfillmentDialogOpen, setFulfillmentDialogOpen] = useState(false);

  const handleStatusUpdate = () => {
    onStatusUpdate(newStatus);
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
          <SheetTitle>Order #{order.id}</SheetTitle>
          <SheetDescription>
            Placed on {format(new Date(order.date_created), 'MMMM dd, yyyy HH:mm')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status Update */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Status
              </h3>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="flex gap-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
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
              <Button 
                onClick={handleStatusUpdate}
                disabled={newStatus === order.status}
              >
                Update
              </Button>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">
                {order.billing?.first_name} {order.billing?.last_name}
              </p>
              <p className="text-muted-foreground">{order.billing?.email}</p>
              <p className="text-muted-foreground">{order.billing?.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Billing Address
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.billing?.address_1}</p>
              {order.billing?.address_2 && <p>{order.billing.address_2}</p>}
              <p>
                {order.billing?.city}, {order.billing?.state} {order.billing?.postcode}
              </p>
              <p>{order.billing?.country}</p>
            </div>
          </div>

          {/* Shipping Address */}
          {(order.shipping || order.shipping_address) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1 bg-muted/30 rounded-lg p-3">
                  {(() => {
                    // Handle both WooCommerce (shipping) and Stripe (shipping_address) formats
                    const addr = order.shipping_address || order.shipping || {};
                    const name = addr.name || `${addr.first_name || ''} ${addr.last_name || ''}`.trim();
                    const street1 = addr.address || addr.address_1 || addr.line1 || '';
                    const street2 = addr.address_2 || addr.line2 || '';
                    const city = addr.city || '';
                    const state = addr.state || addr.province || '';
                    const postal = addr.postcode || addr.postal_code || '';
                    const country = addr.country || '';
                    
                    return (
                      <>
                        {name && <p className="font-medium text-foreground">{name}</p>}
                        {street1 && <p className="break-words">{street1}</p>}
                        {street2 && <p className="break-words">{street2}</p>}
                        {(city || state || postal) && (
                          <p>
                            {city}{city && (state || postal) ? ', ' : ''}
                            {state} {postal}
                          </p>
                        )}
                        {country && <p>{country}</p>}
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </h3>
            <p className="text-sm text-muted-foreground">
              {order.payment_method_title || 'Not specified'}
            </p>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items ({order.line_items?.length || 0})
            </h3>
            <div className="space-y-2 bg-muted/30 rounded-lg p-4">
              {order.line_items?.map((item: any, index: number) => {
                const itemPrice = item.price || 0;
                const itemTotal = item.total || (itemPrice * item.quantity);
                const total = typeof itemTotal === 'number' ? itemTotal : parseFloat(String(itemTotal || '0'));
                const unitPrice = typeof itemPrice === 'number' ? itemPrice : parseFloat(String(itemPrice || '0'));
                
                return (
                  <div key={index} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        {unitPrice > 0 && (
                          <span>@ ${unitPrice.toFixed(2)} each</span>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-sm ml-4">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Shipping Information */}
            {(() => {
              // Calculate shipping cost once and detect label
              let shippingCost = Number((order as any).shipping || (order as any).shipping_cost || 0);
              let shippingLabel: string | null = null;

              // WooCommerce-style shipping lines
              const wooLines = (order as any).shipping_lines;
              if (Array.isArray(wooLines) && wooLines.length > 0) {
                shippingCost = wooLines.reduce((sum: number, l: any) => {
                  const t = typeof l.total === 'number' ? l.total : parseFloat(String(l.total || '0'));
                  return sum + (isNaN(t) ? 0 : t);
                }, shippingCost);
                shippingLabel = wooLines[0]?.method_title || wooLines[0]?.name || shippingLabel;
              }

              // Some payloads use shipping_total
              if (shippingCost === 0 && (order as any).shipping_total != null) {
                const t = typeof (order as any).shipping_total === 'number'
                  ? (order as any).shipping_total
                  : parseFloat(String((order as any).shipping_total));
                if (!isNaN(t)) shippingCost = t;
              }
              
              // If still 0, extract from items array (Stripe sessions, some Woo orders)
              if (shippingCost === 0 && order.line_items) {
                const shippingItems = order.line_items.filter((item: any) => {
                  const name = (item.name || '').toLowerCase();
                  return name.includes('shipping') || 
                         name.includes('delivery') || 
                         name.includes('intelcom') ||
                         name.includes('whiz') ||
                         name.includes('toronto') ||
                         name.includes('gta') ||
                         name.includes('canada wide') ||
                         name.includes('standard');
                });
                if (shippingItems.length > 0) {
                  shippingLabel = shippingItems[0]?.name || shippingLabel;
                }
                shippingCost = shippingItems.reduce((sum: number, item: any) => {
                  const itemTotal = item.total || (item.price * item.quantity) || 0;
                  const total = typeof itemTotal === 'number' ? itemTotal : parseFloat(String(itemTotal || '0'));
                  return sum + (isNaN(total) ? 0 : total);
                }, 0);
              }
              
              return (
                <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{shippingLabel || 'Shipping Cost'}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Free shipping or included in item price
                    </p>
                  )}
                </div>
              );
            })()}
          </div>

          <Separator />

          {/* Stallion Express Fulfillment */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Fulfillment
            </h3>
            
            {order.fulfillment_status === 'fulfilled' ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Order Fulfilled</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Shipped
                    </Badge>
                  </div>
                  {order.tracking_number && (
                    <div className="text-sm">
                      <span className="font-medium text-green-700">Tracking:</span> {order.tracking_number}
                      {!validateTrackingNumber(order.tracking_number) && (
                        <div className="flex items-center gap-1 text-amber-600 mt-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Invalid tracking number format</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {order.shipping_label_url && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={order.shipping_label_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Label
                      </a>
                    </Button>
                  )}
                  {order.tracking_number && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a 
                        href={`https://www.stallionexpress.ca/tracking?tracking_number=${order.tracking_number}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    {order.fulfillment_status === 'processing' 
                      ? 'Fulfillment in progress'
                      : 'Order awaiting fulfillment'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => setFulfillmentDialogOpen(true)}
                    variant="default"
                    disabled={!order.shipping_address && !order.shipping}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Ship Now
                  </Button>
                  <Button 
                    onClick={() => {
                      onStatusUpdate('completed');
                      onClose();
                    }}
                    variant="outline"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Total */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Order Total
            </h3>
            <div className="space-y-2 text-sm bg-muted/30 rounded-lg p-4">
              {/* Calculate subtotal from line items */}
              {(() => {
                const itemsSubtotal = order.line_items?.reduce((sum: number, item: any) => {
                  const itemTotal = item.total || (item.price * item.quantity) || 0;
                  const total = typeof itemTotal === 'number' ? itemTotal : parseFloat(String(itemTotal || '0'));
                  return sum + total;
                }, 0) || 0;
                
                const shipping = (order as any).shipping_cost || (order as any).shipping || 0;
                const tax = (order as any).tax || (order as any).tax_amount || 0;
                const total = Number(order.total);
                
                return (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>${itemsSubtotal.toFixed(2)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping:</span>
                        <span>${Number(shipping).toFixed(2)}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax:</span>
                        <span>${Number(tax).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-base pt-1">
                      <span>Total:</span>
                      <span>{order.currency || 'CAD'} ${total.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
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
      </SheetContent>
    </Sheet>
  );
}
