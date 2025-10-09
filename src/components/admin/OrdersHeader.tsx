import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown, MoreVertical, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrdersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: string;
  onStatusChange: (status: string) => void;
  onFilterClick: () => void;
  filterCount?: number;
  onBackClick?: () => void;
}

const statusChips = [
  { value: 'all', label: 'All', color: 'bg-background border' },
  { value: 'pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'processing', label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'completed', label: 'Fulfilled', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'refunded', label: 'Refunded', color: 'bg-zinc-100 text-zinc-700 border-zinc-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export function OrdersHeader({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
  onFilterClick,
  filterCount = 0,
  onBackClick,
}: OrdersHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-4 border-b">
        {onBackClick && (
          <Button variant="ghost" size="icon" onClick={onBackClick} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base font-semibold flex-1 text-center">Orders</h1>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 relative"
            onClick={onFilterClick}
          >
            <Filter className="h-4 w-4" />
            {filterCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {filterCount}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Status Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => onStatusChange(chip.value)}
              className={`px-3 h-8 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeStatus === chip.value 
                  ? chip.color 
                  : 'bg-background border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
