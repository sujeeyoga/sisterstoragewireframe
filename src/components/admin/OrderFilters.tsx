import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface OrderFiltersState {
  dateRange: 'today' | '7d' | '30d' | 'all';
  statuses: string[];
  sortBy: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
}

interface OrderFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: OrderFiltersState;
  onFiltersChange: (filters: OrderFiltersState) => void;
  onApply: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'processing', label: 'Paid' },
  { value: 'completed', label: 'Fulfilled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function OrderFilters({ open, onOpenChange, filters, onFiltersChange, onApply }: OrderFiltersProps) {
  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };
  
  const handleReset = () => {
    onFiltersChange({
      dateRange: 'all',
      statuses: [],
      sortBy: 'newest',
    });
  };
  
  const activeFilterCount = 
    (filters.dateRange !== 'all' ? 1 : 0) + 
    filters.statuses.length + 
    (filters.sortBy !== 'newest' ? 1 : 0);
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Orders</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status */}
          <div className="space-y-3">
            <Label>Order Status</Label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filters.statuses.includes(option.value)}
                    onCheckedChange={() => toggleStatus(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount_high">Amount (High to Low)</SelectItem>
                <SelectItem value="amount_low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DrawerFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={() => { onApply(); onOpenChange(false); }} className="flex-1">
              Apply {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
