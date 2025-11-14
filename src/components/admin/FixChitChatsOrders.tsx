import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const FixChitChatsOrders = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixed, setFixed] = useState(false);
  const { toast } = useToast();

  const affectedOrders = [
    { orderNumber: 'SS-04557846-K25P', shipping: 11.61 },
    { orderNumber: 'SS-02335015-KZML', shipping: 11.61 },
    { orderNumber: 'SS-89890742-1SPF', shipping: 11.61 },
    { orderNumber: 'SS-86540219-7O1U', shipping: 44.09 },
  ];

  const handleFix = async () => {
    setIsFixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fix-chitchats-orders');
      
      if (error) throw error;
      
      toast({
        title: 'Orders Fixed Successfully',
        description: `Updated ${affectedOrders.length} orders with correct shipping amounts`,
      });
      
      setFixed(true);
    } catch (error: any) {
      toast({
        title: 'Error Fixing Orders',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {fixed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          Fix ChitChats Shipping Orders
        </CardTitle>
        <CardDescription>
          {affectedOrders.length} orders have ChitChats shipping miscategorized as products
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            The following orders have shipping charges in the items array instead of the shipping field:
          </p>
          <ul className="space-y-1 text-sm">
            {affectedOrders.map((order) => (
              <li key={order.orderNumber} className="flex justify-between">
                <span className="font-mono">{order.orderNumber}</span>
                <span className="text-muted-foreground">${order.shipping.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {!fixed && (
          <Button 
            onClick={handleFix} 
            disabled={isFixing}
            className="w-full"
          >
            {isFixing ? 'Fixing Orders...' : 'Fix All Orders'}
          </Button>
        )}
        
        {fixed && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            <span>All orders have been fixed successfully</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
