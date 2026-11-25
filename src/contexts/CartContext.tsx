
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { refreshCartPrices } from '@/lib/cartCatalog';

// Versions migrate saved items rather than clearing customers’ carts.
const CART_VERSION = 3;

export type CartItem = {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;  // Original price before any sale
  salePrice?: number;     // Sale price if product is on sale
  image: string;
  quantity: number;
  description?: string;
  sleeve?: string;
  attributes?: {
    rodCount?: string | string[];
    size?: string | string[];
    useCase?: string[];
    bundleSize?: string;
  };
  category?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string, sleeve?: string) => void;
  updateQuantity: (itemId: string, quantity: number, sleeve?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  
  // Calculate total items and subtotal
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    localStorage.setItem('cart_version', CART_VERSION.toString());

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setHydrated(true);
  }, []);

  // Refresh on load and when shoppers return to their tab; do not overwrite edits in flight.
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('id, slug, name, price, regular_price, sale_price');
      if (!cancelled && !error && data) {
        setItems(current => refreshCartPrices(current, data));
      }
    };
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    void refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    if (hydrated) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, hydrated]);
  
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    try {
      setItems(currentItems => {
        const existingItemIndex = currentItems.findIndex(item => 
          item.id === newItem.id && item.sleeve === newItem.sleeve
        );
        
        if (existingItemIndex > -1) {
          // Item exists with same sleeve, update quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          return updatedItems;
        } else {
          // Item doesn't exist or has different sleeve, add it
          const newCartItem = { ...newItem, quantity: 1 };
          return [...currentItems, newCartItem];
        }
      });
      
      // Open cart when adding items
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  
  const removeItem = (itemId: string, sleeve?: string) => {
    setItems(currentItems => currentItems.filter(item => 
      !(item.id === itemId && item.sleeve === sleeve)
    ));
  };
  
  const updateQuantity = (itemId: string, quantity: number, sleeve?: string) => {
    if (quantity < 1) {
      removeItem(itemId, sleeve);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        (item.id === itemId && item.sleeve === sleeve) ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
