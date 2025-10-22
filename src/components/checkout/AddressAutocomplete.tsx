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
const formatPostalCode = (postal: string): string => {
  const cleaned = postal.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6 && /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
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

// Province name to code mapping
const PROVINCE_MAP: Record<string, string> = {
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

  useEffect(() => {
    // Load Google Places API script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    // Initialize autocomplete with Canada restriction
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'ca' },
      fields: ['address_components', 'formatted_address'],
      types: ['address']
    });

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
      
      // Get province code
      const provinceLong = components.administrative_area_level_1?.long || '';
      const provinceShort = components.administrative_area_level_1?.short || '';
      const province = PROVINCE_MAP[provinceLong] || provinceShort || '';
      
      // Get postal code
      const rawPostalCode = components.postal_code?.long || '';
      const postalCode = rawPostalCode ? formatPostalCode(rawPostalCode) : '';

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
  }, [isLoaded, onChange, onAddressSelect]);

  return (
    <div className="space-y-2">
      <Label htmlFor="address" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Street Address
      </Label>
      <Input
        ref={inputRef}
        id="address"
        name="address"
        placeholder="Start typing your address..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
        autoComplete="new-address"
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!isLoaded && (
        <p className="text-xs text-amber-600">Loading address suggestions...</p>
      )}
      {isLoaded && (
        <p className="text-xs text-gray-500">
          Select from suggestions or manually enter your address, city, province, and postal code
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
