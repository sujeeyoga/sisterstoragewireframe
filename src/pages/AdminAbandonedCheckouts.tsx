import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Package,
  Download,
  X,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subDays } from 'date-fns';
import { format } from 'date-fns';
import { useAbandonedCartAnalytics } from '@/hooks/useAbandonedCartAnalytics';
import { useAbandonedCartsList } from '@/hooks/useAbandonedCartsList';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminAbandonedCheckouts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [recoveryStatus, setRecoveryStatus] = useState<'all' | 'pending' | 'recovered'>('all');
  const [reminderSent, setReminderSent] = useState<'all' | 'sent' | 'not_sent'>('all');
  const [closedStatus, setClosedStatus] = useState<'all' | 'open' | 'closed'>('open');
  const [selectedCart, setSelectedCart] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [selectedCartIds, setSelectedCartIds] = useState<Set<string>>(new Set());
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  const dateRangeValues = useMemo(() => {
    const end = new Date();
    const start = subDays(end, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);
    return { start, end };
  }, [dateRange]);

  const { data: analytics, isLoading: isLoadingAnalytics } = useAbandonedCartAnalytics(dateRangeValues);
  const { data: carts, isLoading: isLoadingCarts, refetch: refetchCarts } = useAbandonedCartsList({
    dateRange: dateRangeValues,
    recoveryStatus,
    reminderSent,
    closedStatus,
  });

  const handleSendReminder = async (cartId: string, email: string) => {
    setIsSendingReminder(true);
    try {
      const cart = carts?.find(c => c.id === cartId);
      if (!cart) return;

      const { error } = await supabase.functions.invoke('send-abandoned-cart-email', {
        body: {
          email: cart.email,
          cartItems: cart.cart_items,
          subtotal: cart.subtotal,
          sessionId: cart.session_id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Reminder Sent',
        description: `Recovery email sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Failed to send reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reminder email',
        variant: 'destructive',
      });
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleCloseCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('abandoned_carts')
        .update({ closed_at: new Date().toISOString() })
        .eq('id', cartId);

      if (error) throw error;

      toast({
        title: 'Cart Closed',
        description: 'Abandoned cart has been dismissed',
      });

      setIsDrawerOpen(false);
      refetchCarts();
    } catch (error: any) {
      console.error('Failed to close cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to close cart',
        variant: 'destructive',
      });
    }
  };

  const handleBulkClose = async () => {
    if (selectedCartIds.size === 0) return;
    
    setIsPerformingBulkAction(true);
    try {
      const { error } = await supabase
        .from('abandoned_carts')
        .update({ closed_at: new Date().toISOString() })
        .in('id', Array.from(selectedCartIds));

      if (error) throw error;

      toast({
        title: 'Carts Closed',
        description: `${selectedCartIds.size} cart(s) closed successfully`,
      });

      setSelectedCartIds(new Set());
      refetchCarts();
    } catch (error: any) {
      console.error('Failed to close carts:', error);
      toast({
        title: 'Error',
        description: 'Failed to close selected carts',
        variant: 'destructive',
      });
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  const handleBulkSendReminders = async () => {
    if (selectedCartIds.size === 0) return;
    
    setIsPerformingBulkAction(true);
    try {
      const selectedCarts = carts?.filter(c => selectedCartIds.has(c.id)) || [];
      let successCount = 0;

      for (const cart of selectedCarts) {
        const { error } = await supabase.functions.invoke('send-abandoned-cart-email', {
          body: {
            email: cart.email,
            cartItems: cart.cart_items,
            subtotal: cart.subtotal,
            sessionId: cart.session_id,
          },
        });

        if (!error) successCount++;
      }

      toast({
        title: 'Reminders Sent',
        description: `${successCount} of ${selectedCartIds.size} reminder(s) sent successfully`,
      });

      setSelectedCartIds(new Set());
      refetchCarts();
    } catch (error: any) {
      console.error('Failed to send bulk reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reminders',
        variant: 'destructive',
      });
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  const handleExportCSV = () => {
    if (!carts || carts.length === 0) {
      toast({
        title: 'No Data',
        description: 'No carts to export',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['Email', 'Cart Value', 'Items', 'Abandoned Date', 'Reminder Sent', 'Status'];
    const rows = carts.map(cart => [
      cart.email,
      Number(cart.subtotal).toFixed(2),
      Array.isArray(cart.cart_items) ? cart.cart_items.length : 0,
      format(new Date(cart.created_at), 'yyyy-MM-dd HH:mm'),
      cart.reminder_sent_at ? format(new Date(cart.reminder_sent_at), 'yyyy-MM-dd HH:mm') : 'Not sent',
      cart.closed_at ? 'Closed' : cart.recovered_at ? 'Recovered' : 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned-carts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: `${carts.length} cart(s) exported to CSV`,
    });
  };

  const handleQuickFilter = (filter: 'today' | 'high-value' | 'no-reminder' | 'clear') => {
    switch (filter) {
      case 'today':
        setDateRange('7d');
        setRecoveryStatus('pending');
        setClosedStatus('open');
        break;
      case 'high-value':
        setRecoveryStatus('pending');
        setClosedStatus('open');
        break;
      case 'no-reminder':
        setReminderSent('not_sent');
        setRecoveryStatus('pending');
        setClosedStatus('open');
        break;
      case 'clear':
        setDateRange('30d');
        setRecoveryStatus('all');
        setReminderSent('all');
        setClosedStatus('open');
        break;
    }
  };

  const toggleCartSelection = (cartId: string) => {
    const newSelection = new Set(selectedCartIds);
    if (newSelection.has(cartId)) {
      newSelection.delete(cartId);
    } else {
      newSelection.add(cartId);
    }
    setSelectedCartIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCartIds.size === carts?.length) {
      setSelectedCartIds(new Set());
    } else {
      setSelectedCartIds(new Set(carts?.map(c => c.id) || []));
    }
  };

  const highValueCarts = useMemo(() => {
    return carts?.filter(cart => Number(cart.subtotal) >= 50) || [];
  }, [carts]);

  const openCartDetails = (cart: any) => {
    setSelectedCart(cart);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/analytics')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analytics
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Abandoned Checkouts</h1>
          <p className="text-muted-foreground">
            Track and recover abandoned shopping carts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCarts()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('today')}
          className="gap-2"
        >
          Today's Abandonments
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('high-value')}
          className="gap-2"
        >
          High Value (${highValueCarts.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter('no-reminder')}
          className="gap-2"
        >
          No Reminder Sent
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickFilter('clear')}
          className="gap-2"
        >
          <X className="h-3 w-3" />
          Clear Filters
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abandoned</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics?.totalAbandoned || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${(analytics?.totalValue || 0).toFixed(2)} total value
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${(analytics?.pendingValue || 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Potential recovery revenue
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{(analytics?.recoveryRate || 0).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.recoveredCount || 0} recovered
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics?.remindersSent || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Email reminders sent
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Recovery Status</label>
            <Select value={recoveryStatus} onValueChange={(value: any) => setRecoveryStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="recovered">Recovered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Reminder Status</label>
            <Select value={reminderSent} onValueChange={(value: any) => setReminderSent(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="not_sent">Not Sent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Cart Status</label>
            <Select value={closedStatus} onValueChange={(value: any) => setClosedStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Bar */}
      {selectedCartIds.size > 0 && (
        <Card className="border-primary">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">{selectedCartIds.size} cart(s) selected</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkSendReminders}
                  disabled={isPerformingBulkAction}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkClose}
                  disabled={isPerformingBulkAction}
                >
                  Close Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCartIds(new Set())}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abandoned Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Carts</CardTitle>
          <CardDescription>
            Select carts for bulk actions or click a row to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCarts ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedCartIds.size === carts?.length && carts?.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cart Value</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Abandoned</TableHead>
                  <TableHead>Reminder</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No abandoned carts found for the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  carts?.map((cart) => (
                    <TableRow 
                      key={cart.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openCartDetails(cart)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedCartIds.has(cart.id)}
                          onChange={() => toggleCartSelection(cart.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{cart.email}</TableCell>
                      <TableCell>${Number(cart.subtotal).toFixed(2)}</TableCell>
                      <TableCell>{Array.isArray(cart.cart_items) ? cart.cart_items.length : 0}</TableCell>
                      <TableCell>{format(new Date(cart.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {cart.reminder_sent_at ? (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(cart.reminder_sent_at), 'MMM d')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not sent</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cart.closed_at ? (
                          <Badge variant="outline">Closed</Badge>
                        ) : cart.recovered_at ? (
                          <Badge variant="default" className="bg-green-500">Recovered</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(cart.id, cart.email)}
                          disabled={isSendingReminder}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {cart.reminder_sent_at ? 'Resend' : 'Send'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cart Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Cart Details</SheetTitle>
            <SheetDescription>
              {selectedCart?.email}
            </SheetDescription>
          </SheetHeader>
          
          {selectedCart && (
            <div className="mt-6 space-y-6">
              {/* Cart Items */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Cart Items ({Array.isArray(selectedCart.cart_items) ? selectedCart.cart_items.length : 0})
                </h3>
                <div className="space-y-3">
                  {Array.isArray(selectedCart.cart_items) && selectedCart.cart_items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal */}
              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${Number(selectedCart.subtotal).toFixed(2)}</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cart Created</span>
                    <span>{format(new Date(selectedCart.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  {selectedCart.reminder_sent_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reminder Sent</span>
                      <span>{format(new Date(selectedCart.reminder_sent_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  )}
                  {selectedCart.recovered_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recovered</span>
                      <span>{format(new Date(selectedCart.recovered_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  )}
                  {selectedCart.closed_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Closed</span>
                      <span>{format(new Date(selectedCart.closed_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!selectedCart.closed_at && !selectedCart.recovered_at && (
                  <>
                    <Button 
                      className="w-full" 
                      onClick={() => handleSendReminder(selectedCart.id, selectedCart.email)}
                      disabled={isSendingReminder}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedCart.reminder_sent_at ? 'Resend' : 'Send'} Recovery Email
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleCloseCart(selectedCart.id)}
                    >
                      Close Cart
                    </Button>
                  </>
                )}
                {selectedCart.closed_at && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    This cart has been closed
                  </p>
                )}
                {selectedCart.recovered_at && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    This cart was recovered through checkout
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminAbandonedCheckouts;
