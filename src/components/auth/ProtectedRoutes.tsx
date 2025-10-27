import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ComingSoon from "@/pages/ComingSoon";
import { useQuery } from "@tanstack/react-query";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if Coming Soon is enabled
  const { data: comingSoonSetting, isLoading: isLoadingSetting } = useQuery({
    queryKey: ['store-settings', 'coming-soon'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('setting_key', 'coming_soon')
          .maybeSingle();

        // Ignore all errors and return null - show content by default
        if (error) {
          console.warn('Failed to load coming soon setting:', error);
          return null;
        }
        return data;
      } catch (err) {
        console.warn('Failed to load coming soon setting:', err);
        return null;
      }
    },
    retry: false, // Don't retry failed requests
    staleTime: 60000, // Cache for 1 minute
  });

  useEffect(() => {
    // Check current session and password reset requirement
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session?.user) {
        const requiresReset = session.user.user_metadata?.requires_password_reset;
        if (requiresReset && location.pathname !== '/password-reset') {
          navigate('/password-reset');
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);

      if (session?.user) {
        const requiresReset = session.user.user_metadata?.requires_password_reset;
        if (requiresReset && location.pathname !== '/password-reset') {
          setTimeout(() => {
            navigate('/password-reset');
          }, 0);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

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
