import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Trash2, Tag, Loader2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AddressAutocomplete from '@/components/checkout/AddressAutocomplete';
import { useDebounce } from '@/hooks/useDebounce';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '@/components/checkout/PaymentForm';

// Initialize Stripe with publishable key
const stripePromise = loadStripe('pk_live_51QXKjNKUj5UEV4Z9vLvF09u1l2ZJzqkF0LKcGTmPYSC1cYQzV7MmgfWk4z5tClCaBx41Vls0gDj1jxmK4jQxqQ3600lfNh3Lte');

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, removeItem } = useCart();
  const { toast } = useToast();
  const { discount, applyDiscount, getDiscountAmount } = useStoreDiscount();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
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
  const taxAmount = discountedSubtotal * taxRate;
  
  // Get shipping cost from selected rate
  const selectedRate = shippingRates.find(rate => rate.postage_type === selectedShippingRate);
  const shippingCost = selectedRate ? parseFloat(selectedRate.total) : 0;
  
  const total = discountedSubtotal + taxAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Uppercase province code for API compatibility
    const processedValue = name === 'province' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  // Debounce address fields
  const debouncedAddress = useDebounce(formData.address, 500);
  const debouncedCity = useDebounce(formData.city, 500);
  const debouncedProvince = useDebounce(formData.province, 500);
  const debouncedPostalCode = useDebounce(formData.postalCode, 500);

  // Auto-calculate shipping when address is complete
  useEffect(() => {
    const hasCompleteAddress = debouncedAddress && debouncedCity && debouncedProvince && debouncedPostalCode;
    
    if (hasCompleteAddress && !isLoadingRates) {
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
    console.log('Updating form with address:', address);
    setFormData(prev => ({
      ...prev,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode
    }));
    
    // Trigger shipping calculation after address is populated
    setTimeout(() => {
      calculateShipping();
    }, 100);
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
      // Call Stripe checkout edge function to create payment intent
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
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

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
        
        toast({
          title: "Ready for Payment",
          description: "Please complete your payment below.",
        });
      } else {
        throw new Error('No payment client secret received');
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
                      <Label htmlFor="state">Province</Label>
                      <Input
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        placeholder="ON"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="M5V 3A8"
                        required
                      />
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

              {/* Shipping Options - Show prominently after address */}
              {shippingRates.length > 0 && (
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
                      <div className="space-y-3">
                        {shippingRates.map((rate: any) => (
                          <div key={rate.postage_type} className="flex items-center space-x-2 border-2 rounded-lg p-4 hover:bg-gray-50 transition-colors hover:border-[hsl(var(--brand-pink))]">
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
                disabled={isProcessing || showPayment}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Continue to Payment - ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>

            {/* Stripe Payment Form */}
            {showPayment && clientSecret && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Complete Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      onBack={() => {
                        setShowPayment(false);
                        setClientSecret('');
                      }} 
                    />
                  </Elements>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b">
                      {item.image.startsWith('http') ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded flex items-center justify-center"
                          style={{ backgroundColor: item.image.startsWith('#') ? item.image : '#e90064' }}
                        >
                          <span className="text-white font-bold text-xs">SS</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-[hsl(var(--brand-pink))]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1 h-fit"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-gray-400">Calculate shipping</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {selectedRate && (
                    <p className="text-xs text-gray-500">
                      {selectedRate.name} - {selectedRate.delivery_days} business days
                    </p>
                  )}
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
