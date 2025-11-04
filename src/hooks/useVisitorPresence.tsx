import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionManagement } from './useSessionManagement';

interface VisitorPresence {
  [key: string]: Array<{
    user_id: string;
    online_at: string;
    page: string;
  }>;
}

interface VisitorCountry {
  visitor_id: string;
  country: string;
}

interface TariffRate {
  country_code: string;
  country_name: string;
  tariff_percentage: number;
  customs_fee: number;
  broker_fee: number;
}

export const useVisitorPresence = (trackVisitor: boolean = false) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [visitors, setVisitors] = useState<VisitorPresence>({});
  const [visitorCountries, setVisitorCountries] = useState<VisitorCountry[]>([]);
  const [tariffRates, setTariffRates] = useState<{ [key: string]: TariffRate }>({});
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { sessionId, visitorId, hasInitialized } = useSessionManagement();

  // Track visitor in database
  const trackVisitorInDB = async (pagePath: string) => {
    if (!trackVisitor || !hasInitialized || !sessionId || !visitorId) return;

    try {
      const response = await supabase.functions.invoke('track-visitor', {
        body: {
          session_id: sessionId,
          visitor_id: visitorId,
          page_path: pagePath,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
        },
      });

      if (response.error) {
        console.error('Error tracking visitor:', response.error);
      }
    } catch (error) {
      console.error('Error invoking track-visitor:', error);
    }
  };

  // Fetch visitor countries from analytics
  useEffect(() => {
    const fetchVisitorCountries = async () => {
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('visitor_id, country')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('created_at', { ascending: false });

      if (data && !error) {
        // Get unique visitor countries
        const uniqueCountries = data.reduce((acc: VisitorCountry[], curr) => {
          if (!acc.find(v => v.visitor_id === curr.visitor_id)) {
            acc.push({ visitor_id: curr.visitor_id, country: curr.country || 'Unknown' });
          }
          return acc;
        }, []);
        setVisitorCountries(uniqueCountries);
      }
    };

    const fetchTariffRates = async () => {
      const { data, error } = await supabase
        .from('tariff_rates')
        .select('*');

      if (data && !error) {
        const ratesMap = data.reduce((acc: { [key: string]: TariffRate }, rate) => {
          acc[rate.country_code] = rate;
          return acc;
        }, {});
        setTariffRates(ratesMap);
      }
    };

    if (!trackVisitor) {
      // Only fetch countries for admin viewing
      fetchVisitorCountries();
      fetchTariffRates();
      const interval = setInterval(() => {
        fetchVisitorCountries();
        fetchTariffRates();
      }, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [trackVisitor]);

  useEffect(() => {
    if (!trackVisitor || !hasInitialized) return;

    const channel = supabase.channel('visitor-presence');

    // Track presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{
          user_id: string;
          online_at: string;
          page: string;
        }>();
        setVisitors(state);
        
        // Count unique visitors
        const uniqueVisitors = new Set();
        Object.values(state).forEach(presences => {
          presences.forEach(p => uniqueVisitors.add(p.user_id));
        });
        setVisitorCount(uniqueVisitors.size);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Visitor joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Visitor left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && trackVisitor && sessionId) {
          // Track presence with our session ID
          const userId = sessionId;
          
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            page: window.location.pathname,
          });
          
          console.log('[Visitor Presence] Tracking visitor with session:', sessionId);

          // Track initial page visit
          trackVisitorInDB(window.location.pathname);
        }
      });

    const handleRouteChange = async () => {
      if (!sessionId) return;
      
      await channel.track({
        user_id: sessionId,
        online_at: new Date().toISOString(),
        page: window.location.pathname,
      });

      // Track the page change
      trackVisitorInDB(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);

    // Set up heartbeat to update session duration
    heartbeatIntervalRef.current = setInterval(() => {
      trackVisitorInDB(window.location.pathname);
    }, 30000); // Update every 30 seconds

    // Track when user leaves
    const handleBeforeUnload = () => {
      trackVisitorInDB(window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      channel.unsubscribe();
    };
  }, [trackVisitor, hasInitialized, sessionId]);

  return { visitorCount, visitors, visitorCountries, tariffRates };
};
