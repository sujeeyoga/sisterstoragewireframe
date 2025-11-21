import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, Search, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderData {
  id: string | number;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  total?: number;
  fulfillment_status?: string;
  tracking_number?: string;
  stallion_cost?: number;
  carrier_name?: string;
  carrier_cost_currency?: string;
  billing?: any;
}

export function ManualCarrierCostEntry() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSource, setOrderSource] = useState<'stripe' | 'woocommerce'>('stripe');
  const [carrierCost, setCarrierCost] = useState('');
  const [carrierName, setCarrierName] = useState('Stallion Express');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    setLoading(true);
    try {
      let data: any = null;
      
      if (orderSource === 'stripe') {
        const { data: stripeData, error } = await supabase
          .from('orders')
          .select('id, order_number, customer_name, customer_email, total, fulfillment_status, tracking_number, stallion_cost, carrier_name, carrier_cost_currency, billing')
          .eq('order_number', orderNumber)
          .maybeSingle();
          
        if (error) throw error;
        data = stripeData;
      } else {
        const { data: wooData, error } = await supabase
          .from('woocommerce_orders')
          .select('id, customer_email, total, fulfillment_status, tracking_number, stallion_cost, carrier_name, carrier_cost_currency, billing')
          .eq('id', parseInt(orderNumber))
          .maybeSingle();
          
        if (error) throw error;
        data = wooData;
      }

      if (!data) {
        toast.error('Order not found');
        setOrder(null);
        return;
      }

      setOrder(data);
      
      // Pre-fill carrier name if it exists
      if (data.carrier_name) {
        setCarrierName(data.carrier_name);
      }
      
      // Pre-fill cost if it exists
      if (data.stallion_cost !== null && data.stallion_cost !== undefined) {
        setCarrierCost(String(data.stallion_cost));
      }

      toast.success('Order found!');
    } catch (error) {
      console.error('Error searching for order:', error);
      toast.error('Failed to search for order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order || !carrierCost) {
      toast.error('Please enter a carrier cost');
      return;
    }

    const cost = parseFloat(carrierCost);
    if (isNaN(cost) || cost < 0) {
      toast.error('Please enter a valid cost amount');
      return;
    }

    setSaving(true);
    try {
      const tableName = orderSource === 'stripe' ? 'orders' : 'woocommerce_orders';
      const { error } = await supabase
        .from(tableName)
        .update({
          stallion_cost: cost,
          carrier_name: carrierName,
          carrier_cost_currency: 'CAD',
        })
        .eq('id', order.id);

      if (error) throw error;

      toast.success('Carrier cost saved successfully!');
      
      // Update local order state
      setOrder({
        ...order,
        stallion_cost: cost,
        carrier_name: carrierName,
        carrier_cost_currency: 'CAD',
      });
    } catch (error) {
      console.error('Error saving carrier cost:', error);
      toast.error('Failed to save carrier cost');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setOrderNumber('');
    setOrder(null);
    setCarrierCost('');
    setCarrierName('Stallion Express');
  };

  const getOrderDisplayInfo = () => {
    if (!order) return null;
    
    const customerName = order.customer_name || 
      (order.billing?.first_name ? `${order.billing.first_name} ${order.billing.last_name || ''}`.trim() : null);
    const customerEmail = order.customer_email || order.billing?.email;
    const displayNumber = order.order_number || order.id;
    
    return { customerName, customerEmail, displayNumber };
  };

  const displayInfo = getOrderDisplayInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Manual Carrier Cost Entry
        </CardTitle>
        <CardDescription>
          Backfill carrier costs for historical orders that are missing this data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderSource">Order Source</Label>
              <Select value={orderSource} onValueChange={(v) => setOrderSource(v as 'stripe' | 'woocommerce')}>
                <SelectTrigger id="orderSource">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe Orders</SelectItem>
                  <SelectItem value="woocommerce">WooCommerce Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <div className="flex gap-2">
                <Input
                  id="orderNumber"
                  placeholder={orderSource === 'stripe' ? 'SS-1001' : '12345'}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        {order && displayInfo && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Order #{displayInfo.displayNumber}</h3>
                  <Badge variant={order.fulfillment_status === 'fulfilled' ? 'default' : 'secondary'}>
                    {order.fulfillment_status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {displayInfo.customerName || 'N/A'} • {displayInfo.customerEmail || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">${Number(order.total || 0).toFixed(2)}</p>
              </div>
            </div>

            {order.tracking_number && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tracking:</span>
                <span className="font-mono">{order.tracking_number}</span>
              </div>
            )}

            {order.stallion_cost !== null && order.stallion_cost !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Carrier Cost:</span>
                <span className="font-semibold text-green-600">
                  ${Number(order.stallion_cost).toFixed(2)} CAD
                </span>
              </div>
            )}
          </div>
        )}

        {/* Cost Entry Section */}
        {order && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrierName">Carrier Name</Label>
                <Select value={carrierName} onValueChange={setCarrierName}>
                  <SelectTrigger id="carrierName">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stallion Express">Stallion Express</SelectItem>
                    <SelectItem value="ChitChats">ChitChats</SelectItem>
                    <SelectItem value="Canada Post">Canada Post</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrierCost">Carrier Cost (CAD)</Label>
                <div className="flex gap-2">
                  <Input
                    id="carrierCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={carrierCost}
                    onChange={(e) => setCarrierCost(e.target.value)}
                  />
                  <Button onClick={handleSave} disabled={saving || !carrierCost}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="w-full">
                Search Another Order
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!order && (
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Select the order source (Stripe or WooCommerce)</li>
              <li>Enter the order number and click search</li>
              <li>Enter the actual carrier cost you paid</li>
              <li>Select the carrier name</li>
              <li>Click Save to update the order</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
