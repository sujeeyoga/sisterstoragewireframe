import { useEffect, useState } from 'react';
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
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      channel.unsubscribe();
    };
  }, [trackVisitor]);

  return { visitorCount, visitors };
};

// Generate or retrieve visitor ID from sessionStorage
function generateVisitorId(): string {
  let visitorId = sessionStorage.getItem('visitor_id');
  
  if (!visitorId) {
    visitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('visitor_id', visitorId);
  }
  
  return visitorId;
}
