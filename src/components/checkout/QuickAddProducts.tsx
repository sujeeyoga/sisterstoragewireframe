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

  // Get all available products (not in cart, in stock, visible, with images)
  const availableProducts = products
    .filter(p => p.inStock && p.visible)
    .filter(p => !cartItems.some(item => item.id === p.id))
    .filter(p => p.images && p.images.length > 0);

  const usedIds = new Set<string>();
  const recommendedProducts: typeof availableProducts = [];

  // Get top 3 bundles by price
  const bundles = availableProducts
    .filter(p => p.categories?.some(cat => cat.toLowerCase().includes('bundle')))
    .sort((a, b) => (b.price || 0) - (a.price || 0));
  
  for (const bundle of bundles) {
    if (recommendedProducts.length >= 3) break;
    if (!usedIds.has(bundle.id)) {
      recommendedProducts.push(bundle);
      usedIds.add(bundle.id);
    }
  }

  // If we don't have 3 bundles, fill with specific single items
  if (recommendedProducts.length < 3) {
    const singleItems = availableProducts
      .filter(p => !p.categories?.some(cat => cat.toLowerCase().includes('bundle')));

    // Priority: organizer, single rod, large box
    const priorityItems = [
      singleItems.find(p => {
        const name = p.name.toLowerCase();
        return !usedIds.has(p.id) && (name.includes('organizer') || name.includes('multipurpose'));
      }),
      singleItems.find(p => {
        const name = p.name.toLowerCase();
        return !usedIds.has(p.id) && name.includes('travel') && (name.includes('1') || name.includes('one'));
      }),
      singleItems.find(p => {
        const name = p.name.toLowerCase();
        return !usedIds.has(p.id) && name.includes('large') && name.includes('4');
      })
    ].filter(Boolean);

    for (const item of priorityItems) {
      if (recommendedProducts.length >= 3) break;
      if (item && !usedIds.has(item.id)) {
        recommendedProducts.push(item);
        usedIds.add(item.id);
      }
    }

    // Fill any remaining slots
    if (recommendedProducts.length < 3) {
      const remaining = singleItems
        .filter(p => !usedIds.has(p.id))
        .slice(0, 3 - recommendedProducts.length);
      recommendedProducts.push(...remaining);
    }
  }

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
        You might also like
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
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
