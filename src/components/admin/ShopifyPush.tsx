import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type PushType = 'order' | 'customer';
type Result = { created: number; skipped: number; errors: any[] } | null;

export const ShopifyPush = () => {
  const { toast } = useToast();
  const [busy, setBusy] = useState<PushType | null>(null);
  const [limit, setLimit] = useState(25);
  const [onlyPaid, setOnlyPaid] = useState(true);
  const [orderResult, setOrderResult] = useState<Result>(null);
  const [customerResult, setCustomerResult] = useState<Result>(null);

  const runPush = async (type: PushType) => {
    setBusy(type);
    try {
      let items: any[] = [];

      if (type === 'order') {
        let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
        if (onlyPaid) q = q.in('status', ['completed', 'processing', 'paid']);
        const { data, error } = await q;
        if (error) throw error;
        items = data || [];
      } else {
        const { data, error } = await supabase
          .from('customers' as any)
          .select('*')
          .limit(limit);
        if (error) throw error;
        items = data || [];
      }

      if (items.length === 0) {
        toast({ title: 'Nothing to push', description: `No ${type}s found.` });
        setBusy(null);
        return;
      }

      const { data: result, error: fnError } = await supabase.functions.invoke('shopify-import', {
        body: { type, items },
      });
      if (fnError) throw fnError;

      if (type === 'order') setOrderResult(result);
      else setCustomerResult(result);

      toast({
        title: 'Push complete',
        description: `Created ${result.created}, skipped ${result.skipped}, errors ${result.errors?.length ?? 0}`,
      });
    } catch (e: any) {
      toast({
        title: 'Push failed',
        description: e?.message ?? String(e),
        variant: 'destructive',
      });
    } finally {
      setBusy(null);
    }
  };

  const renderResult = (r: Result) => {
    if (!r) return null;
    return (
      <div className="mt-4 p-4 rounded-lg bg-muted text-sm space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Created: <strong>{r.created}</strong></span>
          <span>· Skipped: <strong>{r.skipped}</strong></span>
          <span>· Errors: <strong>{r.errors?.length ?? 0}</strong></span>
        </div>
        {r.errors && r.errors.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer flex items-center gap-1 text-destructive">
              <AlertCircle className="h-3 w-3" /> View errors
            </summary>
            <pre className="mt-2 p-2 bg-background rounded overflow-auto max-h-64">
              {JSON.stringify(r.errors, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Push to Shopify</h1>
        <p className="text-muted-foreground">
          Send orders and customers from your store directly into Shopify via the Admin API.
          No CSV, no Matrixify required.
        </p>
      </div>

      <div className="mb-6 flex items-end gap-4">
        <div>
          <Label htmlFor="limit">Batch size</Label>
          <Input
            id="limit"
            type="number"
            min={1}
            max={250}
            value={limit}
            onChange={(e) => setLimit(Math.max(1, Math.min(250, Number(e.target.value) || 1)))}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <Checkbox
            id="onlyPaid"
            checked={onlyPaid}
            onCheckedChange={(v) => setOnlyPaid(v === true)}
          />
          <Label htmlFor="onlyPaid" className="cursor-pointer">
            Orders: only paid/processing/completed
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Push Orders
            </CardTitle>
            <CardDescription>
              Sends most-recent orders into Shopify as historical orders (no charge, no email).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => runPush('order')} disabled={busy !== null} size="lg">
              {busy === 'order' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Pushing…</>
              ) : (
                <>Push {limit} orders</>
              )}
            </Button>
            {renderResult(orderResult)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Push Customers
            </CardTitle>
            <CardDescription>
              Sends customers into Shopify. Existing emails are skipped automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => runPush('customer')} disabled={busy !== null} size="lg" variant="secondary">
              {busy === 'customer' ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Pushing…</>
              ) : (
                <>Push {limit} customers</>
              )}
            </Button>
            {renderResult(customerResult)}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        After pushing, verify in Shopify → Orders / Customers. Shopify rate-limits at ~2 req/sec, so large batches take time.
      </p>
    </div>
  );
};

export default ShopifyPush;
