import { Button } from '@/components/ui/button';
import { Printer, Package, Truck } from 'lucide-react';

interface OrderBulkBarProps {
  selectedCount: number;
  onFulfill: () => void;
  onPrint: () => void;
  onCancel: () => void;
}

export function OrderBulkBar({ selectedCount, onFulfill, onPrint, onCancel }: OrderBulkBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">✓ {selectedCount} selected</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint} className="flex-1 sm:flex-none">
            <Printer className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button size="sm" onClick={onFulfill} className="flex-1 sm:flex-none">
            <Truck className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Bulk</span> Fulfill
          </Button>
        </div>
      </div>
    </div>
  );
}
