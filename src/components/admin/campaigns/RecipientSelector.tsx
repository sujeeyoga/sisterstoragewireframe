import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerList } from '@/hooks/useCustomerList';
import { Users, TrendingUp, UserCheck, UserPlus, Sliders } from 'lucide-react';

interface RecipientSelectorProps {
  onRecipientsChange: (recipients: Array<{ email: string; name?: string }>) => void;
}

export const RecipientSelector = ({ onRecipientsChange }: RecipientSelectorProps) => {
  const [segment, setSegment] = useState('all');
  const [customFilter, setCustomFilter] = useState({
    minSpent: '',
    minOrders: '',
    lastOrderDays: '',
  });
  
  const { customers, getSegmentedCustomers } = useCustomerList();

  const handleSegmentChange = (value: string) => {
    setSegment(value);
    updateRecipients(value, customFilter);
  };

  const handleCustomFilterChange = (field: string, value: string) => {
    const newFilter = { ...customFilter, [field]: value };
    setCustomFilter(newFilter);
    if (segment === 'custom') {
      updateRecipients('custom', newFilter);
    }
  };

  const updateRecipients = (selectedSegment: string, filter: any) => {
    const filterForQuery = {
      minSpent: filter.minSpent ? Number(filter.minSpent) : undefined,
      minOrders: filter.minOrders ? Number(filter.minOrders) : undefined,
      lastOrderDays: filter.lastOrderDays ? Number(filter.lastOrderDays) : undefined,
    };
    
    const segmentedCustomers = getSegmentedCustomers(selectedSegment, filterForQuery);
    const recipients = segmentedCustomers.map(c => ({
      email: c.customer_email,
      name: c.customer_name,
    }));
    onRecipientsChange(recipients);
  };

  const getRecipientCount = () => {
    const filterForQuery = {
      minSpent: customFilter.minSpent ? Number(customFilter.minSpent) : undefined,
      minOrders: customFilter.minOrders ? Number(customFilter.minOrders) : undefined,
      lastOrderDays: customFilter.lastOrderDays ? Number(customFilter.lastOrderDays) : undefined,
    };
    return getSegmentedCustomers(segment, filterForQuery).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Recipients</CardTitle>
        <CardDescription>
          Choose who will receive this email campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={segment} onValueChange={handleSegmentChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
              <Users className="w-4 h-4" />
              All Customers
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recent" id="recent" />
            <Label htmlFor="recent" className="flex items-center gap-2 cursor-pointer">
              <TrendingUp className="w-4 h-4" />
              Recent Customers (Last 30 days)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high-value" id="high-value" />
            <Label htmlFor="high-value" className="flex items-center gap-2 cursor-pointer">
              <TrendingUp className="w-4 h-4" />
              High-Value Customers ($200+)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="first-time" id="first-time" />
            <Label htmlFor="first-time" className="flex items-center gap-2 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              First-Time Buyers
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="repeat" id="repeat" />
            <Label htmlFor="repeat" className="flex items-center gap-2 cursor-pointer">
              <UserCheck className="w-4 h-4" />
              Repeat Customers (2+ orders)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer">
              <Sliders className="w-4 h-4" />
              Custom Filter
            </Label>
          </div>
        </RadioGroup>

        {segment === 'custom' && (
          <div className="ml-6 space-y-3 pl-4 border-l-2 border-border">
            <div>
              <Label htmlFor="minSpent">Minimum Total Spent ($)</Label>
              <Input
                id="minSpent"
                type="number"
                placeholder="e.g., 100"
                value={customFilter.minSpent}
                onChange={(e) => handleCustomFilterChange('minSpent', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="minOrders">Minimum Order Count</Label>
              <Input
                id="minOrders"
                type="number"
                placeholder="e.g., 2"
                value={customFilter.minOrders}
                onChange={(e) => handleCustomFilterChange('minOrders', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="lastOrderDays">Ordered Within Last (days)</Label>
              <Input
                id="lastOrderDays"
                type="number"
                placeholder="e.g., 60"
                value={customFilter.lastOrderDays}
                onChange={(e) => handleCustomFilterChange('lastOrderDays', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm font-medium">
            Recipients: <span className="text-primary">{getRecipientCount()}</span> customers
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
