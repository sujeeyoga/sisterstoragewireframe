import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  isGTA: boolean;
  isLoading: boolean;
  shippingZone?: 'toronto-gta' | 'canada-wide' | 'us-standard' | 'us-west-coast' | 'international';
}

const LOCATION_CACHE_KEY = 'user_location_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook to detect if user is in Toronto/GTA area
 * Uses cached location data or visitor analytics session data
 */
export const useLocationDetection = (): LocationData => {
  const [location, setLocation] = useState<LocationData>({
    isGTA: false,
    isLoading: true,
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        console.log('🔍 [Location Detection] Starting location detection...');
        
        // Check for cached location first
        const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
        if (cachedData) {
          try {
            const { location: cachedLocation, timestamp } = JSON.parse(cachedData);
            const age = Date.now() - timestamp;
            
            console.log('📦 [Location Detection] Found cached data:', {
              location: cachedLocation,
              age: `${Math.round(age / 1000 / 60)} minutes old`
            });
            
            // Use cached data if less than 24 hours old
            if (age < CACHE_DURATION) {
              console.log('✅ [Location Detection] Using cached location:', cachedLocation);
              setLocation({
                ...cachedLocation,
                isLoading: false,
              });
              return;
            } else {
              console.log('⏰ [Location Detection] Cache expired, fetching fresh data...');
            }
          } catch (e) {
            console.error('❌ [Location Detection] Error parsing cached location:', e);
            localStorage.removeItem(LOCATION_CACHE_KEY);
          }
        } else {
          console.log('📭 [Location Detection] No cached data found');
        }

        // Get the current session ID from sessionStorage (same as visitor tracking)
        const sessionId = sessionStorage.getItem('session_id');
        console.log('🔑 [Location Detection] Session ID:', sessionId);

        if (!sessionId) {
          console.log('⚠️ [Location Detection] No session ID, defaulting to non-GTA');
          setLocation({ isGTA: false, isLoading: false });
          return;
        }

        // Query visitor analytics for location data
        console.log('🌍 [Location Detection] Querying visitor analytics...');
        const { data, error } = await supabase
          .from('visitor_analytics')
          .select('city, region, country')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('❌ [Location Detection] Query error:', error);
          setLocation({ isGTA: false, isLoading: false });
          return;
        }

        console.log('📍 [Location Detection] Raw data from DB:', data);

        if (data && data.city && data.region) {
          // Check if user is in GTA
          const isGTA = checkIsGTA(data.city, data.region);
          console.log('🏙️ [Location Detection] GTA check result:', {
            city: data.city,
            region: data.region,
            isGTA
          });
          
          // Determine shipping zone
          const shippingZone = determineShippingZone(
            data.country,
            data.region,
            data.city,
            isGTA
          );
          
          const locationData = {
            city: data.city || undefined,
            region: data.region || undefined,
            country: data.country || undefined,
            isGTA,
            shippingZone,
          };

          console.log('✨ [Location Detection] Final location data:', locationData);

          // Cache the location data
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
            location: locationData,
            timestamp: Date.now(),
          }));
          
          setLocation({
            ...locationData,
            isLoading: false,
          });
        } else {
          console.log('⚠️ [Location Detection] Incomplete data, defaulting to non-GTA');
          setLocation({ isGTA: false, isLoading: false });
        }
      } catch (error) {
        console.error('❌ [Location Detection] Unexpected error:', error);
        setLocation({ isGTA: false, isLoading: false });
      }
    };

    detectLocation();
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

  // Toronto & GTA
  if (countryUpper === 'CA' && isGTA) {
    return 'toronto-gta';
  }

  // Canada Wide (non-GTA)
  if (countryUpper === 'CA') {
    return 'canada-wide';
  }

  // US West Coast (CA, OR, WA)
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

  // International
  return 'international';
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
