import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
      const place = autocompleteRef.current?.getPlace();
      
      // Only process if user actually selected a place from dropdown
      if (!place?.address_components) {
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

      if (fullAddress && city && province) {
        // Set the formatted value immediately - this updates the input instantly
        if (inputRef.current) {
          inputRef.current.value = fullAddress;
        }
        onChange(fullAddress);
        onAddressSelect({
          address: fullAddress,
          city,
          province,
          postalCode
        });
      }
    };
    
    autocompleteRef.current.addListener('place_changed', handlePlaceChanged);

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onAddressSelect]);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use Google Geocoding API to reverse geocode
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const place = results[0];
              
              // Extract address components
              let streetNumber = '';
              let route = '';
              let city = '';
              let province = '';
              let postalCode = '';

              place.address_components.forEach((component: any) => {
                const types = component.types;
                
                if (types.includes('street_number')) {
                  streetNumber = component.long_name;
                } else if (types.includes('route')) {
                  route = component.long_name;
                } else if (types.includes('locality') || types.includes('sublocality')) {
                  city = formatCity(component.long_name);
                } else if (types.includes('administrative_area_level_1')) {
                  const provinceName = component.long_name;
                  province = PROVINCE_MAP[provinceName] || component.short_name;
                } else if (types.includes('postal_code')) {
                  postalCode = formatPostalCode(component.long_name);
                }
              });

              const fullAddress = formatAddress(`${streetNumber} ${route}`.trim());

              // Update the input field
              if (inputRef.current) {
                inputRef.current.value = fullAddress;
              }
              onChange(fullAddress);

              // Call the address select callback
              if (onAddressSelect && fullAddress && city && province && postalCode) {
                onAddressSelect({
                  address: fullAddress,
                  city,
                  province,
                  postalCode,
                });
              }

              toast.success("Location found! Address populated.");
            } else {
              toast.error("Unable to find address for your location");
            }
            setIsGettingLocation(false);
          });
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          toast.error("Unable to get address from location");
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to access your location. Please check your browser settings.");
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Street Address
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUseMyLocation}
          disabled={isGettingLocation || !isLoaded}
          className="h-auto py-1 px-2 text-xs"
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3 mr-1" />
              Use my location
            </>
          )}
        </Button>
      </div>
      <Input
        ref={inputRef}
        id="address"
        name="address"
        placeholder="123 Main Street"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
        autoComplete="off"
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-gray-500">
        Type your full street address or select from suggestions
      </p>
    </div>
  );
};

export default AddressAutocomplete;
