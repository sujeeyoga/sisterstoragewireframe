import { useParams, useNavigate } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, MapPin, Truck, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CustomerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <BaseLayout variant="standard" pageId="customer-order-detail">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink" />
        </div>
      </BaseLayout>
    );
  }

  if (!order) {
    return (
      <BaseLayout variant="standard" pageId="customer-order-detail">
        <div className="container max-w-4xl py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => navigate('/customer/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </BaseLayout>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = (order.shipping_address as any) || {};

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <BaseLayout variant="standard" pageId="customer-order-detail">
      <div className="container max-w-4xl py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Order Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`flex-1 ${order.status !== 'pending' ? 'text-brand-pink' : 'text-muted-foreground'}`}>
                <div className="w-full h-2 bg-current rounded-full opacity-20" />
                <p className="text-sm mt-2 font-medium">Order Placed</p>
              </div>
              <div className={`flex-1 ${order.fulfillment_status === 'fulfilled' ? 'text-brand-pink' : 'text-muted-foreground'}`}>
                <div className="w-full h-2 bg-current rounded-full opacity-20" />
                <p className="text-sm mt-2 font-medium">Shipped</p>
              </div>
              <div className={`flex-1 ${order.status === 'completed' ? 'text-brand-pink' : 'text-muted-foreground'}`}>
                <div className="w-full h-2 bg-current rounded-full opacity-20" />
                <p className="text-sm mt-2 font-medium">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-medium">{shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground">{shippingAddress.address}</p>
              <p className="text-sm text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
              </p>
              <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.tracking_number && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Carrier</p>
                  <p className="font-medium">{order.carrier_name || 'Standard Shipping'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <Button variant="link" className="h-auto p-0 text-brand-pink" asChild>
                    <a 
                      href={`https://www.google.com/search?q=${order.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.tracking_number}
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${(order.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${(order.tax || 0).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Need help with your order?{' '}
              <Button variant="link" className="p-0 h-auto text-brand-pink" asChild>
                <a href="mailto:hello@sisterstoragebyhamna.com">Contact Support</a>
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default CustomerOrderDetail;
