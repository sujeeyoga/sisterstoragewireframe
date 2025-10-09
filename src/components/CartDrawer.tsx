import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalItems, subtotal, isOpen, setIsOpen } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate tax (example: 8.5%)
  const taxRate = 0.085;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="border-b border-gray-200 p-4 bg-[hsl(var(--brand-pink))]/5">
            <div className="flex justify-between items-center mb-3">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <Logo size="sm" />
              </Link>
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
          
          {/* Cart Items */}
          <div className="flex-1 min-h-0 overflow-y-auto py-4 px-4">
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
          
          {/* Cart Summary - Always visible at bottom */}
          {items.length > 0 && (
            <div className="flex-shrink-0 border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)] bg-gray-50">
              {/* Itemized Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold mb-4 pt-3 border-t border-gray-300">
                <span>Total</span>
                <span className="text-[hsl(var(--brand-pink))]">${total.toFixed(2)}</span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
