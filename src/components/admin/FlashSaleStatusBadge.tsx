import { Badge } from '@/components/ui/badge';
import { Clock, Zap, XCircle } from 'lucide-react';
import { FlashSale, getFlashSaleStatus } from '@/hooks/useFlashSales';

interface FlashSaleStatusBadgeProps {
  sale: FlashSale;
}

export const FlashSaleStatusBadge = ({ sale }: FlashSaleStatusBadgeProps) => {
  const status = getFlashSaleStatus(sale);

  if (status === 'active') {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">
        <Zap className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  } else if (status === 'scheduled') {
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Scheduled
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <XCircle className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }
};
