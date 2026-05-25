import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type NormalizedOrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string | null;
};

export type CustomerOrderRecord = {
  id: string;
  source: 'stripe' | 'woocommerce';
  order_number: string;
  created_at: string;
  status: string;
  fulfillment_status: string | null;
  fulfilled_at: string | null;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  tracking_number: string | null;
  carrier_name: string | null;
  items: NormalizedOrderItem[];
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

const isMissingRelationError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;

  const details = [
    (error as { code?: string }).code,
    (error as { message?: string }).message,
    (error as { details?: string }).details,
    (error as { hint?: string }).hint,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    (error as { code?: string }).code === '42P01' ||
    (error as { code?: string }).code === 'PGRST205' ||
    details.includes('does not exist') ||
    details.includes('could not find the table')
  );
};

const normalizeOrderItem = (item: any): NormalizedOrderItem => {
  const quantity = Number(item?.quantity ?? 1) || 1;
  const rawPrice = Number(item?.price ?? 0);
  const derivedPrice = Number(item?.total ?? 0) / quantity;
  const price = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : Number.isFinite(derivedPrice) ? derivedPrice : 0;

  return {
    name: item?.name ?? item?.title ?? 'Item',
    quantity,
    price,
    image: item?.image?.src ?? item?.image ?? item?.featured_image ?? null,
  };
};

export const normalizeStripeOrder = (order: any): CustomerOrderRecord => ({
  id: String(order.id),
  source: 'stripe',
  order_number: String(order.order_number ?? order.id),
  created_at: order.created_at ?? new Date().toISOString(),
  status: order.status ?? 'pending',
  fulfillment_status: order.fulfillment_status ?? null,
  fulfilled_at: order.fulfilled_at ?? null,
  total: Number(order.total ?? 0) || 0,
  subtotal: Number(order.subtotal ?? 0) || 0,
  shipping: Number(order.shipping ?? 0) || 0,
  tax: Number(order.tax ?? 0) || 0,
  tracking_number: order.tracking_number ?? null,
  carrier_name: order.carrier_name ?? null,
  items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
  shipping_address: {
    name: order?.shipping_address?.name ?? '',
    address: order?.shipping_address?.address ?? '',
    city: order?.shipping_address?.city ?? '',
    state: order?.shipping_address?.state ?? '',
    postal_code: order?.shipping_address?.postal_code ?? '',
    country: order?.shipping_address?.country ?? '',
  },
});

export const normalizeWooOrder = (order: any): CustomerOrderRecord => {
  const shipping = order?.shipping ?? {};
  const billing = order?.billing ?? {};
  const total = Number(order.total ?? 0) || 0;
  const shippingTotal = Number(order.shipping_total ?? 0) || 0;
  const taxTotal = Number(order.total_tax ?? 0) || 0;
  const subtotal = Number(order.subtotal ?? total - shippingTotal - taxTotal) || 0;

  return {
    id: String(order.id),
    source: 'woocommerce',
    order_number: String(order.number ?? order.order_number ?? order.id),
    created_at: order.date_created ?? order.created_at ?? new Date().toISOString(),
    status: order.status ?? 'processing',
    fulfillment_status: order.fulfillment_status ?? (order.status === 'completed' ? 'fulfilled' : null),
    fulfilled_at: order.date_completed ?? order.fulfilled_at ?? null,
    total,
    subtotal,
    shipping: shippingTotal,
    tax: taxTotal,
    tracking_number: order.tracking_number ?? null,
    carrier_name: order.carrier_name ?? null,
    items: Array.isArray(order.line_items) ? order.line_items.map(normalizeOrderItem) : [],
    shipping_address: {
      name: [shipping.first_name, shipping.last_name].filter(Boolean).join(' ') || [billing.first_name, billing.last_name].filter(Boolean).join(' '),
      address: shipping.address_1 ?? shipping.address ?? '',
      city: shipping.city ?? '',
      state: shipping.state ?? '',
      postal_code: shipping.postcode ?? shipping.postal_code ?? '',
      country: shipping.country ?? '',
    },
  };
};

export const useCustomerAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/customer/dashboard`,
        },
      });
      
      if (error) throw error;
      return email;
    },
    onSuccess: () => {
      toast.success('Check your email for the login link!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send login link');
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Signed out successfully');
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sign out');
    },
  });

  return {
    user,
    loading,
    signInWithEmail,
    signOut,
  };
};

export const useCustomerOrders = () => {
  const { user } = useCustomerAuth();

  return useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const [wooResult, stripeResult] = await Promise.all([
        supabase
          .from('woocommerce_orders')
          .select('*')
          .order('date_created', { ascending: false }),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      const blockingError = [wooResult.error, stripeResult.error].find(
        (error) => error && !isMissingRelationError(error)
      );

      if (blockingError) throw blockingError;

      const orders = [
        ...((wooResult.data ?? []).map(normalizeWooOrder)),
        ...((stripeResult.data ?? []).map(normalizeStripeOrder)),
      ];

      return orders.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!user,
  });
};
