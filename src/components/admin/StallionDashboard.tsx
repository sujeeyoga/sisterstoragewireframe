import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, CheckCircle, AlertCircle, RefreshCw, MapPin, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStallionShipping } from '@/hooks/useStallionShipping';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StallionDashboard() {
  const queryClient = useQueryClient();
  const { loading: ratesLoading, getRates } = useStallionShipping();
  const [isSyncing, setIsSyncing] = useState(false);

  // Rate tester state
  const [postalCode, setPostalCode] = useState('');
  const [weight, setWeight] = useState('1');
  const [rates, setRates] = useState<any[]>([]);

  // Fetch fulfillment stats
  const { data: stats } = useQuery({
    queryKey: ['stallion-stats'],
    queryFn: async () => {
      const [stripeResult, wooResult] = await Promise.all([
        supabase
          .from('orders')
          .select('fulfillment_status, stallion_shipment_id')
          .not('stallion_shipment_id', 'is', null),
        supabase
          .from('woocommerce_orders')
          .select('fulfillment_status, stallion_shipment_id')
          .not('stallion_shipment_id', 'is', null)
      ]);

      const allOrders = [
        ...(stripeResult.data || []),
        ...(wooResult.data || [])
      ];

      return {
        total: allOrders.length,
        fulfilled: allOrders.filter(o => o.fulfillment_status === 'fulfilled').length,
        unfulfilled: allOrders.filter(o => o.fulfillment_status === 'unfulfilled').length,
      };
    },
  });

  // Fetch recent shipments
  const { data: recentShipments } = useQuery({
    queryKey: ['recent-stallion-shipments'],
    queryFn: async () => {
      const [stripeResult, wooResult] = await Promise.all([
        supabase
          .from('orders')
          .select('id, order_number, customer_name, tracking_number, fulfilled_at, fulfillment_status')
          .not('stallion_shipment_id', 'is', null)
          .order('fulfilled_at', { ascending: false })
          .limit(5),
        supabase
          .from('woocommerce_orders')
          .select('id, billing, tracking_number, fulfilled_at, fulfillment_status')
          .not('stallion_shipment_id', 'is', null)
          .order('fulfilled_at', { ascending: false })
          .limit(5)
      ]);

      const stripeShipments = (stripeResult.data || []).map(o => ({
        id: o.id,
        order_number: o.order_number,
        customer: o.customer_name || 'Guest',
        tracking: o.tracking_number,
        date: o.fulfilled_at,
        status: o.fulfillment_status,
        source: 'stripe' as const
      }));

      const wooShipments = (wooResult.data || []).map(o => ({
        id: o.id,
        order_number: String(o.id),
        customer: `${(o.billing as any)?.first_name || ''} ${(o.billing as any)?.last_name || ''}`.trim() || 'Guest',
        tracking: o.tracking_number,
        date: o.fulfilled_at,
        status: o.fulfillment_status,
        source: 'woocommerce' as const
      }));

      return [...stripeShipments, ...wooShipments]
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        .slice(0, 5);
    },
  });

  // Fetch fulfillment address
  const { data: fulfillmentAddress } = useQuery({
    queryKey: ['store-settings', 'fulfillment-address'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('setting_value')
        .eq('setting_key', 'fulfillment_address')
        .maybeSingle();
      return data?.setting_value as any;
    },
  });

  const handleSyncTracking = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stallion-tracking');
      
      if (error) throw error;
      
      toast.success(`Tracking synced! Updated ${data.updated} orders.`);
      queryClient.invalidateQueries({ queryKey: ['stallion-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-stallion-shipments'] });
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(error.message || 'Failed to sync tracking');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGetRates = async () => {
    if (!fulfillmentAddress || !postalCode) {
      toast.error('Enter postal code and configure fulfillment address first');
      return;
    }

    try {
      const ratesData = await getRates({
        from: fulfillmentAddress,
        to: {
          name: 'Test Customer',
          street1: '123 Test St',
          city: 'Toronto',
          province: 'ON',
          postal_code: postalCode.replace(/\s/g, '').toUpperCase(),
          country: 'CA',
        },
        packages: [{
          weight: parseFloat(weight) * 0.453592, // lbs to kg
          length: 30,
          width: 20,
          height: 15,
          units: 'metric'
        }]
      });

      setRates(ratesData.rates || []);
      toast.success(`Found ${ratesData.rates?.length || 0} rates`);
    } catch (error) {
      console.error('Rate error:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stallion Express</h1>
          <p className="text-muted-foreground">Shipping fulfillment & tracking management</p>
        </div>
        <Button onClick={handleSyncTracking} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync Tracking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              via Stallion Express
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.fulfilled || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Delivered & shipped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unfulfilled || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active shipments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Shipments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Latest orders fulfilled via Stallion</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentShipments || recentShipments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No shipments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentShipments.map((shipment) => (
                  <div key={`${shipment.source}-${shipment.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">#{shipment.order_number}</p>
                        <Badge variant="outline" className="text-xs">
                          {shipment.source === 'stripe' ? 'Stripe' : 'WooCommerce'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{shipment.customer}</p>
                      {shipment.tracking && (
                        <p className="text-xs text-muted-foreground font-mono">{shipment.tracking}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={shipment.status === 'fulfilled' ? 'default' : 'secondary'}>
                        {shipment.status}
                      </Badge>
                      {shipment.date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(shipment.date), 'MMM d')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rate Tester */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Rate Tester</CardTitle>
            <CardDescription>Test shipping rates to any postal code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!fulfillmentAddress ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-muted-foreground mb-4">
                  Configure fulfillment address first
                </p>
                <Button variant="outline" asChild>
                  <Link to="/admin/settings">Go to Settings</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Destination Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="M5V3A8"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <Button onClick={handleGetRates} disabled={ratesLoading} className="w-full">
                  {ratesLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                  Get Rates
                </Button>

                {rates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Available Rates:</p>
                    {rates.slice(0, 3).map((rate, i) => (
                      <div key={i} className="flex justify-between p-2 border rounded text-sm">
                        <span>{rate.carrier} - {rate.service}</span>
                        <span className="font-medium">${parseFloat(rate.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fulfillment Address */}
      {fulfillmentAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fulfillment Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-medium">{fulfillmentAddress.name}</p>
              {fulfillmentAddress.company && <p>{fulfillmentAddress.company}</p>}
              <p>{fulfillmentAddress.street1}</p>
              {fulfillmentAddress.street2 && <p>{fulfillmentAddress.street2}</p>}
              <p>
                {fulfillmentAddress.city}, {fulfillmentAddress.province} {fulfillmentAddress.postal_code}
              </p>
              <p>{fulfillmentAddress.country}</p>
              <p className="text-muted-foreground">{fulfillmentAddress.phone}</p>
              <p className="text-muted-foreground">{fulfillmentAddress.email}</p>
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/admin/settings">Update Address</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
