
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
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
  
  // Calculate total items and subtotal
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          console.log('Cart loaded from localStorage:', parsedCart);
          setItems(parsedCart);
        } else {
          console.warn('Invalid cart data in localStorage, clearing...');
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    try {
      console.log('Adding item to cart:', newItem);
      setItems(currentItems => {
        const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          console.log('Updated existing item quantity:', updatedItems[existingItemIndex]);
          return updatedItems;
        } else {
          // Item doesn't exist, add it
          const newCartItem = { ...newItem, quantity: 1 };
          console.log('Added new item to cart:', newCartItem);
          return [...currentItems, newCartItem];
        }
      });
      
      // Open cart when adding items
      setIsOpen(true);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  
  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
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
