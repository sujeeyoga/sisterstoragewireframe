import { useState } from 'react';
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
  Package
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
  const [selectedCart, setSelectedCart] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const getDateRange = () => {
    const end = new Date();
    const start = subDays(end, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);
    return { start, end };
  };

  const { data: analytics, isLoading: isLoadingAnalytics } = useAbandonedCartAnalytics(getDateRange());
  const { data: carts, isLoading: isLoadingCarts } = useAbandonedCartsList({
    dateRange: getDateRange(),
    recoveryStatus,
    reminderSent,
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
        </CardContent>
      </Card>

      {/* Abandoned Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Carts</CardTitle>
          <CardDescription>
            Click on a row to view cart details and take action
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
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                        {cart.recovered_at ? (
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
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleSendReminder(selectedCart.id, selectedCart.email)}
                  disabled={isSendingReminder}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {selectedCart.reminder_sent_at ? 'Resend' : 'Send'} Recovery Email
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminAbandonedCheckouts;
