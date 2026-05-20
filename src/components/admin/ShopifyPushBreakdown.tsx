import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, ArrowLeft, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CLOUD_FN_URL = 'https://zkmxforzmhpzftbvnixi.supabase.co/functions/v1/shopify-import';
const CLOUD_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXhmb3J6bWhwemZ0YnZuaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDA4OTAsImV4cCI6MjA5NDA3Njg5MH0.RUmXUYhyA5FXspWI7XDX82LLcVdpFFzQxpVB4wqLO9A';

type OrderRow = {
  id: string;
  order_number?: string | number | null;
  customer_email?: string | null;
  customer_name?: string | null;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
  shopify_order_id?: string | null;
  shopify_synced_at?: string | null;
  shopify_sync_error?: string | null;
};

type SyncState = 'synced' | 'error' | 'pending';

const getSyncState = (o: OrderRow): SyncState => {
  if (o.shopify_order_id) return 'synced';
  if (o.shopify_sync_error) return 'error';
  return 'pending';
};

const StateBadge = ({ state }: { state: SyncState }) => {
  if (state === 'synced') return <Badge className="bg-green-600 hover:bg-green-600 gap-1"><CheckCircle2 className="w-3 h-3" />Synced</Badge>;
  if (state === 'error') return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Error</Badge>;
  return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
};

export const ShopifyPushBreakdown = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | SyncState>('all');
  const [pushingId, setPushingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      setRows((data || []) as OrderRow[]);
    } catch (e: any) {
      toast({ title: 'Failed to load orders', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const s = { synced: 0, error: 0, pending: 0, total: rows.length };
    rows.forEach(r => { s[getSyncState(r)]++; });
    return s;
  }, [rows]);

  const visible = useMemo(() => {
    const term = search.toLowerCase().trim();
    return rows.filter(r => {
      if (filter !== 'all' && getSyncState(r) !== filter) return false;
      if (!term) return true;
      return (
        String(r.order_number ?? '').toLowerCase().includes(term) ||
        (r.customer_email ?? '').toLowerCase().includes(term) ||
        (r.customer_name ?? '').toLowerCase().includes(term) ||
        (r.id ?? '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, filter]);

  const pushOne = async (order: OrderRow) => {
    setPushingId(order.id);
    try {
      const res = await fetch(CLOUD_FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: CLOUD_ANON, Authorization: `Bearer ${CLOUD_ANON}` },
        body: JSON.stringify({ type: 'order', items: [order] }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`${res.status}: ${text.slice(0, 200)}`);
      const result = JSON.parse(text);
      toast({
        title: result.created ? 'Pushed' : result.skipped ? 'Skipped' : 'No-op',
        description: result.errors?.length ? JSON.stringify(result.errors[0]).slice(0, 200) : `Created ${result.created}, skipped ${result.skipped}`,
        variant: result.errors?.length ? 'destructive' : 'default',
      });
      await load();
    } catch (e: any) {
      toast({ title: 'Push failed', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setPushingId(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/shopify-push" className="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Push to Shopify
          </Link>
          <h1 className="text-3xl font-bold">Shopify Push Breakdown</h1>
          <p className="text-muted-foreground">Per-order sync status. Most recent 500 orders.</p>
        </div>
        <Button onClick={load} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.total}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Synced</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-600">{stats.synced}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Errors</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-destructive">{stats.error}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.pending}</CardContent></Card>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by order #, email, name…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        {(['all', 'synced', 'error', 'pending'] as const).map(f => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
        ))}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sync</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground"><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Loading…</TableCell></TableRow>
            ) : visible.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders match.</TableCell></TableRow>
            ) : visible.map(o => {
              const state = getSyncState(o);
              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="font-medium">#{o.order_number ?? o.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{o.customer_name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email ?? ''}</div>
                  </TableCell>
                  <TableCell>${Number(o.total ?? 0).toFixed(2)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{o.status ?? '—'}</Badge></TableCell>
                  <TableCell><StateBadge state={state} /></TableCell>
                  <TableCell className="max-w-[280px]">
                    {state === 'synced' && (
                      <div className="text-xs text-muted-foreground truncate">
                        ID {o.shopify_order_id}
                        {o.shopify_synced_at && <> · {new Date(o.shopify_synced_at).toLocaleDateString()}</>}
                      </div>
                    )}
                    {state === 'error' && (
                      <div className="text-xs text-destructive truncate" title={o.shopify_sync_error ?? ''}>{o.shopify_sync_error}</div>
                    )}
                    {state === 'pending' && <span className="text-xs text-muted-foreground">Not pushed yet</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" disabled={pushingId === o.id} onClick={() => pushOne(o)}>
                      {pushingId === o.id ? <Loader2 className="w-3 h-3 animate-spin" /> : state === 'synced' ? 'Re-push' : 'Push'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShopifyPushBreakdown;
