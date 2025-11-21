import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyOrdersStateProps {
  searchQuery?: string;
  statusFilter?: string;
}

export const EmptyOrdersState = ({ searchQuery, statusFilter }: EmptyOrdersStateProps) => {
  const navigate = useNavigate();
  const hasFilters = searchQuery || (statusFilter && statusFilter !== 'all');

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {hasFilters ? 'No matching orders' : 'No orders yet'}
        </h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          {hasFilters 
            ? 'Try adjusting your search or filters to find what you\'re looking for.' 
            : 'Start shopping to see your orders here. All your purchases will be tracked in one place.'}
        </p>
        <Button 
          onClick={() => navigate('/shop')} 
          className="bg-brand-pink hover:bg-brand-pink/90"
        >
          {hasFilters ? 'Clear Filters & Shop' : 'Start Shopping'}
        </Button>
      </CardContent>
    </Card>
  );
};
