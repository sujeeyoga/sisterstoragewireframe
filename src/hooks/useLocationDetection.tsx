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
        // Check for cached location first
        const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
        if (cachedData) {
          try {
            const { location: cachedLocation, timestamp } = JSON.parse(cachedData);
            const age = Date.now() - timestamp;
            
            // Use cached data if less than 24 hours old
            if (age < CACHE_DURATION) {
              console.log('Using cached location data');
              setLocation({
                ...cachedLocation,
                isLoading: false,
              });
              return;
            }
          } catch (e) {
            console.error('Error parsing cached location:', e);
          }
        }

        // Get the current session ID from sessionStorage (same as visitor tracking)
        const sessionId = sessionStorage.getItem('session_id');

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

        if (data && data.city && data.region) {
          // Check if user is in GTA
          const isGTA = checkIsGTA(data.city, data.region);
          
          const locationData = {
            city: data.city || undefined,
            region: data.region || undefined,
            country: data.country || undefined,
            isGTA,
          };

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
