import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { useLocationDetection } from '@/hooks/useLocationDetection';
import { useShippingZones } from '@/hooks/useShippingZones';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalItems, subtotal, isOpen, setIsOpen } = useCart();
  const { discount, applyDiscount, getDiscountAmount } = useStoreDiscount();
  const location = useLocation();
  const drawerContentRef = React.useRef<HTMLDivElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  
  // Location detection and shipping estimation
  const { city, region, country, postalCode, isGTA, isLoading: locationLoading } = useLocationDetection();
  const { calculateShipping } = useShippingZones();
  const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  
  // Hide floating button when cart is open or on checkout page or admin pages
  const shouldHideFloatingButton = isOpen || location.pathname === '/checkout' || location.pathname.startsWith('/admin');

  // Scroll viewport to show drawer when it opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Scroll the viewport to make drawer fully visible
      drawerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Also scroll drawer content to top
      if (drawerContentRef.current) {
        drawerContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // No body scroll lock - allow scrolling behind the drawer

  // Calculate discount first
  const discountedSubtotal = discount?.enabled ? applyDiscount(subtotal) : subtotal;
  const discountAmount = discount?.enabled ? getDiscountAmount(subtotal) : 0;

  // Estimate shipping when location is detected (using discounted subtotal)
  useEffect(() => {
    const estimateShipping = async () => {
      if (!locationLoading && city && country && discountedSubtotal > 0) {
        setShippingLoading(true);
        try {
          const result = await calculateShipping({
            city,
            province: region,
            country,
            postalCode
          }, discountedSubtotal);
          
          if (result?.appliedRate?.rate_amount !== undefined) {
            setEstimatedShipping(result.appliedRate.rate_amount);
          }
        } catch (error) {
          console.error('Failed to estimate shipping:', error);
          setEstimatedShipping(null);
        } finally {
          setShippingLoading(false);
        }
      }
    };
    
    estimateShipping();
  }, [city, region, country, postalCode, discountedSubtotal, locationLoading]);

  // Calculate tax on discounted subtotal (8.5%)
  const taxRate = 0.085;
  const taxAmount = discountedSubtotal * taxRate;
  
  // Calculate final totals (shipping is 0 if free shipping unlocked for GTA)
  const finalShipping = estimatedShipping ?? 0;
  const estimatedTotal = discountedSubtotal + taxAmount + finalShipping;
  const total = discountedSubtotal + taxAmount;

  return (
    <>
      {/* Floating Cart Button - Hidden when drawer is open or on checkout page */}
      {!shouldHideFloatingButton && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-[60px] h-[60px] bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Open shopping cart"
        >
          <ShoppingBag className="h-7 w-7" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[hsl(var(--brand-pink))] rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold border-2 border-[hsl(var(--brand-pink))]">
              {totalItems}
            </span>
          )}
        </button>
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 md:w-[750px] lg:w-[850px] max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header - Full Width */}
          <div className="flex-shrink-0 border-b border-gray-200 p-4 bg-[hsl(var(--brand-pink))]/5">
            <div className="flex justify-between items-center mb-3">
              <Logo size="sm" onClick={() => setIsOpen(false)} />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-lg font-bold flex items-center text-gray-900">
              <ShoppingBag className="mr-2 h-5 w-5 text-[hsl(var(--brand-pink))]" />
              Shopping Cart ({totalItems})
            </h2>
          </div>
          
          {/* Two Column Layout - Mobile: stacked, Desktop: side-by-side */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - Cart Items (Scrollable) */}
            <div ref={drawerContentRef} className="flex-1 md:w-[60%] overflow-y-auto py-4 px-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mb-6">Add items to get started</p>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="default"
                    className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.image.startsWith('http') ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div 
                              className="w-20 h-20 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: item.image.startsWith('#') ? item.image : '#e90064' }}
                            >
                              <span className="text-white font-bold text-sm">SS</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-[hsl(var(--brand-pink))] font-semibold text-sm mb-2">
                            ${item.price.toFixed(2)} each
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-10 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <span className="text-sm font-semibold text-gray-900">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Panel - Cart Summary (Sticky on Desktop) */}
            {items.length > 0 && (
              <div className="flex-shrink-0 md:w-[40%] border-t md:border-t-0 md:border-l border-gray-200 p-4 bg-gray-50 md:overflow-y-auto">
                <div className="md:sticky md:top-4">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  
                  {/* Itemized Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount?.enabled && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {discount.name} ({discount.percentage}% off)
                        </span>
                        <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* US Shipping Notice - Only for US customers */}
                  {country === 'US' && (
                    <div className="bg-amber-50 border border-amber-400 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Truck className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-amber-900 mb-1">
                            US Shipping Notice
                          </p>
                          <p className="text-xs text-amber-800">
                            Ships from Canada. Current rates include cross-border tariffs and customs fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Shipping Progress for Toronto - Only for Toronto/GTA customers */}
                  {isGTA && (
                    <>
                      {discountedSubtotal < 50 ? (
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-[hsl(var(--brand-pink))]/20 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <Truck className="h-4 w-4 text-[hsl(var(--brand-pink))] mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-[hsl(var(--brand-pink))] mb-1">
                                Toronto Free Shipping
                              </p>
                              <p className="text-xs text-gray-700">
                                Spend <span className="font-bold text-[hsl(var(--brand-pink))]">
                                  ${(50 - discountedSubtotal).toFixed(2)} more
                                </span> to unlock FREE shipping!
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[hsl(var(--brand-pink))] to-purple-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((discountedSubtotal / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-500/30 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-green-700">
                                🎉 FREE Shipping Unlocked!
                              </p>
                              <p className="text-xs text-green-600">
                                For Toronto orders over $50
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Estimated Tax</span>
                      <span className="font-medium text-gray-900">${taxAmount.toFixed(2)}</span>
                    </div>
                    
                    {/* Estimated Shipping with Location */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Shipping</span>
                        {city && country && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{city}, {country}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {locationLoading || shippingLoading ? (
                          <span className="text-gray-400">Estimating...</span>
                        ) : estimatedShipping !== null ? (
                          estimatedShipping === 0 ? (
                            <span className="text-green-600 font-semibold">FREE</span>
                          ) : (
                            `~$${estimatedShipping.toFixed(2)}`
                          )
                        ) : (
                          <span className="text-gray-400">At checkout</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold mb-4 pt-3 border-t border-gray-300">
                    <span>
                      {estimatedShipping !== null ? 'Est. Total' : 'Total'}
                    </span>
                    <span className="text-[hsl(var(--brand-pink))]">
                      {estimatedShipping !== null ? `~$${estimatedTotal.toFixed(2)}` : `$${total.toFixed(2)}`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link to="/checkout" className="block">
                      <Button 
                        className="w-full bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90 text-white"
                        size="lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartDrawer;
