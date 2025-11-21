import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  fulfillmentStatus?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge = ({ status, fulfillmentStatus, size = 'md' }: OrderStatusBadgeProps) => {
  const getStatusConfig = () => {
    if (fulfillmentStatus === 'fulfilled') {
      return {
        label: 'Shipped',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Truck,
      };
    }

    switch (status) {
      case 'completed':
        return {
          label: 'Delivered',
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2,
        };
      case 'processing':
        return {
          label: 'Processing',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Package,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
        };
      default:
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const iconSize = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3';
  const textSize = size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <Badge className={`${config.className} gap-1.5 ${textSize} font-medium`}>
      <Icon className={iconSize} />
      {config.label}
    </Badge>
  );
};
