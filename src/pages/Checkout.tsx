import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { useGiftOptions } from '@/hooks/useGiftOptions';
import { useNewsletterSettings } from '@/hooks/useNewsletterSettings';
import { useAbandonedCart } from '@/hooks/useAbandonedCart';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import AddressAutocomplete from '@/components/checkout/AddressAutocomplete';
import Logo from '@/components/ui/Logo';
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Trash2, Tag, Loader2, Package, Gift, Mail, MapPin } from 'lucide-react';

// Province mapping and validation
const PROVINCE_MAP: Record<string, string> = {
  'ontario': 'ON', 'québec': 'QC', 'quebec': 'QC',
  'british columbia': 'BC', 'alberta': 'AB', 'manitoba': 'MB',
  'saskatchewan': 'SK', 'nova scotia': 'NS', 'new brunswick': 'NB',
  'newfoundland and labrador': 'NL', 'prince edward island': 'PE',
  'yukon': 'YT', 'northwest territories': 'NT', 'nunavut': 'NU'
};

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' }
];

// Validation functions
const validatePostalCode = (code: string): boolean => {
  return /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(code);
};

const formatPostalCode = (code: string): string => {
  const cleaned = code.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6 && /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    return cleaned;
  }
  return cleaned;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, removeItem } = useCart();
  const { toast } = useToast();
  const { discount, applyDiscount, getDiscountAmount } = useStoreDiscount();
  const { giftOptions } = useGiftOptions();
  const { newsletter } = useNewsletterSettings();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'CA',
    phone: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    address: '',
    province: '',
    postalCode: '',
  });

  const [giftMessage, setGiftMessage] = useState("");
  const [includeGiftWrapping, setIncludeGiftWrapping] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(newsletter?.defaultChecked || false);

  // Track abandoned carts
  const { markAsRecovered } = useAbandonedCart(formData.email || undefined);

  // Calculate tax based on province
  const getTaxRate = (province: string): number => {
    const taxRates: { [key: string]: number } = {
      'ON': 0.13,  // HST 13%
      'BC': 0.12,  // GST + PST
      'AB': 0.05,  // GST only
      'QC': 0.14975, // GST + QST
      'NS': 0.15,  // HST 15%
      'NB': 0.15,  // HST 15%
      'MB': 0.12,  // GST + PST
      'PE': 0.15,  // HST 15%
      'SK': 0.11,  // GST + PST
      'NL': 0.15,  // HST 15%
      'YT': 0.05,  // GST only
      'NT': 0.05,  // GST only
      'NU': 0.05,  // GST only
    };
    return taxRates[province.toUpperCase()] || 0.13; // Default to ON HST
  };

  const taxRate = getTaxRate(formData.province);
  const discountedSubtotal = discount?.enabled ? applyDiscount(subtotal) : subtotal;
  const discountAmount = discount?.enabled ? getDiscountAmount(subtotal) : 0;
  const giftWrappingFee = includeGiftWrapping && giftOptions?.wrappingEnabled ? (giftOptions.wrappingPrice || 0) : 0;
  
  // Calculate tax on subtotal (after discount) plus gift wrapping
  const taxableAmount = discountedSubtotal + giftWrappingFee;
  const taxAmount = taxableAmount * taxRate;
  
  // Get shipping cost from selected rate
  const selectedRate = shippingRates.find(rate => rate.postage_type === selectedShippingRate);
  let shippingCost = selectedRate ? parseFloat(selectedRate.total) : 0;
  
  // Check if postal code is in GTA (Greater Toronto Area)
  const isGTAPostalCode = (postalCode: string): boolean => {
    if (!postalCode) return false;
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    // GTA postal codes: M (Toronto), L1-L9 (surrounding areas)
    return cleaned.startsWith('M') || 
           /^L[1-9]/.test(cleaned);
  };
  
  // Check if customer is in Toronto
  const isInToronto = formData.city.toLowerCase().includes('toronto');
  const isInGTA = isGTAPostalCode(formData.postalCode);
  const qualifiesForFreeShipping = discountedSubtotal >= 50 && isInGTA && !isInToronto;
  
  // Apply Toronto flat rate ($3.99) or free shipping for GTA orders over $50
  if (isInToronto) {
    shippingCost = 3.99;
  } else if (qualifiesForFreeShipping) {
    shippingCost = 0;
  }
  
  const total = discountedSubtotal + giftWrappingFee + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (name === 'address' || name === 'province' || name === 'postalCode') {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePostalCodeBlur = () => {
    const formatted = formatPostalCode(formData.postalCode);
    if (formatted !== formData.postalCode) {
      setFormData(prev => ({ ...prev, postalCode: formatted }));
    }
    
    if (formData.postalCode && !validatePostalCode(formatted)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        postalCode: 'Invalid postal code format (e.g., A1A1A1)' 
      }));
    }
  };

  const handleProvinceChange = (value: string) => {
    setFormData(prev => ({ ...prev, province: value }));
    setValidationErrors(prev => ({ ...prev, province: '' }));
  };

  // Debounce address fields for shipping calculation
  const debouncedAddress = useDebounce(formData.address, 300);
  const debouncedCity = useDebounce(formData.city, 300);
  const debouncedProvince = useDebounce(formData.province, 300);
  const debouncedPostalCode = useDebounce(formData.postalCode, 300);
  const lastRatesKeyRef = useRef<string>('');

  // Auto-calculate shipping when address is complete and has changed
  useEffect(() => {
    const hasCompleteAddress = Boolean(
      debouncedAddress && debouncedCity && debouncedProvince && debouncedPostalCode
    );

    const key = `${debouncedAddress}|${debouncedCity}|${debouncedProvince}|${debouncedPostalCode}`;

    console.log('Debounced address check:', {
      hasCompleteAddress,
      key,
    });

    if (hasCompleteAddress && key !== lastRatesKeyRef.current) {
      lastRatesKeyRef.current = key;
      console.log('Auto-triggering shipping calculation (new address key)');
      calculateShipping();
    }
  }, [debouncedAddress, debouncedCity, debouncedProvince, debouncedPostalCode]);

  // Handle address selection from autocomplete
  const handleAddressSelect = (address: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }) => {
    console.log('Google Address Selected:', address);
    
    // Ensure postal code is properly formatted (A1A1A1)
    const formattedPostalCode = formatPostalCode(address.postalCode);
    
    // Ensure province is 2-letter uppercase code
    const formattedProvince = address.province.toUpperCase().slice(0, 2);
    
    // Ensure city is properly formatted
    const formattedCity = address.city.trim();
    
    console.log('Formatted Address Data:', {
      address: address.address,
      city: formattedCity,
      province: formattedProvince,
      postalCode: formattedPostalCode
    });
    
    // Update form data - the debounced useEffect will trigger shipping calculation
    setFormData(prev => ({
      ...prev,
      address: address.address,
      city: formattedCity,
      province: formattedProvince,
      postalCode: formattedPostalCode
    }));
    
    // Clear any validation errors
    setValidationErrors({ address: '', province: '', postalCode: '' });
  };

  // Calculate shipping when address is complete
  const calculateShipping = async () => {
    // Check if required fields are filled
    if (!formData.address || !formData.city || !formData.province || !formData.postalCode) {
      return;
    }

    setIsLoadingRates(true);
    try {
      // Calculate total weight based on cart items (estimate 0.5kg per item)
      const totalWeight = items.reduce((sum, item) => sum + (item.quantity * 0.5), 0);

      const { data, error } = await supabase.functions.invoke('stallion-express', {
        body: {
          action: 'get-rates',
          data: {
            from_address: {
              name: 'Sister Storage Inc',
              address1: '51 Cachia Lane',
              city: 'Ajax',
              province_code: 'ON',
              postal_code: 'L1T0P8',
              country_code: 'CA',
            },
            to_address: {
              name: `${formData.firstName} ${formData.lastName}`,
              address1: formData.address,
              city: formData.city,
              province_code: formData.province.toUpperCase(),
              postal_code: formData.postalCode.replace(/\s/g, ''),
              country_code: formData.country,
              phone: formData.phone,
              email: formData.email,
            },
            weight: Math.max(totalWeight, 0.5), // Minimum 0.5kg
            weight_unit: 'kg',
            length: 30,
            width: 20,
            height: 10,
            size_unit: 'cm',
            package_contents: 'Jewelry storage accessories',
            value: subtotal,
            currency: 'CAD',
          },
        },
      });

      if (error) throw error;

      if (data?.success && data?.data?.rates) {
        // Sort rates by price (cheapest first)
        const sortedRates = data.data.rates.sort((a: any, b: any) => 
          parseFloat(a.total) - parseFloat(b.total)
        );
        setShippingRates(sortedRates);
        
        // Auto-select the cheapest option
        if (sortedRates.length > 0) {
          setSelectedShippingRate(sortedRates[0].postage_type);
        }
        
        toast({
          title: 'Shipping Rates Loaded',
          description: `Found ${sortedRates.length} shipping options. Cheapest: $${parseFloat(sortedRates[0].total).toFixed(2)}`,
        });
      } else {
        throw new Error('No rates available');
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: 'Shipping Error',
        description: 'Unable to calculate shipping rates. Using standard rate.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate postal code format
    if (!validatePostalCode(formData.postalCode)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        postalCode: 'Invalid postal code format (e.g., A1A1A1)' 
      }));
      toast({
        title: "Invalid Postal Code",
        description: "Please enter a valid Canadian postal code (e.g., A1A1A1).",
        variant: "destructive",
      });
      return;
    }

    // Validate province is valid 2-letter code
    const validProvinceCodes = PROVINCES.map(p => p.code);
    if (!validProvinceCodes.includes(formData.province)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        province: 'Please select a valid province' 
      }));
      toast({
        title: "Invalid Province",
        description: "Please select a valid province from the dropdown.",
        variant: "destructive",
      });
      return;
    }
    
    // Only require shipping selection if not qualified for free shipping or Toronto flat rate
    if (!qualifiesForFreeShipping && !isInToronto && !selectedShippingRate) {
      toast({
        title: 'Select Shipping Method',
        description: 'Please calculate and select a shipping method',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            description: item.description || `${item.name} - Quantity: ${item.quantity}`,
          })),
          customerEmail: formData.email,
          shippingAddress: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.province,
            postal_code: formData.postalCode,
            country: formData.country,
          },
          shippingCost: shippingCost,
          shippingMethod: selectedRate?.postage_type || 'Standard Shipping',
          taxAmount: taxAmount,
          taxRate: taxRate,
          province: formData.province,
        },
      });

      if (error) throw error;

      console.log('Stripe checkout response:', data);

      if (data?.sessionId) {
        console.log('Redirecting to Stripe checkout:', data.sessionId);
        
        // Mark cart as recovered before redirecting to payment
        await markAsRecovered();
        
        // Redirect to Stripe checkout
        if (data?.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error('No checkout URL received');
        }
      } else {
        console.error('No session ID in response:', data);
        throw new Error('No checkout session ID received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to initialize checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Logo size="md" />
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(value) => handleInputChange({ target: { name: 'address', value } } as any)}
                    onAddressSelect={handleAddressSelect}
                    error={validationErrors.address}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select value={formData.province} onValueChange={handleProvinceChange}>
                        <SelectTrigger className={validationErrors.province ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem key={province.code} value={province.code}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.province && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.province}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        onBlur={handlePostalCodeBlur}
                        className={validationErrors.postalCode ? "border-red-500" : ""}
                        placeholder="A1A1A1"
                        required
                      />
                      {validationErrors.postalCode && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.postalCode}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">Format: A1A1A1</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="555-1234"
                    />
                  </div>
                  
                  {/* Auto-calculating shipping indicator */}
                  {isLoadingRates && (
                    <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--brand-pink))]" />
                      <div>
                        <p className="font-semibold text-gray-900">Calculating shipping rates...</p>
                        <p className="text-xs text-gray-600">Finding the best shipping options for you</p>
                      </div>
                    </div>
                  )}
                  
                  {shippingRates.length > 0 && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ Found {shippingRates.length} shipping options - Select your preferred method below
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Free Shipping Message for GTA customers */}
              {qualifiesForFreeShipping && (
                <Card className="border-2 border-green-500 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Truck className="h-5 w-5" />
                      Free Shipping Applied! 🎉
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-800 font-medium">
                      Your order qualifies for FREE shipping because you're in the Greater Toronto Area and your order is over $50!
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Toronto Flat Rate Message */}
              {isInToronto && !qualifiesForFreeShipping && (
                <Card className="border-2 border-[hsl(var(--brand-pink))] bg-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-pink))]">
                      <Truck className="h-5 w-5" />
                      Toronto Flat Rate Shipping
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[hsl(var(--brand-pink))] font-medium">
                      Great news! All Toronto orders ship for just $3.99 flat rate.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Options - Show only if not qualified for free shipping and not Toronto */}
              {!qualifiesForFreeShipping && !isInToronto && shippingRates.length > 0 && (
                <Card className="border-2 border-[hsl(var(--brand-pink))]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[hsl(var(--brand-pink))]">
                      <Package className="h-5 w-5" />
                      Available Shipping Options
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Select your preferred shipping method based on price and delivery time
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedShippingRate} onValueChange={setSelectedShippingRate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {shippingRates.map((rate: any) => (
                          <div key={rate.postage_type} className={`flex items-center space-x-2 border-2 rounded-lg p-4 transition-colors hover:border-[hsl(var(--brand-pink))] ${
                            selectedShippingRate === rate.postage_type 
                              ? 'bg-[hsl(var(--brand-pink))]/10 border-[hsl(var(--brand-pink))] shadow-md' 
                              : 'hover:bg-gray-50'
                          }`}>
                            <RadioGroupItem value={rate.postage_type} id={rate.postage_type} />
                            <Label htmlFor={rate.postage_type} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-base">{rate.postage_type}</p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    <span className="inline-flex items-center gap-1">
                                      <Truck className="h-3 w-3" />
                                      Delivery: {rate.delivery_days} business days
                                    </span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-[hsl(var(--brand-pink))]">
                                    ${parseFloat(rate.total).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500">CAD</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Continue to Payment - ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="space-y-2 pb-4 border-b last:border-0">
                      <div className="flex gap-3">
                        {item.image.startsWith('http') ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div 
                            className="w-16 h-16 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: item.image.startsWith('#') ? item.image : '#e90064' }}
                          >
                            <span className="text-white font-bold text-xs">SS</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 mb-1">{item.name}</p>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-600">
                              Unit Price: <span className="font-medium">${item.price.toFixed(2)}</span>
                            </p>
                            <p className="text-xs text-gray-600">
                              Quantity: <span className="font-medium">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1 h-fit"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center pl-[76px]">
                        <span className="text-xs text-gray-500">Item Subtotal:</span>
                        <span className="text-sm font-semibold text-[hsl(var(--brand-pink))]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount?.enabled && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {discount.name} ({discount.percentage}% off)
                      </span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {giftWrappingFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Gift className="h-3 w-3" />
                        Gift Wrapping
                      </span>
                      <span className="font-medium">${giftWrappingFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* Free Shipping Progress for GTA (excluding Toronto) */}
                  {isInGTA && !isInToronto && !qualifiesForFreeShipping && discountedSubtotal > 0 && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-[hsl(var(--brand-pink))]/20 rounded-lg p-3 my-2">
                      <div className="flex items-start gap-2">
                        <Truck className="h-4 w-4 text-[hsl(var(--brand-pink))] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[hsl(var(--brand-pink))] mb-1">
                            GTA Free Shipping
                          </p>
                          <p className="text-xs text-gray-700">
                            Spend <span className="font-bold text-[hsl(var(--brand-pink))]">
                              ${(50 - discountedSubtotal).toFixed(2)} more
                            </span> to unlock FREE shipping!
                          </p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[hsl(var(--brand-pink))] to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((discountedSubtotal / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Toronto Flat Rate Message */}
                  {isInToronto && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-[hsl(var(--brand-pink))]/20 rounded-lg p-3 my-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[hsl(var(--brand-pink))]">
                            Toronto Flat Rate
                          </p>
                          <p className="text-xs text-gray-700">
                            All Toronto orders ship for just $3.99
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Non-GTA Message */}
                  {!isInGTA && formData.postalCode && discountedSubtotal > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-600 mb-1">
                            Outside GTA
                          </p>
                          <p className="text-xs text-gray-700">
                            Free shipping available for GTA orders over $50. Your location: {formData.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 && selectedShippingRate ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-gray-400">Calculate shipping</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {qualifiesForFreeShipping && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-500/30 rounded-lg p-3 my-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-green-700">
                            🎉 FREE Shipping Unlocked!
                          </p>
                          <p className="text-xs text-green-600">
                            Toronto orders over $50 ship free
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedRate && !qualifiesForFreeShipping && (
                    <p className="text-xs text-gray-500 pl-4">
                      {selectedRate.postage_type} - {selectedRate.delivery_days} business days
                    </p>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(2)}%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[hsl(var(--brand-pink))]">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
