import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Truck, MapPin } from 'lucide-react';
import { getRelativeTime } from '@/lib/dateHelpers';

interface Order {
  id: number | string;
  status: string;
  total: number;
  currency?: string;
  date_created: string;
  billing: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  shipping: {
    address_1?: string;
    city?: string;
  };
  line_items: any[];
  payment_method_title?: string;
  fulfillment_status?: string;
  tracking_number?: string;
  archived_at?: string;
}

interface OrderCardProps {
  order: Order;
  onView: () => void;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  selectionMode?: boolean;
  onStatusUpdate?: (status: string) => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'on-hold': { label: 'On Hold', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Fulfilled', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  refunded: { label: 'Refunded', className: 'bg-zinc-100 text-zinc-700 border-zinc-300' },
  cancelled: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  failed: { label: 'Failed', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export function OrderCard({ order, onView, isSelected, onSelect, selectionMode, onStatusUpdate, onArchive, onUnarchive }: OrderCardProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const customerName = `${order.billing.first_name || ''} ${order.billing.last_name || ''}`.trim() || 'Guest';
  const contact = order.billing.phone || order.billing.email || '';
  const itemCount = order.line_items?.length || 0;
  const total = `${order.currency || 'USD'} $${Number(order.total || 0).toFixed(2)}`;
  const relativeTime = getRelativeTime(order.date_created);
  
  const getFulfillmentInfo = () => {
    if (order.tracking_number) {
      return {
        icon: <Truck className="h-3 w-3" />,
        text: `Tracking: ${order.tracking_number}`,
        badge: 'Shipped'
      };
    }
    if (order.shipping?.address_1) {
      return {
        icon: <Truck className="h-3 w-3" />,
        text: `Ship to: ${order.shipping.city || 'Address'}`,
      };
    }
    return {
      icon: <Package className="h-3 w-3" />,
      text: 'Standard',
    };
  };
  
  const fulfillment = getFulfillmentInfo();
  
  const fulfillmentStatusConfig = {
    unfulfilled: { label: 'Unfulfilled', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    processing: { label: 'Processing', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    fulfilled: { label: 'Fulfilled', className: 'bg-green-50 text-green-700 border-green-200' },
    cancelled: { label: 'Cancelled', className: 'bg-zinc-100 text-zinc-700 border-zinc-300' },
  };
  
  const getContextualActions = () => {
    // If archived, show only unarchive button
    if (order.archived_at) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
          onClick={onUnarchive}
        >
          Unarchive
        </Button>
      );
    }
    
    switch (order.status) {
      case 'pending':
      case 'on-hold':
        return (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9"
              onClick={() => onStatusUpdate?.('processing')}
            >
              Process
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 border-rose-300 text-rose-700 hover:bg-rose-50"
              onClick={() => onStatusUpdate?.('cancelled')}
            >
              Cancel
            </Button>
          </>
        );
      case 'processing':
        return (
          <>
            <Button 
              variant="default" 
              size="sm" 
              className="h-9"
              onClick={() => onStatusUpdate?.('completed')}
            >
              Complete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 border-rose-300 text-rose-700 hover:bg-rose-50"
              onClick={() => onStatusUpdate?.('refunded')}
            >
              Refund
            </Button>
          </>
        );
      case 'completed':
        return (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              onClick={onArchive}
            >
              Archive
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 border-rose-300 text-rose-700 hover:bg-rose-50"
              onClick={() => onStatusUpdate?.('refunded')}
            >
              Refund
            </Button>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <article className="bg-card rounded-2xl border shadow-sm p-4 space-y-2">
      <div className="flex items-start gap-3">
        {selectionMode && (
          <div className="pt-1">
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={onSelect}
              className="w-5 h-5 sm:w-4 sm:h-4"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="text-[13px] text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">#{order.id}</span>
            <span>·</span>
            <Badge variant="outline" className={`${status.className} border`}>
              {status.label}
            </Badge>
            {order.fulfillment_status && (
              <>
                <span>·</span>
                <Badge variant="outline" className={`${fulfillmentStatusConfig[order.fulfillment_status as keyof typeof fulfillmentStatusConfig]?.className || ''} border`}>
                  {fulfillmentStatusConfig[order.fulfillment_status as keyof typeof fulfillmentStatusConfig]?.label || order.fulfillment_status}
                </Badge>
              </>
            )}
            <span>·</span>
            <span>{relativeTime}</span>
          </div>
          
          <div className="text-[15px] font-medium">
            {customerName}
            {contact && (
              <span className="text-muted-foreground font-normal"> · {contact}</span>
            )}
          </div>
          
          <div className="text-[14px] text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} • {total}
          </div>
          
          <div className="text-[13px] text-muted-foreground flex items-center gap-1">
            {fulfillment.icon}
            <span>{fulfillment.text}</span>
            {order.payment_method_title && (
              <>
                <span className="mx-1">•</span>
                <span>{order.payment_method_title}</span>
              </>
            )}
          </div>
          
          <hr className="border-border" />
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="default" size="sm" className="h-9" onClick={onView}>
              View
            </Button>
            {getContextualActions()}
          </div>
        </div>
      </div>
    </article>
  );
}
