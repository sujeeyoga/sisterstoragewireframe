import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { useGiftOptions } from '@/hooks/useGiftOptions';
import { useNewsletterSettings } from '@/hooks/useNewsletterSettings';
import { useAbandonedCart } from '@/hooks/useAbandonedCart';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useShippingZones } from '@/hooks/useShippingZones';
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

import Logo from '@/components/ui/Logo';
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Trash2, Tag, Loader2, Package, Gift, Mail, MapPin, Plus, Minus } from 'lucide-react';

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
  const { items, subtotal, clearCart, removeItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const { discount, applyDiscount, getDiscountAmount } = useStoreDiscount();
  const { giftOptions } = useGiftOptions();
  const { newsletter } = useNewsletterSettings();
  const { shippingSettings } = useShippingSettings();
  const { calculateShipping } = useShippingZones();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>('');
  const [matchedZone, setMatchedZone] = useState<{ id: string; name: string } | null>(null);
  
  // Form stage management
  const [formStage, setFormStage] = useState<'email-address' | 'complete'>('complete');
  
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
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const [giftMessage, setGiftMessage] = useState("");
  const [includeGiftWrapping, setIncludeGiftWrapping] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(newsletter?.defaultChecked || false);

  // Track abandoned carts
  const { markAsRecovered } = useAbandonedCart(formData.email || undefined);
  
  // Auto-advance to complete stage when manual address is filled
  useEffect(() => {
    if (formStage === 'email-address' && formData.address && formData.city && formData.province && formData.postalCode) {
      console.log('Manual address complete, advancing to complete stage');
      setFormStage('complete');
    }
  }, [formData.address, formData.city, formData.province, formData.postalCode, formStage]);

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
  
  // Get shipping cost from selected rate (zone-based)
  const selectedRate = shippingRates.find(rate => rate.id === selectedShippingRate);
  let shippingCost = selectedRate ? selectedRate.rate_amount : 0;
  
  const total = discountedSubtotal + giftWrappingFee + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (name in validationErrors) {
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

  // Check if manual address entry is complete for "Calculate Shipping" button
  const isManualAddressComplete = Boolean(
    formData.address && formData.city && formData.province && formData.postalCode
  );


  // Calculate shipping using zone-based system
  const calculateShippingZones = async () => {
    // Check if required fields are filled
    if (!formData.address || !formData.city || !formData.province || !formData.postalCode) {
      return;
    }

    setIsLoadingRates(true);
    try {
      // Use original subtotal for shipping threshold calculations (before discount)
      const result = await calculateShipping({
        city: formData.city,
        province: formData.province,
        country: formData.country,
        postalCode: formData.postalCode,
      }, subtotal);

      if (result.success && result.rates) {
        setShippingRates(result.rates);
        setMatchedZone(result.matched_zone);
        
        // Auto-select the cheapest option
        if (result.rates.length > 0) {
          const cheapest = result.rates.reduce((prev, curr) => 
            curr.rate_amount < prev.rate_amount ? curr : prev
          );
          setSelectedShippingRate(cheapest.id);
        }
        
        toast({
          title: result.fallback_used ? 'Using Fallback Rate' : 'Shipping Rates Loaded',
          description: result.fallback_used 
            ? 'No specific zone matched. Using default rate.'
            : `Matched to ${result.matched_zone?.name} zone.`,
        });
      } else {
        throw new Error('No rates available');
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: 'Shipping Error',
        description: 'Unable to calculate shipping rates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required contact fields
    const errors: typeof validationErrors = {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
    };
    
    let hasErrors = false;
    
    if (!formData.email) {
      errors.email = 'Email is required';
      hasErrors = true;
    }
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      hasErrors = true;
    }
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      hasErrors = true;
    }
    if (!formData.address) {
      errors.address = 'Street address is required';
      hasErrors = true;
    }
    if (!formData.city) {
      errors.city = 'City is required';
      hasErrors = true;
    }
    if (!formData.province) {
      errors.province = 'Province is required';
      hasErrors = true;
    }
    if (!formData.postalCode) {
      errors.postalCode = 'Postal code is required';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setValidationErrors(errors);
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
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
    
    // Require shipping selection
    if (!selectedShippingRate) {
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
          customerPhone: formData.phone,
          shippingAddress: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.province,
            postal_code: formData.postalCode,
            country: formData.country,
          },
          shippingCost: shippingCost,
          shippingMethod: selectedRate?.method_name || 'Standard Shipping',
          taxAmount: taxAmount,
          taxRate: taxRate,
          province: formData.province,
          subtotal: subtotal, // Send original subtotal for discount calculation
          giftWrapping: includeGiftWrapping ? {
            enabled: true,
            fee: giftWrappingFee,
            message: giftMessage
          } : null,
          subscribeNewsletter: subscribeNewsletter,
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={validationErrors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={validationErrors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {validationErrors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={validationErrors.email ? "border-red-500" : ""}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                    )}
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
                  {/* Address Input */}
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={validationErrors.address ? "border-red-500" : ""}
                      autoComplete="street-address"
                      required
                    />
                    {validationErrors.address && (
                      <p className="text-sm text-red-500 mt-1">{validationErrors.address}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                      {/* Address Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* City */}
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="Toronto"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={validationErrors.city ? "border-red-500" : ""}
                            autoComplete="address-level2"
                            required
                          />
                          {validationErrors.city && (
                            <p className="text-sm text-red-500 mt-1">{validationErrors.city}</p>
                          )}
                        </div>
                        
                        {/* Province */}
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
                        
                        {/* Postal Code */}
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
                            autoComplete="postal-code"
                            required
                          />
                          {validationErrors.postalCode && (
                            <p className="text-sm text-red-500 mt-1">{validationErrors.postalCode}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">Format: A1A1A1</p>
                        </div>
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(123) 456-7890"
                          autoComplete="tel"
                        />
                      </div>
                      
                      {/* Calculate Shipping Button */}
                      {isManualAddressComplete && shippingRates.length === 0 && !isLoadingRates && (
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 animate-fade-in">
                          <div className="flex items-start gap-3 mb-3">
                            <Package className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-yellow-900 text-sm">Ready to Calculate Shipping</p>
                              <p className="text-xs text-yellow-700 mt-1">Click below to see available shipping options</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={calculateShippingZones}
                            className="w-full"
                            size="lg"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Calculate Shipping Rates
                          </Button>
                        </div>
                      )}
                    </div>
                  
                  {/* Show shipping status when rates are available */}
                  <>
                    {/* Auto-calculating shipping indicator */}
                    {isLoadingRates && (
                      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 animate-fade-in">
                        <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--brand-pink))]" />
                        <div>
                          <p className="font-semibold text-gray-900">Calculating shipping rates...</p>
                          <p className="text-xs text-gray-600">Finding the best shipping options for you</p>
                        </div>
                      </div>
                    )}
                    
                    {!isLoadingRates && shippingRates.length > 0 && (
                      <>
                        {shippingRates.some(rate => rate.is_free || rate.rate_amount === 0) ? (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 p-5 rounded-lg animate-fade-in shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-3xl">🎉</div>
                              <div>
                                <p className="text-xl text-green-900 font-bold">Free Shipping Unlocked!</p>
                                <p className="text-sm text-green-700 mt-1">Your order qualifies for free delivery</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-lg animate-fade-in">
                            <p className="text-base text-blue-900 font-bold flex items-center gap-2">
                              ✓ {shippingRates.length} Shipping {shippingRates.length === 1 ? 'Option' : 'Options'} Available
                            </p>
                            <p className="text-sm text-blue-700 mt-1">Select your preferred method below</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                </CardContent>
              </Card>

              {/* Zone-based Shipping Info */}
              {matchedZone && shippingRates.length > 0 && (
                <Card className="border-2 border-primary animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <MapPin className="h-5 w-5" />
                      Shipping to: {matchedZone.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              )}

              {/* Shipping Options */}
              {shippingRates.length > 0 && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Package className="h-5 w-5" />
                      Available Shipping Options
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred shipping method
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedShippingRate} onValueChange={setSelectedShippingRate}>
                      <div className="grid grid-cols-1 gap-3">
                        {shippingRates.map((rate: any) => (
                          <div key={rate.id} className={`flex items-center space-x-2 border-2 rounded-lg p-4 transition-colors hover:border-primary ${
                            selectedShippingRate === rate.id 
                              ? 'bg-primary/10 border-primary shadow-md' 
                              : 'hover:bg-accent'
                          }`}>
                            <RadioGroupItem value={rate.id} id={rate.id} />
                            <Label htmlFor={rate.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-base">{rate.method_name}</p>
                                  {rate.is_free && (
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                      <span className="inline-flex items-center gap-1">
                                        ✓ Free shipping
                                      </span>
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-primary">
                                    {rate.is_free || rate.rate_amount === 0 ? 'FREE' : `$${rate.rate_amount.toFixed(2)}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">CAD</p>
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

              <div className="mt-8 mb-6">
                <Button 
                  type="submit" 
                  className="w-full bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90 rainbow-glow"
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
              </div>
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
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                              Unit Price: <span className="font-medium">${item.price.toFixed(2)}</span>
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">Qty:</span>
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 h-6 flex items-center justify-center text-xs font-medium border-x border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
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
                  
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Shipping</span>
                    <div className="text-right">
                      {shippingRates.length === 0 ? (
                        <span className="text-sm text-gray-400 italic">Input address to Calculate</span>
                      ) : selectedShippingRate ? (
                        <>
                          {shippingCost === 0 ? (
                            <div className="flex flex-col items-end">
                              <span className="text-green-600 font-bold text-base">FREE</span>
                              <span className="text-xs text-gray-500">{selectedRate?.method_name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-base">${shippingCost.toFixed(2)}</span>
                              <span className="text-xs text-gray-500">{selectedRate?.method_name}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-yellow-600 italic">Select a method</span>
                      )}
                    </div>
                  </div>
                  
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
