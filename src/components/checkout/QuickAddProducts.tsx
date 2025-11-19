import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';

const QuickAddProducts = () => {
  const { addItem, items: cartItems } = useCart();
  const { data: products, isLoading } = useProducts();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [showBundles, setShowBundles] = useState(false);

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

  // Alternate between bundles and individual products every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBundles(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!products) return null;

  // Get individual rod products (not bundles)
  const individualProducts = products
    .filter(p => p.inStock && p.visible)
    .filter(p => !cartItems.some(item => item.id === p.id))
    .filter(p => p.images && p.images.length > 0)
    .filter(p => !p.name.toLowerCase().includes('bundle'));

  // Priority individual products: Travel, Medium, Large
  const individualRecommended: typeof individualProducts = [];
  
  const travel = individualProducts.find(p => 
    p.name.toLowerCase().includes('travel') && p.name.toLowerCase().includes('bangle')
  );
  if (travel) individualRecommended.push(travel);
  
  const medium = individualProducts.find(p => 
    p.name.toLowerCase().includes('medium') && p.name.toLowerCase().includes('bangle')
  );
  if (medium) individualRecommended.push(medium);
  
  const large = individualProducts.find(p => 
    p.name.toLowerCase().includes('large') && p.name.toLowerCase().includes('bangle')
  );
  if (large) individualRecommended.push(large);

  // Get bundle products
  const bundleProducts = products
    .filter(p => p.inStock && p.visible)
    .filter(p => !cartItems.some(item => item.id === p.id))
    .filter(p => p.images && p.images.length > 0)
    .filter(p => p.name.toLowerCase().includes('bundle'))
    .slice(0, 3);

  // Choose which set to display
  const recommendedProducts = showBundles ? bundleProducts : individualRecommended;

  // Show nothing if no products available
  if (recommendedProducts.length === 0) return null;

  const handleAddToCart = (product: typeof recommendedProducts[0]) => {
      const imageUrl = typeof product.images?.[0] === 'string' 
        ? product.images[0] 
        : (product.images?.[0] as any)?.src || (product.images?.[0] as any)?.thumbnail || '';
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price || 0,
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
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {showBundles ? 'Bundle Deals' : 'You might also like'}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3 animate-fade-in" key={showBundles ? 'bundles' : 'individual'}>
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
            <div key={product.id} className="flex flex-col gap-2">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
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
              <div className="text-center space-y-1">
                <p className="text-xs font-medium text-foreground line-clamp-2">
                  {product.name}
                </p>
                <p className="text-xs font-semibold text-primary">
                  ${product.price?.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAddProducts;
