import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

      const phone = user.user_metadata?.phone || user.phone;
      const email = user.email;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_phone.eq.${phone},customer_email.eq.${email}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
