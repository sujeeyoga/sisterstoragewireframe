import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

// SECURITY NOTE: This Google Places API key should be restricted in Google Cloud Console
// Go to: https://console.cloud.google.com/apis/credentials
// Edit your API key and add HTTP referrer restrictions (e.g., your domain: *.lovable.app/*)
// This prevents unauthorized use of your API key
const GOOGLE_PLACES_API_KEY = 'AIzaSyDvBbDzbTVIhYqSyKMLsTDjc89Rnaoy4Zc';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }) => void;
  error?: string;
}

// Utility functions for formatting
const formatPostalCode = (postal: string, country: string = 'CA'): string => {
  const cleaned = postal.replace(/\s/g, '').toUpperCase();
  
  // Canadian postal code
  if (country === 'CA' && cleaned.length === 6 && /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    return cleaned;
  }
  
  // US ZIP code
  if (country === 'US' && /^\d{5}(-?\d{4})?$/.test(cleaned)) {
    return cleaned;
  }
  
  return cleaned;
};

const formatCity = (city: string): string => {
  return city
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatAddress = (address: string): string => {
  return address
    .split(' ')
    .map(word => {
      // Keep numbers and single letters as-is
      if (/^\d+$/.test(word) || word.length === 1) return word;
      // Capitalize first letter of words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Province/State name to code mapping
const PROVINCE_STATE_MAP: Record<string, string> = {
  // Canadian Provinces
  'Alberta': 'AB',
  'British Columbia': 'BC',
  'Manitoba': 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Northwest Territories': 'NT',
  'Nova Scotia': 'NS',
  'Nunavut': 'NU',
  'Ontario': 'ON',
  'Prince Edward Island': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Yukon': 'YT',
  // US States (common ones)
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
};

// Extend Window interface for google
declare global {
  interface Window {
    google: any;
  }
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 AddressAutocomplete: Checking Google Maps API...');
    
    // Load Google Places API script
    if (!window.google) {
      console.log('📥 Loading Google Maps API script...');
      
      // Check if script already exists in DOM
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        console.log('⚠️ Script already exists in DOM, waiting for load...');
        const checkGoogle = setInterval(() => {
          if (window.google) {
            console.log('✅ Google Maps API loaded from existing script');
            setIsLoaded(true);
            clearInterval(checkGoogle);
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (!window.google) {
            console.error('❌ Google Maps API failed to load after 10 seconds');
            setLoadError('Address suggestions unavailable. Please enter your address manually.');
          }
        }, 10000);
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google Maps API script loaded successfully');
        setIsLoaded(true);
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps API script:', error);
        console.error('Check if API key is valid and has Places API enabled');
        setLoadError('Address suggestions unavailable. Please enter your address manually.');
      };
      document.head.appendChild(script);
    } else {
      console.log('✅ Google Maps API already available');
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Don't initialize autocomplete if there's a load error
    if (loadError) {
      console.log('⚠️ Skipping autocomplete initialization due to load error');
      return;
    }
    
    if (!isLoaded || !inputRef.current) {
      console.log('⏳ Waiting for Google Maps API to load...', { isLoaded, hasInput: !!inputRef.current });
      return;
    }
    
    if (!window.google) {
      console.error('❌ window.google is not defined despite isLoaded=true');
      return;
    }

    console.log('🔧 Initializing Google Places Autocomplete...');
    
    try {
      // Initialize autocomplete with Canada and US restriction
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['ca', 'us'] },
        fields: ['address_components', 'formatted_address'],
        types: ['address']
      });
      
      console.log('✅ Autocomplete initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize autocomplete:', error);
      setLoadError('Address suggestions unavailable. Please enter your address manually.');
      return;
    }

    // Handle place selection - fires when user clicks a suggestion
    const handlePlaceChanged = () => {
      const place = autocompleteRef.current?.getPlace();
      
      console.log('Place changed event fired:', place);
      
      // Only process if we have valid address data
      if (!place?.address_components || place.address_components.length === 0) {
        console.log('No valid address components, skipping');
        return;
      }

      const components: any = {};
      
      // Parse address components
      place.address_components.forEach((component: any) => {
        const type = component.types[0];
        components[type] = {
          long: component.long_name,
          short: component.short_name
        };
      });

      console.log('Parsed components:', components);

      // Build street address
      const streetNumber = components.street_number?.long || '';
      const route = components.route?.long || '';
      const rawAddress = `${streetNumber} ${route}`.trim();
      const fullAddress = formatAddress(rawAddress);
      
      // Get city (prefer sublocality like Scarborough, fallback to locality like Toronto)
      const rawCity = components.sublocality_level_1?.long || 
                      components.sublocality?.long || 
                      components.locality?.long || '';
      const city = formatCity(rawCity);
      
      // Get country
      const country = components.country?.short || 'CA';
      
      // Get province/state code
      const provinceLong = components.administrative_area_level_1?.long || '';
      const provinceShort = components.administrative_area_level_1?.short || '';
      const province = PROVINCE_STATE_MAP[provinceLong] || provinceShort || '';
      
      // Get postal/ZIP code
      const rawPostalCode = components.postal_code?.long || '';
      const postalCode = rawPostalCode ? formatPostalCode(rawPostalCode, country) : '';

      console.log('Formatted address data:', { fullAddress, city, province, postalCode });

      // Validate we have minimum required data
      if (!fullAddress || !city || !province) {
        console.warn('Incomplete address data, cannot proceed:', { 
          fullAddress, city, province, postalCode 
        });
        return;
      }

      // Update the input field immediately
      if (inputRef.current) {
        inputRef.current.value = fullAddress;
      }
      
      // Notify parent component with all address data
      onChange(fullAddress);
      onAddressSelect({
        address: fullAddress,
        city,
        province,
        postalCode
      });
      
      console.log('✅ Address successfully populated');
    };
    
    // Add the event listener
    const listener = autocompleteRef.current.addListener('place_changed', handlePlaceChanged);

    // Cleanup
    return () => {
      if (listener && window.google) {
        window.google.maps.event.removeListener(listener);
      }
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, loadError, onChange, onAddressSelect]);

  return (
    <div className="space-y-2">
      <Label htmlFor="address" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Street Address
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          name="address"
          placeholder={loadError ? "Enter your street address" : "Start typing your address..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'border-red-500' : ''}
          autoComplete="off"
          disabled={false}
          readOnly={false}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500 flex items-center gap-1">
        <span className="text-base">⚠️</span> {error}
      </p>}
      {loadError && (
        <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
          <span className="text-base">ℹ️</span> {loadError}
        </p>
      )}
      {!isLoaded && !loadError && (
        <p className="text-xs text-gray-500">Loading address suggestions...</p>
      )}
      {isLoaded && !loadError && (
        <p className="text-xs text-gray-500">
          Type to search or enter manually
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
