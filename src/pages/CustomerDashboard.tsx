import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerAuth, useCustomerOrders } from '@/hooks/useCustomerAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Search, LogOut, Package, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { user, signOut } = useCustomerAuth();
  const { data: orders = [], isLoading } = useCustomerOrders();

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    navigate('/customer/login');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getFulfillmentBadge = (status: string) => {
    const variants: Record<string, string> = {
      unfulfilled: 'bg-gray-100 text-gray-800',
      fulfilled: 'bg-green-100 text-green-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <BaseLayout variant="standard" pageId="customer-dashboard">
      <div className="container max-w-6xl py-12 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-pink" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : "You haven't placed any orders yet"}
              </p>
              <Button onClick={() => navigate('/shop')} className="bg-brand-pink hover:bg-brand-pink/90">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/customer/orders/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(order.items) ? order.items.length : 0} item(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getFulfillmentBadge(order.fulfillment_status)}>
                      {order.fulfillment_status === 'fulfilled' ? 'Shipped' : 'Processing'}
                    </Badge>
                  </div>

                  {order.tracking_number && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Tracking: {order.tracking_number}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default CustomerDashboard;
