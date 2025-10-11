import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStallionShipping } from '@/hooks/useStallionShipping';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, Truck, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Order {
  id: string | number;
  shipping_address?: any;
  customer_name?: string;
  customer_email?: string;
  billing?: any;
  order_number?: string;
}

interface BulkFulfillmentDialogProps {
  orderIds: (string | number)[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkFulfillmentDialog({ orderIds, open, onClose, onSuccess }: BulkFulfillmentDialogProps) {
  const { loading, createShipment, getLabel } = useStallionShipping();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<'package' | 'processing' | 'complete'>('package');
  const [weight, setWeight] = useState('1');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('6');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Array<{ orderId: string | number; success: boolean; error?: string }>>([]);

  // Fetch orders
  const { data: orders } = useQuery({
    queryKey: ['bulk-orders', orderIds],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds.map(String));
      return data || [];
    },
    enabled: orderIds.length > 0
  });

  // Fetch fulfillment address
  const { data: fulfillmentAddress } = useQuery({
    queryKey: ['store-settings', 'fulfillment-address'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'fulfillment_address')
        .maybeSingle();
      return data?.setting_value;
    },
  });

  const processOrders = async () => {
    if (!fulfillmentAddress) {
      toast.error('Please configure fulfillment address in Store Settings first');
      return;
    }

    if (!orders || orders.length === 0) {
      toast.error('No orders to process');
      return;
    }

    setStep('processing');
    const processResults: Array<{ orderId: string | number; success: boolean; error?: string }> = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const shippingAddr = order.shipping_address;

      if (!shippingAddr) {
        processResults.push({ 
          orderId: order.id, 
          success: false, 
          error: 'Missing shipping address' 
        });
        setProgress(((i + 1) / orders.length) * 100);
        continue;
      }

      try {
        // Create shipment
        const shipment = await createShipment({
          from: fulfillmentAddress as any,
          to: {
            name: order.customer_name || `${(shippingAddr as any).first_name} ${(shippingAddr as any).last_name}`,
            street1: (shippingAddr as any).address_1 || (shippingAddr as any).line1,
            street2: (shippingAddr as any).address_2 || (shippingAddr as any).line2,
            city: (shippingAddr as any).city,
            province: (shippingAddr as any).state || (shippingAddr as any).province,
            postal_code: (shippingAddr as any).postcode || (shippingAddr as any).postal_code,
            country: (shippingAddr as any).country || 'CA',
            email: order.customer_email || (shippingAddr as any).email,
          },
          packages: [{
            weight: parseFloat(weight),
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(height),
            units: 'imperial'
          }],
          postage_type: 'DOM.EP',
          reference: `Order-${order.id}`
        });

        // Get label
        const label = await getLabel(shipment.id);

        // Update order
        await supabase
          .from('orders')
          .update({
            fulfillment_status: 'fulfilled',
            tracking_number: shipment.tracking_number,
            stallion_shipment_id: shipment.id,
            shipping_label_url: label.url,
            fulfilled_at: new Date().toISOString(),
            status: 'processing'
          })
          .eq('id', String(order.id));

        processResults.push({ orderId: order.id, success: true });
      } catch (error: any) {
        console.error(`Failed to process order ${order.id}:`, error);
        processResults.push({ 
          orderId: order.id, 
          success: false, 
          error: error.message || 'Unknown error' 
        });
      }

      setProgress(((i + 1) / orders.length) * 100);
    }

    setResults(processResults);
    setStep('complete');
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    
    const successCount = processResults.filter(r => r.success).length;
    if (successCount > 0) {
      toast.success(`Successfully fulfilled ${successCount} order(s)`);
    }
    if (successCount < processResults.length) {
      toast.error(`Failed to fulfill ${processResults.length - successCount} order(s)`);
    }
  };

  const handleClose = () => {
    setStep('package');
    setProgress(0);
    setResults([]);
    onClose();
    if (results.some(r => r.success)) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Bulk Fulfill Orders
          </DialogTitle>
          <DialogDescription>
            Fulfill {orderIds.length} selected order(s) with Stallion Express
          </DialogDescription>
        </DialogHeader>

        {step === 'package' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                All orders will use the same package dimensions. Make sure they are similar in size.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Standard Package Details
              </Label>
              <p className="text-sm text-muted-foreground">
                Enter the typical dimensions for these orders
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length (in)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (in)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (in)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="6"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={processOrders} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Start Fulfillment
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-6 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing orders...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Creating shipments and generating labels. Please wait...
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  results.every(r => r.success) ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  <Truck className={`h-8 w-8 ${
                    results.every(r => r.success) ? 'text-green-600' : 'text-amber-600'
                  }`} />
                </div>
              </div>
              <h3 className="text-lg font-semibold">
                Bulk Fulfillment {results.every(r => r.success) ? 'Complete' : 'Partially Complete'}
              </h3>
              <p className="text-muted-foreground">
                {results.filter(r => r.success).length} of {results.length} orders fulfilled successfully
              </p>
            </div>

            <ScrollArea className="h-48 rounded-lg border p-4">
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.orderId} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                    <span className="font-mono">Order #{result.orderId}</span>
                    {result.success ? (
                      <span className="text-green-600 font-medium">✓ Fulfilled</span>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Failed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
