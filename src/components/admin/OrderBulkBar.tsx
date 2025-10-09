import { Button } from '@/components/ui/button';
import { Printer, Package, MoreHorizontal } from 'lucide-react';

interface OrderBulkBarProps {
  selectedCount: number;
  onFulfill: () => void;
  onPrint: () => void;
  onCancel: () => void;
}

export function OrderBulkBar({ selectedCount, onFulfill, onPrint, onCancel }: OrderBulkBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="sticky bottom-0 inset-x-0 p-3 bg-background/90 border-t backdrop-blur-sm z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">✓ {selectedCount} selected</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={onFulfill}>
            <Package className="h-4 w-4 mr-2" />
            Fulfill
          </Button>
        </div>
      </div>
    </div>
  );
}
