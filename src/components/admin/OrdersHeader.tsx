import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown, MoreVertical, ArrowLeft, RefreshCw, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';

interface OrdersHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: string;
  onStatusChange: (status: string) => void;
  onFilterClick: () => void;
  filterCount?: number;
  onBackClick?: () => void;
  selectionMode?: boolean;
  onToggleSelection?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  selectedCount?: number;
  showArchived?: boolean;
  onToggleArchived?: () => void;
  statusCounts?: Record<string, number>;
}

const statusChips = [
  { value: 'all', label: 'All', color: 'bg-background border' },
  { value: 'processing', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'completed', label: 'Fulfilled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
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
  selectionMode,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  selectedCount = 0,
  showArchived = false,
  onToggleArchived,
  statusCounts,
}: OrdersHeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Fetch last sync time
  const { data: lastSync } = useQuery({
    queryKey: ['last-sync-time'],
    queryFn: async () => {
      const { data } = await supabase
        .from('woocommerce_sync_log')
        .select('created_at')
        .eq('sync_type', 'tracking')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data?.created_at ? new Date(data.created_at) : null;
    },
    refetchInterval: 60000, // Refetch every minute
  });
  
  useEffect(() => {
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, [lastSync]);
  
  const getRelativeTime = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleSyncTracking = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stallion-tracking');
      
      if (error) throw error;
      
      // Show detailed sync results
      if (data.errors > 0) {
        toast.success(`Sync complete: ${data.updated} updated, ${data.errors} failed`, {
          description: `Total: ${data.total} orders checked`
        });
      } else {
        toast.success(`Tracking sync complete`, {
          description: `Updated ${data.updated} of ${data.total} orders`
        });
      }
      
      setLastSyncTime(new Date());
      
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(error.message || 'Failed to sync tracking');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-14 px-4 border-b">
        {onBackClick && (
          <Button variant="ghost" size="icon" onClick={onBackClick} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-base font-semibold flex-1 text-center">
          Orders
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              ({selectedCount} selected)
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          {onToggleSelection && selectionMode && onSelectAll && onDeselectAll && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  size="icon"
                  title="Bulk selection options"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSelectAll}>
                  Select All on Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeselectAll}>
                  Deselect All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onToggleSelection && (
            <Button 
              variant={selectionMode ? "default" : "ghost"}
              size="icon"
              onClick={onToggleSelection}
              title={selectionMode ? "Cancel selection" : "Select orders"}
            >
              {selectionMode ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSyncTracking}
            disabled={isSyncing}
            title={`Sync Stallion Tracking\nLast sync: ${getRelativeTime(lastSyncTime)}`}
            className="relative"
          >
            <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {lastSyncTime && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap">
                {getRelativeTime(lastSyncTime)}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
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
          {statusChips.map((chip) => {
            const count = statusCounts?.[chip.value] ?? 0;
            return (
              <button
                key={chip.value}
                onClick={() => onStatusChange(chip.value)}
                className={`px-3 h-8 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeStatus === chip.value 
                    ? 'bg-pink-50 text-pink-700 border-pink-200' 
                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {chip.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
          {onToggleArchived && (
            <button
              onClick={onToggleArchived}
              className={`px-3 h-8 rounded-full text-sm font-medium whitespace-nowrap transition-all border ml-auto ${
                showArchived
                  ? 'bg-pink-50 text-pink-700 border-pink-200' 
                  : 'bg-background border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {showArchived ? '📦 Archived' : '📦 Archive'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
