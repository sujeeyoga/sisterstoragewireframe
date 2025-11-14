import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Package, Truck, MapPin, Archive, ArchiveRestore } from 'lucide-react';
import { getRelativeTime } from '@/lib/dateHelpers';

interface Order {
  id: number | string;
  status: string;
  total: number;
  subtotal?: number;
  shipping_cost?: number;
  tax?: number;
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
    country?: string;
  };
  line_items: any[];
  payment_method_title?: string;
  fulfillment_status?: string;
  tracking_number?: string;
  archived_at?: string;
  stallion_cost?: number;
  carrier_name?: string;
  carrier_cost_currency?: string;
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
  onLongPress?: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'on-hold': { label: 'On Hold', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Fulfilled', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  refunded: { label: 'Refunded', className: 'bg-zinc-100 text-zinc-700 border-zinc-300' },
  cancelled: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  failed: { label: 'Failed', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const getCountryFlag = (countryCode: string) => {
  if (!countryCode || countryCode === 'N/A') return '🌍';
  const code = countryCode.toUpperCase();
  return code.split('').map(char => String.fromCodePoint(127397 + char.charCodeAt(0))).join('');
};

export function OrderCard({ order, onView, isSelected, onSelect, selectionMode, onStatusUpdate, onArchive, onUnarchive, onLongPress }: OrderCardProps) {
  const [pressTimer, setPressTimer] = React.useState<NodeJS.Timeout | null>(null);
  
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectionMode) return; // Already in selection mode
    
    const timer = setTimeout(() => {
      onLongPress?.();
    }, 500);
    setPressTimer(timer);
  };
  
  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const customerName = `${order.billing.first_name || ''} ${order.billing.last_name || ''}`.trim() || 'Guest';
  const contact = order.billing.phone || order.billing.email || '';
  
  // Extract shipping item from line_items
  const shippingItem = order.line_items?.find((item: any) => 
    item.name?.toLowerCase().includes('shipping') ||
    item.name?.toLowerCase().includes('chit chats') ||
    item.name?.toLowerCase().includes('stallion')
  );
  
  // Filter out shipping from regular items for accurate count
  const regularItems = order.line_items?.filter((item: any) => 
    !item.name?.toLowerCase().includes('shipping') &&
    !item.name?.toLowerCase().includes('chit chats') &&
    !item.name?.toLowerCase().includes('stallion')
  ) || [];
  
  const itemCount = regularItems.length || 0;
  
  // Calculate shipping from available data
  const shipping = shippingItem 
    ? (shippingItem.quantity * shippingItem.price)
    : order.shipping_cost !== undefined 
      ? order.shipping_cost 
      : (order.subtotal !== undefined && order.tax !== undefined)
        ? order.total - order.subtotal - order.tax
        : undefined;
  
  const location = order.shipping?.city || 'Unknown';
  const countryCode = order.shipping?.country || 'Unknown';
  const flag = getCountryFlag(countryCode);
  
  const relativeTime = getRelativeTime(order.date_created);
  const isArchived = !!order.archived_at;
  
  const carrierCost = order.stallion_cost;
  const shippingMargin = shipping !== undefined && carrierCost !== undefined 
    ? shipping - carrierCost 
    : undefined;
  
  const carrierInfo = order.carrier_name 
    ? `${order.carrier_name} (${order.carrier_cost_currency || 'CAD'})`
    : null;
  
  const subtotal = order.subtotal !== undefined
    ? order.subtotal
    : regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const total = `${order.currency || 'USD'} $${Number(order.total || 0).toFixed(2)}`;
  
  const isChitChats = shippingItem?.name?.toLowerCase().includes('chit chats');
  const isStallion = shippingItem?.name?.toLowerCase().includes('stallion');
  
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
          <ArchiveRestore className="h-4 w-4 mr-1.5" />
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
              <Archive className="h-4 w-4 mr-1.5" />
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
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.stopPropagation();
      onSelect?.(!isSelected);
    } else {
      onView();
    }
  };
  
  return (
    <article 
      className="bg-card rounded-2xl border shadow-sm p-4 space-y-2 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className="flex items-start gap-3">
        {selectionMode && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={onSelect}
              className="w-5 h-5 sm:w-4 sm:h-4"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="text-[13px] text-muted-foreground flex items-center gap-2 flex-wrap">
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
            {shipping !== undefined && shipping > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                {isChitChats && <Badge variant="default" className="bg-blue-500 text-white text-[10px] px-1.5 py-0">ChitChats</Badge>}
                {isStallion && <Badge variant="default" className="bg-green-500 text-white text-[10px] px-1.5 py-0">Stallion</Badge>}
                {!isChitChats && !isStallion && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Shipping</Badge>}
                <span className="text-xs">${shipping.toFixed(2)}</span>
              </span>
            )}
            {order.stallion_cost !== null && order.stallion_cost !== undefined && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Carrier</Badge>
                <span className="text-xs">${Number(order.stallion_cost).toFixed(2)}</span>
                {shipping > 0 && (
                  <span className={`text-xs font-medium ${shipping - Number(order.stallion_cost) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ({shipping - Number(order.stallion_cost) >= 0 ? '+' : ''}{(shipping - Number(order.stallion_cost)).toFixed(2)})
                  </span>
                )}
              </span>
            )}
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
            {order.shipping?.country && (
              <>
                <span className="mx-1">•</span>
                <span>{getCountryFlag(order.shipping.country)}</span>
              </>
            )}
          </div>
          
          <hr className="border-border" />
          
          <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
