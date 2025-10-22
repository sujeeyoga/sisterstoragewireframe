import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

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

    // Initialize autocomplete with Canada restriction but allow manual entry
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'ca' },
      fields: ['address_components', 'formatted_address'],
      types: ['address']
    });

    // Handle place selection (only when user selects from dropdown)
    const handlePlaceChanged = () => {
      // Add a small delay to ensure place data is fully loaded
      setTimeout(() => {
        const place = autocompleteRef.current?.getPlace();
        
        console.log('Place changed event:', place);
        
        // Only process if user actually selected a place from dropdown
        if (!place?.address_components) {
          console.log('No address components found, skipping');
          return; // Let manual entry work normally
        }

        const components: any = {};
        
        // Parse address components into a simple object
        place.address_components.forEach((component: any) => {
          const type = component.types[0];
          components[type] = {
            long: component.long_name,
            short: component.short_name
          };
        });

        // Build address from components
        const streetNumber = components.street_number?.long || '';
        const route = components.route?.long || '';
        const rawAddress = `${streetNumber} ${route}`.trim();
        const fullAddress = formatAddress(rawAddress);
        
        // Use sublocality (e.g., Scarborough) if available, otherwise use locality (e.g., Toronto)
        const rawCity = components.sublocality_level_1?.long || components.sublocality?.long || components.locality?.long || '';
        const city = formatCity(rawCity);
        
        // Get 2-letter province code (try mapping first, then short_name)
        const provinceLong = components.administrative_area_level_1?.long || '';
        const provinceShort = components.administrative_area_level_1?.short || '';
        const province = PROVINCE_MAP[provinceLong] || provinceShort || '';
        
        // Format Canadian postal code (A1A1A1)
        const rawPostalCode = components.postal_code?.long || '';
        const postalCode = rawPostalCode ? formatPostalCode(rawPostalCode) : '';

        console.log('Parsed address data:', { fullAddress, city, province, postalCode });

        if (fullAddress && city && province) {
          // Set the formatted value immediately - this updates the input instantly
          if (inputRef.current) {
            inputRef.current.value = fullAddress;
          }
          
          // Call callbacks to update parent component
          onChange(fullAddress);
          onAddressSelect({
            address: fullAddress,
            city,
            province,
            postalCode
          });
          
          console.log('Address data sent to parent');
        } else {
          console.warn('Incomplete address data:', { fullAddress, city, province, postalCode });
        }
      }, 0); // Small delay to ensure Google Places API has populated the data
    };
    
    autocompleteRef.current.addListener('place_changed', handlePlaceChanged);

    // Force place_changed on input change/blur as backup
    const forceUpdate = () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place || !place.address_components) {
        console.log('Forcing place_changed event');
        window.google.maps.event.trigger(autocompleteRef.current, 'place_changed');
      }
    };
    
    if (inputRef.current) {
      inputRef.current.addEventListener('change', forceUpdate);
      inputRef.current.addEventListener('blur', forceUpdate);
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('change', forceUpdate);
        inputRef.current.removeEventListener('blur', forceUpdate);
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
