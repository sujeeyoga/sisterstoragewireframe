import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ComingSoon from "@/pages/ComingSoon";
import { useQuery } from "@tanstack/react-query";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if Coming Soon is enabled
  const { data: comingSoonSetting, isLoading: isLoadingSetting } = useQuery({
    queryKey: ['store-settings', 'coming-soon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'coming_soon')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
      return data;
    },
  });

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state - show content immediately, auth check happens in background
  if (isAuthenticated === null || isLoadingSetting) {
    // Optimistically show content while checking auth
    return <>{children}</>;
  }

  // Show coming soon if enabled and not authenticated
  const comingSoonEnabled = comingSoonSetting?.enabled || false;
  if (comingSoonEnabled && !isAuthenticated) {
    return <ComingSoon />;
  }

  // Show actual content
  return <>{children}</>;
};
