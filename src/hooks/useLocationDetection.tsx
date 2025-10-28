import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  isGTA: boolean;
  isLoading: boolean;
}

/**
 * Hook to detect if user is in Toronto/GTA area
 * Uses visitor analytics session data to determine location
 */
export const useLocationDetection = (): LocationData => {
  const [location, setLocation] = useState<LocationData>({
    isGTA: false,
    isLoading: true,
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Get the current session ID from localStorage (same as visitor tracking)
        const sessionKey = Object.keys(localStorage).find(key => key.startsWith('visitor_session_'));
        if (!sessionKey) {
          setLocation({ isGTA: false, isLoading: false });
          return;
        }

        const sessionData = JSON.parse(localStorage.getItem(sessionKey) || '{}');
        const sessionId = sessionData.sessionId;

        if (!sessionId) {
          setLocation({ isGTA: false, isLoading: false });
          return;
        }

        // Query visitor analytics for location data
        const { data, error } = await supabase
          .from('visitor_analytics')
          .select('city, region, country')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Location detection error:', error);
          setLocation({ isGTA: false, isLoading: false });
          return;
        }

        if (data) {
          // Check if user is in GTA
          const isGTA = checkIsGTA(data.city, data.region);
          
          setLocation({
            city: data.city || undefined,
            region: data.region || undefined,
            country: data.country || undefined,
            isGTA,
            isLoading: false,
          });
        } else {
          setLocation({ isGTA: false, isLoading: false });
        }
      } catch (error) {
        console.error('Location detection error:', error);
        setLocation({ isGTA: false, isLoading: false });
      }
    };

    detectLocation();
  }, []);

  return location;
};

/**
 * Check if the city/region is in Greater Toronto Area
 */
const checkIsGTA = (city?: string, region?: string): boolean => {
  if (!city || !region) return false;

  const cityLower = city.toLowerCase();
  const regionLower = region.toLowerCase();

  // Must be in Ontario
  if (!regionLower.includes('ontario')) return false;

  // GTA cities and regions
  const gtaCities = [
    'toronto',
    'mississauga',
    'brampton',
    'markham',
    'vaughan',
    'richmond hill',
    'oakville',
    'burlington',
    'pickering',
    'ajax',
    'whitby',
    'oshawa',
    'milton',
    'newmarket',
    'aurora',
    'georgina',
    'whitchurch-stouffville',
    'king',
    'caledon',
    'halton hills',
    'clarington',
    'uxbridge',
    'scugog',
    'brock',
    'etobicoke',
    'north york',
    'scarborough',
    'east york',
    'york',
  ];

  return gtaCities.some(gtaCity => cityLower.includes(gtaCity));
};
