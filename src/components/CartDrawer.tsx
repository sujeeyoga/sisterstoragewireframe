
import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalItems, subtotal, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
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
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="font-bold flex items-center">
              <ShoppingBag className="mr-2 h-3 w-3" />
              Your Cart ({totalItems})
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-grow overflow-auto py-4 px-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-purple-600 hover:bg-purple-500"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                    <div 
                      className="w-14 h-14 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: item.image.startsWith('#') ? item.image : '#9b87f5' }}
                    >
                      <span className="text-white font-bold text-xs">SS</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-purple-600 font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-2 w-2" />
                      </button>
                      <span className="w-5 text-center">{item.quantity}</span>
                      <button 
                        className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-2 w-2" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-600">Calculated at checkout</span>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-500 mb-2">
                Proceed to Checkout
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
