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

    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.address_components) {
        // Fallback: parse from freeform string when Places API is unavailable
        const raw = inputRef.current?.value || '';
        const parts = raw.split(',').map(p => p.trim()).filter(Boolean);
        const street = parts[0] || raw.trim();

        const provinceMatch = raw.match(/\b(AB|BC|MB|NB|NL|NT|NS|NU|ON|PE|QC|SK|YT)\b/i);
        const postalMatch = raw.match(/([A-Za-z]\d[A-Za-z])\s?\d[A-Za-z]\d/i);
        const city = parts.length > 1 ? parts[1] : '';
        const province = provinceMatch ? provinceMatch[1].toUpperCase() : '';
        let postalCode = postalMatch ? postalMatch[0].toUpperCase().replace(/\s/g, '') : '';
        if (postalCode.length === 6) {
          postalCode = `${postalCode.slice(0,3)} ${postalCode.slice(3)}`;
        }

        if (street && city && province) {
          onChange(street);
          onAddressSelect({ address: street, city, province, postalCode });
          inputRef.current?.blur();
        }
        return;
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
      const fullAddress = `${streetNumber} ${route}`.trim();
      
      // Use sublocality (e.g., Scarborough) if available, otherwise use locality (e.g., Toronto)
      const city = components.sublocality_level_1?.long || components.sublocality?.long || components.locality?.long || '';
      
      // Get 2-letter province code (try mapping first, then short_name)
      const provinceLong = components.administrative_area_level_1?.long || '';
      const provinceShort = components.administrative_area_level_1?.short || '';
      const province = (PROVINCE_MAP[provinceLong] || provinceShort).toUpperCase();
      
      // Format Canadian postal code with space
      let postalCode = components.postal_code?.long || '';
      if (postalCode) {
        postalCode = postalCode.replace(/\s/g, '').toUpperCase();
        if (postalCode.length === 6) {
          postalCode = `${postalCode.slice(0, 3)} ${postalCode.slice(3)}`;
        }
      }

      console.log('Address selected:', { fullAddress, city, province, postalCode });

      if (fullAddress && city && province && postalCode) {
        // Update the input value to close the dropdown
        onChange(fullAddress);
        
        onAddressSelect({
          address: fullAddress,
          city,
          province,
          postalCode
        });
        // Close suggestions
        inputRef.current?.blur();
      }
    });

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onAddressSelect]);

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
        autoComplete="off"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-gray-500">
        Start typing to see address suggestions
      </p>
    </div>
  );
};

export default AddressAutocomplete;
