import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorPresence {
  [key: string]: Array<{
    user_id: string;
    online_at: string;
    page: string;
  }>;
}

export const useVisitorPresence = (trackVisitor: boolean = false) => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [visitors, setVisitors] = useState<VisitorPresence>({});
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track visitor in database
  const trackVisitorInDB = async (pagePath: string) => {
    if (!trackVisitor) return;

    const visitorId = generateVisitorId();
    const sessionId = getSessionId();

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

  useEffect(() => {
    const channel = supabase.channel('site-visitors');

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
        if (status === 'SUBSCRIBED' && trackVisitor) {
          // Track current visitor
          const visitorId = generateVisitorId();
          await channel.track({
            user_id: visitorId,
            online_at: new Date().toISOString(),
            page: window.location.pathname,
          });
        }
      });

    // Update page when route changes
    const handleRouteChange = () => {
      if (trackVisitor) {
        const visitorId = generateVisitorId();
        channel.track({
          user_id: visitorId,
          online_at: new Date().toISOString(),
          page: window.location.pathname,
        });
        
        // Track in database
        trackVisitorInDB(window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    // Track initial page view
    if (trackVisitor) {
      trackVisitorInDB(window.location.pathname);
      
      // Set up heartbeat to update session duration
      heartbeatIntervalRef.current = setInterval(() => {
        trackVisitorInDB(window.location.pathname);
      }, 30000); // Update every 30 seconds
    }

    // Track when user leaves
    const handleBeforeUnload = () => {
      if (trackVisitor) {
        trackVisitorInDB(window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      channel.unsubscribe();
    };
  }, [trackVisitor]);

  return { visitorCount, visitors };
};

// Generate or retrieve session ID (unique per browser session)
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}

// Generate or retrieve visitor ID from sessionStorage
function generateVisitorId(): string {
  let visitorId = sessionStorage.getItem('visitor_id');
  
  if (!visitorId) {
    visitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('visitor_id', visitorId);
  }
  
  return visitorId;
}
