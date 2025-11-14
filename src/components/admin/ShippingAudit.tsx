import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AuditResult {
  order_number: string;
  customer_name: string;
  city: string;
  province: string;
  country: string;
  subtotal: number;
  shipping: number;
  recalculated_zone?: string;
  recalculated_rate?: number;
  issue?: string;
}

export const ShippingAudit = () => {
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);

  const { data: freeShippingOrders, isLoading } = useQuery({
    queryKey: ['free-shipping-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shipping', 0)
        .gte('subtotal', 50)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  const runAudit = async () => {
    if (!freeShippingOrders || freeShippingOrders.length === 0) {
      toast.error('No orders to audit');
      return;
    }

    setAuditing(true);
    setAuditResults([]);

    try {
      const results: AuditResult[] = [];

      for (const order of freeShippingOrders) {
        const shippingAddress = order.shipping_address as any;
        if (!shippingAddress) continue;

        // Recalculate shipping for this address
        const { data, error } = await supabase.functions.invoke('calculate-shipping-zones', {
          body: {
            address: {
              city: shippingAddress.city,
              province: shippingAddress.province || shippingAddress.state,
              country: shippingAddress.country,
              postalCode: shippingAddress.postalCode || shippingAddress.postal_code,
            },
            subtotal: order.subtotal,
            items: [],
          },
        });

        if (error) {
          console.error('Failed to recalculate for order:', order.order_number, error);
          continue;
        }

        // Check if recalculated zone is NOT the GTA zone
        const isGTAZone = data?.zone?.name?.toLowerCase().includes('gta') || 
                          data?.zone?.name?.toLowerCase().includes('toronto');
        
        if (!isGTAZone && data?.rates?.[0]) {
          const recalculatedRate = data.rates[0].rate_amount;
          
          results.push({
            order_number: order.order_number,
            customer_name: order.customer_name || 'N/A',
            city: shippingAddress.city || 'N/A',
            province: shippingAddress.province || shippingAddress.state || 'N/A',
            country: shippingAddress.country || 'N/A',
            subtotal: order.subtotal,
            shipping: order.shipping,
            recalculated_zone: data.zone?.name,
            recalculated_rate: recalculatedRate,
            issue: recalculatedRate > 0 ? 'Free shipping outside GTA' : undefined,
          });
        }
      }

      setAuditResults(results);
      toast.success(`Audit complete: ${results.length} potential issues found`);
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error('Audit failed');
    } finally {
      setAuditing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Shipping Audit Report
        </CardTitle>
        <CardDescription>
          Review orders with free shipping that may have been incorrectly matched to GTA zone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Loading orders...'
            ) : (
              `${freeShippingOrders?.length || 0} orders with free shipping found`
            )}
          </div>
          <Button onClick={runAudit} disabled={auditing || isLoading}>
            {auditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Audit
          </Button>
        </div>

        {auditResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Potential Issues</h3>
              <Badge variant="destructive">{auditResults.length}</Badge>
            </div>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Order</th>
                    <th className="p-2 text-left font-medium">Location</th>
                    <th className="p-2 text-right font-medium">Subtotal</th>
                    <th className="p-2 text-left font-medium">Recalc Zone</th>
                    <th className="p-2 text-right font-medium">Should Be</th>
                    <th className="p-2 text-left font-medium">Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {auditResults.map((result) => (
                    <tr key={result.order_number} className="border-b last:border-0">
                      <td className="p-2 font-mono">{result.order_number}</td>
                      <td className="p-2">
                        {result.city}, {result.province}
                      </td>
                      <td className="p-2 text-right">${result.subtotal.toFixed(2)}</td>
                      <td className="p-2">{result.recalculated_zone}</td>
                      <td className="p-2 text-right text-destructive">
                        ${result.recalculated_rate?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="p-2">
                        <Badge variant="destructive" className="text-xs">
                          {result.issue}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {auditResults.length === 0 && !auditing && !isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Run audit to check for incorrectly matched zones
          </div>
        )}
      </CardContent>
    </Card>
  );
};
