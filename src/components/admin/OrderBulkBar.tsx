import { Button } from '@/components/ui/button';
import { Printer, Package, Truck, Loader2 } from 'lucide-react';

interface OrderBulkBarProps {
  selectedCount: number;
  onFulfill: () => void;
  onPrint: () => void;
  onCancel: () => void;
  isPrinting?: boolean;
}

export function OrderBulkBar({ selectedCount, onFulfill, onPrint, onCancel, isPrinting }: OrderBulkBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 pb-safe bg-background border-t shadow-lg z-50">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">✓ {selectedCount} selected</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPrint} 
            disabled={isPrinting}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            {isPrinting ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Printer className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{isPrinting ? 'Loading...' : 'Print Labels'}</span>
            <span className="sm:hidden">{isPrinting ? '...' : 'Print'}</span>
          </Button>
          <Button size="sm" onClick={onFulfill} className="flex-1 sm:flex-none min-h-[44px]">
            <Truck className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Bulk</span> Fulfill
          </Button>
        </div>
      </div>
    </div>
  );
}
