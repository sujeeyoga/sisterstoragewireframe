import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';

const QuickAddProducts = () => {
  const { addItem, items: cartItems } = useCart();
  const { data: products, isLoading } = useProducts();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  if (isLoading || !products) return null;

  // Filter available products that aren't in cart and have images
  const availableProducts = products
    .filter(p => p.inStock)
    .filter(p => !cartItems.some(item => item.id === p.id))
    .filter(p => p.images && p.images.length > 0);

  // Top 3: High-value items (bundles or expensive items) sorted by price descending
  const highValueProducts = availableProducts
    .filter(p => {
      const isBundle = p.categories?.some(cat => cat.toLowerCase().includes('bundle'));
      const isHighValue = (p.price || 0) >= 30;
      return isBundle || isHighValue;
    })
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 3);

  // Bottom 3: Low-value single items sorted by price ascending (cheapest first)
  const lowValueProducts = availableProducts
    .filter(p => {
      const isBundle = p.categories?.some(cat => cat.toLowerCase().includes('bundle'));
      const isLowValue = (p.price || 0) < 30;
      return !isBundle && isLowValue;
    })
    .sort((a, b) => (a.price || 0) - (b.price || 0))
    .slice(0, 3);

  // Combine and ensure we have 6 products total
  let recommendedProducts = [...highValueProducts, ...lowValueProducts];
  
  // If we don't have 6 products, fill with remaining available products
  if (recommendedProducts.length < 6) {
    const usedIds = new Set(recommendedProducts.map(p => p.id));
    const remaining = availableProducts
      .filter(p => !usedIds.has(p.id))
      .slice(0, 6 - recommendedProducts.length);
    recommendedProducts = [...recommendedProducts, ...remaining];
  }

  if (recommendedProducts.length === 0) return null;

  const handleAddToCart = (product: typeof recommendedProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.images?.[0] || '',
    });
    
    setAddedItems(prev => new Set(prev).add(product.id));
    
    // Remove from added state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        You might also like
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
        {recommendedProducts.map((product) => {
          const isAdded = addedItems.has(product.id);
          const image = product.images?.[0];
          
          return (
            <div key={product.id} className="flex flex-col gap-2">
              {image && (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <Button
                size="sm"
                variant={isAdded ? "secondary" : "default"}
                className="w-full h-9 text-xs gap-1.5"
                onClick={() => handleAddToCart(product)}
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </>
                )}
              </Button>
              <p className="text-xs font-semibold text-primary text-center">
                ${product.price?.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAddProducts;
