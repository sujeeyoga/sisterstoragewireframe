import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChitChatsShipping } from '@/hooks/useChitChatsShipping';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, Truck, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string | number;
  shipping_address?: any;
  customer_name?: string;
  customer_email?: string;
  billing?: any;
  shipping?: any;
  source?: 'woocommerce' | 'stripe';
}

interface ChitChatsFulfillmentDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ShippingRate {
  name: string;
  carrier: string;
  service_code: string;
  price: number;
  delivery_estimate?: string;
}

export function ChitChatsFulfillmentDialog({ order, open, onClose, onSuccess }: ChitChatsFulfillmentDialogProps) {
  const { isLoading, getRates, createShipment } = useChitChatsShipping();
  
  const [step, setStep] = useState<'package' | 'rates' | 'confirm'>('package');
  const [packagingProfile, setPackagingProfile] = useState<'small' | 'large'>('small');
  const [weight, setWeight] = useState('170'); // Default to Travel box weight in grams
  const [weightUnit, setWeightUnit] = useState<'g' | 'lb'>('g');
  const [length, setLength] = useState('40'); // 16 inches in cm
  const [width, setWidth] = useState('30'); // 12 inches in cm
  const [height, setHeight] = useState('10'); // 4 inches in cm
  const [dimensionUnit, setDimensionUnit] = useState<'cm' | 'in'>('cm');
  const [packageValue, setPackageValue] = useState('75');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>('');
  const [shipmentData, setShipmentData] = useState<any>(null);

  // Packaging profiles (inches converted to cm)
  const profiles = {
    small: { length: 40, width: 30, height: 10, emptyWeight: 200 }, // 16×12×4 in
    large: { length: 40, width: 30, height: 30, emptyWeight: 450 }, // 16×12×12 in
  };

  // Update dimensions when profile changes
  const handleProfileChange = (profile: 'small' | 'large') => {
    setPackagingProfile(profile);
    const dims = profiles[profile];
    setLength(String(dims.length));
    setWidth(String(dims.width));
    setHeight(String(dims.height));
  };

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

  const handleGetRates = async () => {
    if (!fulfillmentAddress) {
      toast.error('Please configure fulfillment address in Store Settings first');
      return;
    }

    const shippingAddr = order.shipping_address || order.billing || order.shipping;
    if (!shippingAddr) {
      toast.error('No shipping address found for this order');
      return;
    }

    try {
      const ratesData = await getRates({
        name: order.customer_name || `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim(),
        address1: shippingAddr.address_1 || shippingAddr.line1 || shippingAddr.address1 || '',
        address2: shippingAddr.address_2 || shippingAddr.line2 || shippingAddr.address2 || '',
        city: shippingAddr.city || '',
        state: shippingAddr.state || shippingAddr.province || '',
        postalCode: shippingAddr.postcode || shippingAddr.postal_code || shippingAddr.zip || '',
        country: shippingAddr.country || shippingAddr.country_code || 'US',
        phone: shippingAddr.phone || '',
      }, {
        weight: parseFloat(weight),
        weightUnit,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        dimensionUnit,
        packageValue: parseFloat(packageValue),
      });

      setRates(ratesData.rates || []);
      setStep('rates');
    } catch (error) {
      console.error('Failed to get ChitChats rates:', error);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedRate) {
      toast.error('Please select a shipping rate');
      return;
    }

    const shippingAddr = order.shipping_address || order.billing || order.shipping;
    const selectedRateData = rates.find(r => r.service_code === selectedRate);
    
    try {
      const shipment = await createShipment(
        {
          name: order.customer_name || `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim(),
          address1: shippingAddr.address_1 || shippingAddr.line1 || shippingAddr.address1 || '',
          address2: shippingAddr.address_2 || shippingAddr.line2 || shippingAddr.address2 || '',
          city: shippingAddr.city || '',
          state: shippingAddr.state || shippingAddr.province || '',
          postalCode: shippingAddr.postcode || shippingAddr.postal_code || shippingAddr.zip || '',
          country: shippingAddr.country || shippingAddr.country_code || 'US',
          phone: shippingAddr.phone || '',
        },
        {
          weight: parseFloat(weight),
          weightUnit,
          length: parseFloat(length),
          width: parseFloat(width),
          height: parseFloat(height),
          dimensionUnit,
          packageValue: parseFloat(packageValue),
        },
        {
          carrier: selectedRateData?.carrier,
          serviceCode: selectedRate,
          orderId: String(order.id),
          description: 'Jewelry organizer',
        }
      );

      setShipmentData(shipment);

      // Extract actual carrier cost from ChitChats response
      const actualCost = parseFloat(shipment.postage_fee || shipment.rate || '0');
      console.log('ChitChats carrier cost:', actualCost);

      // Update order in the correct database table
      const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';
      const { error: updateError } = await supabase
        .from(tableName)
        .update({
          fulfillment_status: 'fulfilled',
          tracking_number: shipment.tracking_number || shipment.id,
          shipping_label_url: shipment.label_url || shipment.postage_label_url,
          fulfilled_at: new Date().toISOString(),
          stallion_cost: actualCost,
          carrier_name: 'ChitChats',
          carrier_cost_currency: 'CAD',
          status: order.source === 'stripe' ? 'processing' : 'completed'
        })
        .eq('id', String(order.id));

      // Send shipping notification email
      try {
        const orderData = await supabase
          .from(tableName)
          .select('*')
          .eq('id', String(order.id))
          .single();

        if (orderData.data) {
          const data: any = orderData.data;
          const emailResponse = await supabase.functions.invoke('send-shipping-notification', {
            body: {
              orderId: order.id,
              customerEmail: data.customer_email || data.billing?.email || '',
              customerName: data.customer_name || `${data.billing?.first_name || ''} ${data.billing?.last_name || ''}`.trim() || 'Customer',
              orderNumber: data.order_number || String(order.id),
              trackingNumber: shipment.tracking_number || shipment.id,
              carrier: selectedRateData?.carrier || 'ChitChats',
              items: data.items || data.line_items || []
            }
          });

          if (emailResponse.error) {
            console.error('Failed to send shipping notification:', emailResponse.error);
            toast.error('Shipment created but email notification failed', {
              description: 'You can resend the notification from the order details.'
            });
          } else {
            toast.success('Shipping notification sent to customer');
          }
        }
      } catch (emailError) {
        console.error('Failed to send shipping notification:', emailError);
        toast.error('Shipment created but email notification failed', {
          description: 'You can resend the notification from the order details.'
        });
      }

      setStep('confirm');
      onSuccess();
    } catch (error) {
      console.error('Failed to create ChitChats shipment:', error);
    }
  };

  const handleDownloadLabel = () => {
    if (shipmentData?.label_url || shipmentData?.postage_label_url) {
      window.open(shipmentData.label_url || shipmentData.postage_label_url, '_blank');
    } else {
      toast.error('No shipping label available');
    }
  };

  const handleClose = () => {
    setStep('package');
    setRates([]);
    setSelectedRate('');
    setShipmentData(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fulfill with ChitChats International
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
                Select shipping box size and enter package weight
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">Shipping Box Size</Label>
              <Select value={packagingProfile} onValueChange={(v) => handleProfileChange(v as 'small' | 'large')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small Box (16×12×4 inches / 40×30×10 cm)</SelectItem>
                  <SelectItem value="large">Large Box (16×12×12 inches / 40×30×30 cm)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Box dimensions are locked based on selection
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={weightUnit === 'g' ? '170' : '0.37'}
                    className="flex-1"
                  />
                  <RadioGroup
                    value={weightUnit}
                    onValueChange={(v) => setWeightUnit(v as 'g' | 'lb')}
                    className="flex gap-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="g" id="weight-g" />
                      <Label htmlFor="weight-g" className="cursor-pointer text-sm">g</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="lb" id="weight-lb" />
                      <Label htmlFor="weight-lb" className="cursor-pointer text-sm">lb</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageValue">Package Value (USD)</Label>
                <Input
                  id="packageValue"
                  type="number"
                  value={packageValue}
                  onChange={(e) => setPackageValue(e.target.value)}
                  placeholder="75"
                />
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Box Dimensions:</span>
                <span className="font-medium">{length} × {width} × {height} cm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Empty Box Weight:</span>
                <span className="font-medium">{profiles[packagingProfile].emptyWeight}g</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Product weight + empty box weight will be used for shipping calculation
              </p>
            </div>

            <Button onClick={handleGetRates} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Get International Shipping Rates
            </Button>
          </div>
        )}

        {step === 'rates' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Select Shipping Method</Label>
              <p className="text-sm text-muted-foreground">
                Choose the best shipping option for this international order
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
                      <RadioGroupItem value={rate.service_code} id={`rate-${index}`} />
                      <Label htmlFor={`rate-${index}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{rate.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {rate.carrier}
                              {rate.delivery_estimate && ` • ${rate.delivery_estimate}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${rate.price.toFixed(2)} USD</p>
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
                disabled={!selectedRate || isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
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
                Your international shipping label is ready to print
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tracking Number:</span>
                <Badge variant="outline" className="font-mono">
                  {shipmentData?.tracking_number || shipmentData?.id || 'N/A'}
                </Badge>
              </div>
              {shipmentData?.id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Shipment ID:</span>
                  <span className="text-sm font-mono">{shipmentData.id}</span>
                </div>
              )}
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