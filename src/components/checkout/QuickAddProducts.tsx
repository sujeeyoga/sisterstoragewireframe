import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';

const QuickAddProducts = () => {
  const { addItem, items: cartItems } = useCart();
  const { data: products, isLoading } = useProducts();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [dismissedProducts, setDismissedProducts] = useState<Set<string>>(new Set());
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Show loading state instead of returning null
  if (isLoading) {
    return (
      <div className="mt-6 mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          You might also like
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products) return null;

  // Get all available products that could be recommended
  // Priority order: Individual organizers first, then bundles
  const allRecommendations = [
    // Individual Organizers (Priority 1-4)
    products.find(p => 
      p.name.toLowerCase().includes('jewelry') && 
      p.name.toLowerCase().includes('bag') &&
      p.inStock && 
      p.visible
    ),
    products.find(p => 
      p.name.toLowerCase().includes('large') && 
      p.name.toLowerCase().includes('bangle') &&
      p.name.toLowerCase().includes('box') &&
      !p.name.toLowerCase().includes('set') &&
      !p.name.toLowerCase().includes('bundle') &&
      p.inStock && 
      p.visible
    ),
    products.find(p => 
      p.name.toLowerCase().includes('medium') && 
      p.name.toLowerCase().includes('bangle') &&
      p.name.toLowerCase().includes('box') &&
      !p.name.toLowerCase().includes('set') &&
      !p.name.toLowerCase().includes('bundle') &&
      p.inStock && 
      p.visible
    ),
    products.find(p => 
      p.name.toLowerCase().includes('travel') && 
      p.name.toLowerCase().includes('bangle') &&
      !p.name.toLowerCase().includes('set') &&
      !p.name.toLowerCase().includes('bundle') &&
      p.inStock && 
      p.visible
    ),
    
    // Bundles (Priority 5-7)
    products.find(p => 
      p.name.toLowerCase().includes('starter') && 
      p.name.toLowerCase().includes('set') &&
      p.inStock && 
      p.visible
    ),
    products.find(p => 
      p.name.toLowerCase().includes('together') && 
      p.name.toLowerCase().includes('bundle') &&
      p.inStock && 
      p.visible
    ),
    products.find(p => 
      (p.name.toLowerCase().includes('complete') || p.name.toLowerCase().includes('family')) && 
      p.name.toLowerCase().includes('set') &&
      p.inStock && 
      p.visible
    ),
  ].filter(Boolean); // Remove any undefined products

  if (allRecommendations.length === 0) return null;

  // Find first product that's not in cart and not dismissed
  let recommendedProduct = allRecommendations.find(p => 
    !cartItems.some(item => item.id === p!.id) &&
    !dismissedProducts.has(p!.id)
  );

  // If all products are dismissed or in cart, show the first available product anyway
  if (!recommendedProduct) {
    recommendedProduct = allRecommendations[0];
  }

  const recommendedProducts = [recommendedProduct];

  const handleDismiss = (productId: string) => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setDismissedProducts(prev => new Set(prev).add(productId));
      setIsAnimatingOut(false);
    }, 300);
  };

  const handleAddToCart = (product: typeof recommendedProducts[0]) => {
      const imageUrl = typeof product.images?.[0] === 'string' 
        ? product.images[0] 
        : (product.images?.[0] as any)?.src || (product.images?.[0] as any)?.thumbnail || '';
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        regularPrice: product.originalPrice,
        salePrice: product.originalPrice && product.price && product.price < product.originalPrice ? product.price : undefined,
        image: imageUrl,
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
      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
        <span className="text-[hsl(var(--brand-pink))]">✨</span> Complete Your Order
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {recommendedProducts.map((product) => {
          const isAdded = addedItems.has(product.id);
          
          let imageUrl = '';
          const firstImage = product.images?.[0];
          
          if (typeof firstImage === 'string') {
            imageUrl = firstImage;
          } else if (firstImage && typeof firstImage === 'object') {
            const imgObj = firstImage as any;
            imageUrl = imgObj.src || imgObj.thumbnail || imgObj.url || '';
          }
          
          return (
            <div 
              key={product.id} 
              className={`flex gap-3 items-center bg-gradient-to-r from-background to-secondary/20 p-3 rounded-lg border border-border relative transition-all duration-300 ${
                isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
              }`}
            >
              {/* Dismiss button */}
              <button
                onClick={() => handleDismiss(product.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors z-10"
                aria-label="Dismiss recommendation"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
              
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl, 'for product:', product.name);
                      // Hide broken image, show fallback background
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-xs">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[hsl(var(--brand-pink))]">
                    ${product.price?.toFixed(2)}
                  </p>
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <>
                      <p className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                      <span className="text-xs font-semibold text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10 px-1.5 py-0.5 rounded">
                        {Math.round(((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant={isAdded ? "secondary" : "default"}
                className="h-9 px-4 gap-1.5 flex-shrink-0 bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAddProducts;
