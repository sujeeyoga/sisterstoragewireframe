import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStallionShipping } from '@/hooks/useStallionShipping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, Truck, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Order {
  id: string | number;
  shipping_address?: any;
  customer_name?: string;
  customer_email?: string;
  billing?: any;
  shipping?: any;
  source?: 'woocommerce' | 'stripe';
}

interface StallionFulfillmentDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ShippingRate {
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  estimated_days: string;
}

export function StallionFulfillmentDialog({ order, open, onClose, onSuccess }: StallionFulfillmentDialogProps) {
  const { loading, getRates, createShipment, getLabel } = useStallionShipping();
  
  const [step, setStep] = useState<'package' | 'rates' | 'confirm'>('package');
  const [weight, setWeight] = useState('1');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('6');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>('');
  const [shipmentId, setShipmentId] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  // Fetch fulfillment address from store settings
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
    return postalCode.replace(/\s/g, '').toUpperCase();
  };

  const handleGetRates = async () => {
    if (!fulfillmentAddress) {
      toast.error('Please configure fulfillment address in Store Settings first');
      return;
    }

    const shippingAddr = order.shipping_address || order.billing;
    if (!shippingAddr) {
      toast.error('No shipping address found for this order');
      return;
    }

    const postalCode = formatPostalCode(shippingAddr.postcode || shippingAddr.postal_code || '');
    
    // Validate postal code
    if (!postalCode || postalCode.length !== 6) {
      toast.error(`Invalid postal code: ${shippingAddr.postcode || shippingAddr.postal_code}. Canadian postal codes must be 6 characters (e.g., M5V3A8).`);
      return;
    }

    try {
      // Convert imperial to metric for Stallion API
      const weightKg = parseFloat(weight) * 0.453592; // lbs to kg
      const lengthCm = parseFloat(length) * 2.54; // inches to cm
      const widthCm = parseFloat(width) * 2.54;
      const heightCm = parseFloat(height) * 2.54;

      const ratesData = await getRates({
        from: fulfillmentAddress as any,
        to: {
          name: order.customer_name || `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim(),
          street1: shippingAddr.address_1 || shippingAddr.line1 || shippingAddr.address1 || '',
          street2: shippingAddr.address_2 || shippingAddr.line2 || shippingAddr.address2 || '',
          city: shippingAddr.city || '',
          province: shippingAddr.state || shippingAddr.province || shippingAddr.province_code || '',
          postal_code: postalCode,
          country: shippingAddr.country || shippingAddr.country_code || 'CA',
          email: order.customer_email || shippingAddr.email || '',
        },
        packages: [{
          weight: weightKg,
          length: lengthCm,
          width: widthCm,
          height: heightCm,
          units: 'metric'
        }]
      });

      setRates(ratesData.rates || []);
      setStep('rates');
    } catch (error) {
      console.error('Failed to get rates:', error);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedRate || !fulfillmentAddress) return;

    const shippingAddr = order.shipping_address || order.billing;
    const postalCode = formatPostalCode(shippingAddr.postcode || shippingAddr.postal_code || '');
    
    try {
      // Convert imperial to metric for Stallion API
      const weightKg = parseFloat(weight) * 0.453592;
      const lengthCm = parseFloat(length) * 2.54;
      const widthCm = parseFloat(width) * 2.54;
      const heightCm = parseFloat(height) * 2.54;

      const shipment = await createShipment({
        from: fulfillmentAddress as any,
        to: {
          name: order.customer_name || `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim(),
          street1: shippingAddr.address_1 || shippingAddr.line1 || shippingAddr.address1 || '',
          street2: shippingAddr.address_2 || shippingAddr.line2 || shippingAddr.address2 || '',
          city: shippingAddr.city || '',
          province: shippingAddr.state || shippingAddr.province || shippingAddr.province_code || '',
          postal_code: postalCode,
          country: shippingAddr.country || shippingAddr.country_code || 'CA',
          email: order.customer_email || shippingAddr.email || '',
        },
        packages: [{
          weight: weightKg,
          length: lengthCm,
          width: widthCm,
          height: heightCm,
          units: 'metric'
        }],
        postage_type: selectedRate,
        reference: `Order-${order.id}`
      });

      setShipmentId(shipment.id);
      setTrackingNumber(shipment.tracking_number);

      // Get shipping label
      const label = await getLabel(shipment.id);

      // Get actual cost from Stallion API response
      // Stallion returns cost in various fields depending on API version
      const actualStallionCost = Number(shipment.cost || shipment.rate || shipment.postage_cost || 0);

      // Update order in the correct database table
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

      // Send shipping notification email
      try {
        const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';
        const orderData = await supabase
          .from(tableName)
          .select('*')
          .eq('id', String(order.id))
          .single();

        if (orderData.data) {
          const data: any = orderData.data;
          await supabase.functions.invoke('send-shipping-notification', {
            body: {
              orderId: order.id,
              customerEmail: data.customer_email || data.billing?.email || '',
              customerName: data.customer_name || `${data.billing?.first_name || ''} ${data.billing?.last_name || ''}`.trim() || 'Customer',
              orderNumber: data.order_number || String(order.id),
              trackingNumber: shipment.tracking_number,
              carrier: 'Stallion Express',
              items: data.items || data.line_items || []
            }
          });
        }
      } catch (emailError) {
        console.error('Failed to send shipping notification:', emailError);
        // Don't fail the fulfillment if email fails
      }

      setStep('confirm');
      onSuccess();
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const handleDownloadLabel = async () => {
    if (!shipmentId) return;
    
    try {
      const label = await getLabel(shipmentId);
      window.open(label.url, '_blank');
    } catch (error) {
      console.error('Failed to get label:', error);
    }
  };

  const handleClose = () => {
    setStep('package');
    setRates([]);
    setSelectedRate('');
    setShipmentId('');
    setTrackingNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fulfill with Stallion Express
          </DialogTitle>
          <DialogDescription>
            Order #{order.id}
          </DialogDescription>
        </DialogHeader>

        {step === 'package' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Package Details
              </Label>
              <p className="text-sm text-muted-foreground">
                Enter the dimensions and weight of your package
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

            <Button onClick={handleGetRates} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Get Shipping Rates
            </Button>
          </div>
        )}

        {step === 'rates' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Select Shipping Method</Label>
              <p className="text-sm text-muted-foreground">
                Choose the best shipping option for this order
              </p>
            </div>

            {rates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No shipping rates available
              </div>
            ) : (
              <RadioGroup value={selectedRate} onValueChange={setSelectedRate}>
                <div className="space-y-3">
                  {rates.map((rate, index) => (
                    <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent">
                      <RadioGroupItem value={rate.service} id={`rate-${index}`} />
                      <Label htmlFor={`rate-${index}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{rate.carrier} - {rate.service}</p>
                            <p className="text-sm text-muted-foreground">
                              Estimated delivery: {rate.estimated_days}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${rate.rate.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{rate.currency}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('package')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleCreateShipment} 
                disabled={!selectedRate || loading}
                className="flex-1"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Shipment
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Shipment Created Successfully!</h3>
              <p className="text-muted-foreground">
                Your shipping label is ready to print
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tracking Number:</span>
                <Badge variant="outline" className="font-mono">
                  {trackingNumber}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Shipment ID:</span>
                <span className="text-sm font-mono">{shipmentId}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadLabel} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Label
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
