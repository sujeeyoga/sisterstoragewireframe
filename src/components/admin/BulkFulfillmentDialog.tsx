import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  shipping?: any;
  order_number?: string;
  source?: 'woocommerce' | 'stripe';
}

interface BulkFulfillmentDialogProps {
  orderIds: (string | number)[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRetryFailed?: (failedIds: (string | number)[]) => void;
}

export function BulkFulfillmentDialog({ orderIds, open, onClose, onSuccess, onRetryFailed }: BulkFulfillmentDialogProps) {
  const { loading, createShipment, getLabel } = useStallionShipping();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<'package' | 'processing' | 'complete'>('package');
  const [weight, setWeight] = useState('1');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('6');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Array<{ orderId: string | number; success: boolean; error?: string; errorCategory?: string }>>([]);
  const [failedOrderIds, setFailedOrderIds] = useState<(string | number)[]>([]);

  // Fetch orders from both tables
  const { data: orders } = useQuery({
    queryKey: ['bulk-orders', orderIds],
    queryFn: async () => {
      // Separate string and number IDs
      const stringIds = orderIds.filter(id => typeof id === 'string');
      const numberIds = orderIds.filter(id => typeof id === 'number');
      
      // Fetch from Stripe orders (string IDs)
      const { data: stripeOrders } = stringIds.length > 0 ? await supabase
        .from('orders')
        .select('*')
        .in('id', stringIds as string[]) : { data: [] };
      
      // Fetch from WooCommerce orders (number IDs)
      const { data: wooOrders } = numberIds.length > 0 ? await supabase
        .from('woocommerce_orders')
        .select('*')
        .in('id', numberIds as number[]) : { data: [] };
      
      const allOrders = [
        ...(stripeOrders || []).map(o => ({ ...o, source: 'stripe' as const })),
        ...(wooOrders || []).map(o => ({ ...o, source: 'woocommerce' as const }))
      ];
      
      return allOrders;
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

  const formatPostalCode = (postalCode: string): string => {
    if (!postalCode) return '';
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    // Insert space if missing (A1A1A1 -> A1A 1A1)
    if (cleaned.length === 6 && !cleaned.includes(' ')) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return cleaned;
  };
  
  const validateCanadianPostalCode = (postalCode: string): { valid: boolean; error?: string } => {
    if (!postalCode) return { valid: false, error: 'Postal code is required' };
    
    const formatted = formatPostalCode(postalCode);
    const regex = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;
    
    if (!regex.test(formatted)) {
      return { 
        valid: false, 
        error: `Invalid postal code format: ${postalCode}. Expected format: A1A 1A1` 
      };
    }
    
    return { valid: true };
  };
  
  const validateFulfillmentAddress = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!fulfillmentAddress) {
      errors.push('Fulfillment address not configured');
      return { valid: false, errors };
    }
    
    const addr = fulfillmentAddress as any;
    
    if (!addr.name) errors.push('Missing sender name');
    if (!addr.street1) errors.push('Missing sender street address');
    if (!addr.city) errors.push('Missing sender city');
    if (!addr.province) errors.push('Missing sender province');
    if (!addr.country) errors.push('Missing sender country');
    
    const postalValidation = validateCanadianPostalCode(addr.postal_code || '');
    if (!postalValidation.valid) {
      errors.push(`Sender: ${postalValidation.error}`);
    }
    
    return { valid: errors.length === 0, errors };
  };

  const processOrders = async () => {
    // Validate fulfillment address first
    const addressValidation = validateFulfillmentAddress();
    if (!addressValidation.valid) {
      toast.error('Invalid fulfillment address', {
        description: addressValidation.errors.join('; ')
      });
      return;
    }

    if (!orders || orders.length === 0) {
      toast.error('No orders to process');
      return;
    }

    setStep('processing');
    const processResults: Array<{ orderId: string | number; success: boolean; error?: string; errorCategory?: string }> = [];
    const failed: (string | number)[] = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const shippingAddr = order.shipping_address || order.shipping;

      if (!shippingAddr) {
        processResults.push({ 
          orderId: order.id, 
          success: false, 
          error: 'Missing shipping address',
          errorCategory: 'address'
        });
        failed.push(order.id);
        setProgress(((i + 1) / orders.length) * 100);
        continue;
      }

      const rawPostalCode = (shippingAddr as any).postcode || (shippingAddr as any).postal_code || '';
      const postalCode = formatPostalCode(rawPostalCode);
      
      // Validate postal code format
      const postalValidation = validateCanadianPostalCode(rawPostalCode);
      if (!postalValidation.valid) {
        processResults.push({ 
          orderId: order.id, 
          success: false, 
          error: postalValidation.error,
          errorCategory: 'validation'
        });
        failed.push(order.id);
        setProgress(((i + 1) / orders.length) * 100);
        continue;
      }

      try {
        // Convert imperial to metric for Stallion API
        const weightKg = parseFloat(weight) * 0.453592;
        const lengthCm = parseFloat(length) * 2.54;
        const widthCm = parseFloat(width) * 2.54;
        const heightCm = parseFloat(height) * 2.54;

        // Create shipment
        const shipment = await createShipment({
          from: fulfillmentAddress as any,
          to: {
            name: order.source === 'stripe' 
              ? (order.customer_name || '')
              : `${((order as any).billing?.first_name || '')} ${((order as any).billing?.last_name || '')}`.trim(),
            street1: (shippingAddr as any).address_1 || (shippingAddr as any).line1 || (shippingAddr as any).address1 || '',
            street2: (shippingAddr as any).address_2 || (shippingAddr as any).line2 || (shippingAddr as any).address2 || '',
            city: (shippingAddr as any).city || '',
            province: (shippingAddr as any).state || (shippingAddr as any).province || (shippingAddr as any).province_code || '',
            postal_code: postalCode,
            country: (shippingAddr as any).country || (shippingAddr as any).country_code || 'CA',
            email: order.source === 'stripe' 
              ? (order.customer_email || '')
              : ((order as any).billing?.email || (shippingAddr as any).email || ''),
          },
          packages: [{
            weight: weightKg,
            length: lengthCm,
            width: widthCm,
            height: heightCm,
            units: 'metric'
          }],
          postage_type: 'DOM.EP',
          reference: `Order-${order.id}`
        });

        // Get label
        const label = await getLabel(shipment.id);

        // Get actual cost from Stallion API response
        // Stallion returns cost in various fields depending on API version
        const actualStallionCost = Number((shipment as any).cost || (shipment as any).rate || (shipment as any).postage_cost || 0);

        // Update order in the correct table
        const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';
        await supabase
          .from(tableName)
          .update({
            fulfillment_status: 'fulfilled',
            tracking_number: shipment.tracking_number,
            stallion_shipment_id: shipment.id,
            shipping_label_url: label.url,
            fulfilled_at: new Date().toISOString(),
            stallion_cost: actualStallionCost,
            status: order.source === 'stripe' ? 'processing' : 'completed'
          })
          .eq('id', String(order.id));

        processResults.push({ orderId: order.id, success: true });
      } catch (error: any) {
        console.error(`Failed to process order ${order.id}:`, error);
        const errorMsg = error.message || 'Unknown error';
        const errorCategory = errorMsg.toLowerCase().includes('address') ? 'address' : 
                             errorMsg.toLowerCase().includes('postal') ? 'validation' : 'api';
        processResults.push({ 
          orderId: order.id, 
          success: false, 
          error: errorMsg,
          errorCategory
        });
        failed.push(order.id);
      }

      setProgress(((i + 1) / orders.length) * 100);
    }

    setResults(processResults);
    setFailedOrderIds(failed);
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
  
  const retryFailed = () => {
    // This will be called from the dialog parent with filtered IDs
    handleClose();
    // Parent will reopen with only failed IDs
  };

  const handleClose = () => {
    setStep('package');
    setProgress(0);
    setResults([]);
    setFailedOrderIds([]);
    onClose();
    if (results.some(r => r.success)) {
      onSuccess();
    }
  };
  
  const handleRetryFailed = () => {
    if (onRetryFailed && failedOrderIds.length > 0) {
      onRetryFailed(failedOrderIds);
      handleClose();
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
            {failedOrderIds.length > 0 && step === 'package'
              ? `Retrying ${failedOrderIds.length} failed order(s)`
              : `Fulfill ${orderIds.length} selected order(s) with Stallion Express`}
          </DialogDescription>
        </DialogHeader>

        {step === 'package' && (
          <div className="space-y-4">
            {/* Fulfillment Address Validation Warning */}
            {(() => {
              const validation = validateFulfillmentAddress();
              if (!validation.valid) {
                return (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-3 flex-1">
                        <p className="text-sm font-semibold text-red-900">Fulfillment address issues:</p>
                        <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                          {validation.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => {
                            window.open('/admin?tab=settings', '_blank');
                          }}
                        >
                          Open Store Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
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
              <Button 
                onClick={processOrders} 
                disabled={loading || !validateFulfillmentAddress().valid} 
                className="flex-1"
              >
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

            <ScrollArea className="h-64 rounded-lg border p-4">
              <div className="space-y-3">
                {results.map((result) => (
                  <div key={result.orderId} className={`p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium">Order #{result.orderId}</span>
                          {result.errorCategory && (
                            <Badge variant="outline" className="text-xs">
                              {result.errorCategory}
                            </Badge>
                          )}
                        </div>
                        {result.error && (
                          <p className="text-xs text-red-700 mt-1 break-words">
                            {result.error}
                          </p>
                        )}
                      </div>
                      {result.success ? (
                        <span className="text-green-600 font-medium text-sm flex-shrink-0">✓ Fulfilled</span>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 flex-shrink-0">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium text-sm">Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              {failedOrderIds.length > 0 && onRetryFailed && (
                <Button onClick={handleRetryFailed} variant="outline" className="flex-1">
                  Retry {failedOrderIds.length} Failed
                </Button>
              )}
              <Button 
                onClick={() => {
                  // Copy error log to clipboard
                  const errorLog = results
                    .filter(r => !r.success)
                    .map(r => `Order #${r.orderId}: ${r.error}`)
                    .join('\n');
                  navigator.clipboard.writeText(errorLog);
                  toast.success('Error log copied to clipboard');
                }}
                variant="outline"
                className={failedOrderIds.length > 0 ? 'flex-1' : 'w-full'}
                disabled={!results.some(r => !r.success)}
              >
                Copy Error Log
              </Button>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
