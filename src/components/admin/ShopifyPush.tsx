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

// shopify-import lives in the Lovable Cloud project, not the legacy one
const CLOUD_FN_URL = 'https://zkmxforzmhpzftbvnixi.supabase.co/functions/v1/shopify-import';
const CLOUD_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXhmb3J6bWhwemZ0YnZuaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDA4OTAsImV4cCI6MjA5NDA3Njg5MH0.RUmXUYhyA5FXspWI7XDX82LLcVdpFFzQxpVB4wqLO9A';

async function callShopifyImport(body: any) {
  const res = await fetch(CLOUD_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': CLOUD_ANON,
      'Authorization': `Bearer ${CLOUD_ANON}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Edge function ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

export const ShopifyPush = () => {
  const { toast } = useToast();
  const [busy, setBusy] = useState<PushType | null>(null);
  const [limit, setLimit] = useState(25);
  const [onlyPaid, setOnlyPaid] = useState(true);
  const [orderResult, setOrderResult] = useState<Result>(null);
  const [customerResult, setCustomerResult] = useState<Result>(null);
  const [progress, setProgress] = useState<string>('');
  const [stopFlag, setStopFlag] = useState(false);

  const runPushAll = async (type: PushType) => {
    setBusy(type);
    setStopFlag(false);
    setProgress('Starting…');
    const totals = { created: 0, skipped: 0, errors: [] as any[] };
    const PAGE = 25;
    let from = 0;
    try {
      while (true) {
        if (stopFlag) { setProgress('Stopped by user.'); break; }
        let q = supabase.from(type === 'order' ? 'orders' : ('customers' as any))
          .select('*')
          .order('created_at', { ascending: true })
          .range(from, from + PAGE - 1);
        if (type === 'order' && onlyPaid) {
          q = (q as any).in('status', ['completed', 'processing', 'paid']);
        }
        const { data, error } = await q;
        if (error) throw error;
        const items = data || [];
        if (items.length === 0) { setProgress(`Done. Total created ${totals.created}, skipped ${totals.skipped}, errors ${totals.errors.length}`); break; }

        setProgress(`Pushing ${type}s ${from + 1}–${from + items.length}…`);
        const result = await callShopifyImport({ type, items });
        totals.created += result.created || 0;
        totals.skipped += result.skipped || 0;
        if (result.errors?.length) totals.errors.push(...result.errors);

        if (type === 'order') setOrderResult({ ...totals });
        else setCustomerResult({ ...totals });

        if (items.length < PAGE) { setProgress(`Done. Total created ${totals.created}, skipped ${totals.skipped}, errors ${totals.errors.length}`); break; }
        from += PAGE;
      }
      toast({ title: 'Push all complete', description: `Created ${totals.created}, skipped ${totals.skipped}, errors ${totals.errors.length}` });
    } catch (e: any) {
      toast({ title: 'Push failed', description: e?.message ?? String(e), variant: 'destructive' });
      setProgress(`Error: ${e?.message ?? String(e)}`);
    } finally {
      setBusy(null);
    }
  };

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
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => runPush('order')} disabled={busy !== null} size="lg">
                {busy === 'order' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Pushing…</>) : (<>Push {limit} orders</>)}
              </Button>
              <Button onClick={() => runPushAll('order')} disabled={busy !== null} size="lg">
                {busy === 'order' ? 'Working…' : 'Push ALL orders'}
              </Button>
              {busy === 'order' && (
                <Button onClick={() => setStopFlag(true)} size="lg" variant="destructive">Stop</Button>
              )}
            </div>
            {busy === 'order' && progress && (
              <p className="text-xs text-muted-foreground">{progress}</p>
            )}
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
