import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const AdminSync = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: syncLogs, isLoading } = useQuery({
    queryKey: ['sync-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('woocommerce_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      
      const { data, error } = await supabase.functions.invoke('woocommerce-sync', {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Sync Started',
        description: 'WooCommerce products and customers are being synced. Check the logs below for status.',
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
        setIsSyncing(false);
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to sync products',
        variant: 'destructive',
      });
      setIsSyncing(false);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">WooCommerce Sync</h1>
        <p className="text-muted-foreground">
          Sync products and customers from your WooCommerce store
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Product & Customer Sync</CardTitle>
          <CardDescription>
            Sync products, customers, prices, and inventory from your WooCommerce store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={isSyncing}
            size="lg"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Products & Customers'}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            This will fetch all products and customers from WooCommerce and update your database with the latest information including prices, inventory, customer orders, and spending data.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>Recent synchronization operations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading sync history...</div>
          ) : syncLogs && syncLogs.length > 0 ? (
            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {log.sync_type}
                      </span>
                      {log.records_processed && (
                        <span className="text-sm text-muted-foreground">
                          • {log.records_processed} products
                        </span>
                      )}
                    </div>
                    {log.message && (
                      <p className="text-sm mb-1">{log.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No sync history yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Run your first sync to see results here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
