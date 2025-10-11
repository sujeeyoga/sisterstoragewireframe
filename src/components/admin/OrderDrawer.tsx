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
import { Package, DollarSign, User, MapPin, CreditCard } from 'lucide-react';

interface OrderDrawerProps {
  order: {
    id: number | string;
    status: string;
    total: number;
    currency?: string;
    date_created: string;
    billing: any;
    shipping: any;
    line_items: any[];
    payment_method_title?: string;
  };
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}

export function OrderDrawer({ order, open, onClose, onStatusUpdate }: OrderDrawerProps) {
  const [newStatus, setNewStatus] = useState(order.status);

  const handleStatusUpdate = () => {
    onStatusUpdate(newStatus);
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
          {order.shipping && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.shipping?.address_1}</p>
                  {order.shipping?.address_2 && <p>{order.shipping.address_2}</p>}
                  <p>
                    {order.shipping?.city}, {order.shipping?.state} {order.shipping?.postcode}
                  </p>
                  <p>{order.shipping?.country}</p>
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
            <div className="space-y-3">
              {order.line_items?.map((item: any, index: number) => {
                const itemTotal = item.total as any;
                const total = typeof itemTotal === 'number' ? itemTotal : parseFloat(String(itemTotal || '0'));
                return (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      {order.currency || 'CAD'} ${total.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Order Total
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{order.currency || 'CAD'} ${Number(order.total).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>{order.currency || 'CAD'} ${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
