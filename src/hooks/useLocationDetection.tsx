import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { functionsClient } from '@/integrations/supabase/functionsClient';

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  isGTA: boolean;
  isLoading: boolean;
  /** True when the location came from the connection lookup rather than a typed address */
  isEstimated?: boolean;
  shippingZone?: 'toronto-gta' | 'canada-wide' | 'us-standard' | 'us-west-coast' | 'international';
}

const LOCATION_CACHE_KEY = 'user_location_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Detects the shopper's coarse location so the cart can show an estimated
 * shipping rate before an address is entered.
 *
 * Order of preference:
 *  1. Cached result (24h)
 *  2. Visitor analytics row for this session (if present)
 *  3. Connection-based lookup via the `geo-locate` backend function
 */
export const useLocationDetection = (): LocationData => {
  const [location, setLocation] = useState<LocationData>({
    isGTA: false,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const finalize = (
      raw: { city?: string; region?: string; country?: string },
      cache: boolean
    ): boolean => {
      const city = raw.city || undefined;
      const region = raw.region || undefined;
      const country = raw.country || undefined;

      if (!city || !country) return false;

      const isGTA = checkIsGTA(city, region);
      const locationData: LocationData = {
        city,
        region,
        country,
        isGTA,
        isEstimated: true,
        shippingZone: determineShippingZone(country, region, city, isGTA),
      };

      if (cache) {
        try {
          localStorage.setItem(
            LOCATION_CACHE_KEY,
            JSON.stringify({ location: locationData, timestamp: Date.now() })
          );
        } catch (_e) {
          /* storage may be unavailable */
        }
      }

      if (!cancelled) setLocation({ ...locationData, isLoading: false });
      return true;
    };

    const detectLocation = async () => {
      // 1. Cached result
      try {
        const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
        if (cachedData) {
          const { location: cachedLocation, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION && cachedLocation?.city) {
            if (!cancelled) setLocation({ ...cachedLocation, isLoading: false });
            return;
          }
          localStorage.removeItem(LOCATION_CACHE_KEY);
        }
      } catch (_e) {
        localStorage.removeItem(LOCATION_CACHE_KEY);
      }

      // 2. Visitor analytics row for this session (may not exist yet)
      try {
        const sessionId = sessionStorage.getItem('session_id');
        if (sessionId) {
          const { data } = await supabase
            .from('visitor_analytics')
            .select('city, region, country')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (data && finalize(data as any, true)) return;
        }
      } catch (_e) {
        /* fall through to the connection lookup */
      }

      if (cancelled) return;

      // 3. Connection-based lookup
      try {
        const { data, error } = await functionsClient.functions.invoke('geo-locate');
        if (!error && data && finalize(data as any, true)) return;
      } catch (_e) {
        /* nothing else to try */
      }

      if (!cancelled) setLocation({ isGTA: false, isLoading: false });
    };

    detectLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return location;
};

/**
 * Determine which shipping zone the user belongs to
 */
const determineShippingZone = (
  country?: string,
  region?: string,
  city?: string,
  isGTA?: boolean
): 'toronto-gta' | 'canada-wide' | 'us-standard' | 'us-west-coast' | 'international' => {
  if (!country) return 'international';

  const countryUpper = country.toUpperCase();

  if (countryUpper === 'CA' && isGTA) {
    return 'toronto-gta';
  }

  if (countryUpper === 'CA') {
    return 'canada-wide';
  }

  if (countryUpper === 'US') {
    const regionUpper = region?.toUpperCase();
    if (
      regionUpper === 'CALIFORNIA' || regionUpper === 'CA' ||
      regionUpper === 'OREGON' || regionUpper === 'OR' ||
      regionUpper === 'WASHINGTON' || regionUpper === 'WA'
    ) {
      return 'us-west-coast';
    }
    return 'us-standard';
  }

  return 'international';
};

/**
 * Check if the city/region is in the Greater Toronto Area.
 * Accepts either the province code ("ON") or full name ("Ontario").
 */
const checkIsGTA = (city?: string, region?: string): boolean => {
  if (!city) return false;

  const cityLower = city.toLowerCase();
  const regionLower = (region || '').toLowerCase();

  if (regionLower && !regionLower.includes('ontario') && regionLower !== 'on') {
    return false;
  }

  const gtaCities = [
    'toronto', 'mississauga', 'brampton', 'markham', 'vaughan', 'richmond hill',
    'oakville', 'burlington', 'pickering', 'ajax', 'whitby', 'oshawa', 'milton',
    'newmarket', 'aurora', 'georgina', 'whitchurch-stouffville', 'king',
    'caledon', 'halton hills', 'clarington', 'uxbridge', 'scugog', 'brock',
    'etobicoke', 'north york', 'scarborough', 'east york', 'york',
    'woodbridge', 'concord', 'maple', 'thornhill', 'unionville', 'bolton',
    'stouffville', 'willowdale', 'downsview', 'agincourt',
  ];

  return gtaCities.some(gtaCity => cityLower.includes(gtaCity));
};
