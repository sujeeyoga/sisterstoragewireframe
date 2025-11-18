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

  // Get 3 products that aren't already in cart or are bundles
  const recommendedProducts = products
    .filter(p => p.inStock)
    .filter(p => !cartItems.some(item => item.id === p.id))
    .sort((a, b) => {
      // Prioritize bundles and best sellers
      const aIsBundle = a.categories?.some(cat => cat.toLowerCase().includes('bundle'));
      const bIsBundle = b.categories?.some(cat => cat.toLowerCase().includes('bundle'));
      if (aIsBundle && !bIsBundle) return -1;
      if (!aIsBundle && bIsBundle) return 1;
      return (b.price || 0) - (a.price || 0); // Then by price
    })
    .slice(0, 3);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendedProducts.map((product) => {
          const isAdded = addedItems.has(product.id);
          const image = product.images?.[0];
          
          return (
            <Card 
              key={product.id} 
              className="p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {image && (
                  <img 
                    src={image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm font-semibold text-primary mb-2">
                    ${product.price?.toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    variant={isAdded ? "secondary" : "default"}
                    className="h-7 text-xs gap-1"
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdded}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAddProducts;
