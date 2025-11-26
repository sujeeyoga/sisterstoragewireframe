import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useShowSalePricing } from "@/hooks/useShowSalePricing";
import { Product } from "@/types/product";

interface SingleProductCardProps {
  product: Product;
  priority?: boolean;
}

const SingleProductCard = ({ product, priority = false }: SingleProductCardProps) => {
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  
  // Get attributes from product taxonomy
  const rodCount = product.taxonomy?.attributes?.rodCount;
  const size = product.taxonomy?.attributes?.size;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      regularPrice: product.originalPrice,
      salePrice: product.originalPrice && product.price < product.originalPrice ? product.price : undefined,
      image: product.images?.[0] || product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });

    setIsOpen(true);
  };

  return (
    <div className="group h-full flex flex-col">
      <Link to={`/shop/${product.id}`} className="block flex-1 flex flex-col">
        {/* Product Image */}
        <div className="aspect-square mb-4 overflow-hidden rounded-sm bg-gray-50">
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-medium text-sm"
              style={{ backgroundColor: product.color || '#e5e7eb' }}
            >
              <span className="line-clamp-1 text-center px-2">{product.name}</span>
            </div>
          )}
        </div>
        
        {/* Product Info - Flex Layout */}
        <div className="flex-1 flex flex-col space-y-2">
          {/* Title - Fixed Height */}
          <div className="min-h-[5rem]">
            <h3 className="font-bold text-3xl lg:text-4xl text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 uppercase">
              {product.name}
            </h3>
          </div>
          
          {/* Attributes - Fixed Height */}
          <div className="min-h-[1.5rem] mb-2">
            {(rodCount || size) && (
              <div className="flex gap-2 text-sm text-gray-500">
                {rodCount && (
                  <span className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center">
                    {rodCount} rod{Array.isArray(rodCount) ? 's' : rodCount !== '1' ? 's' : ''}
                  </span>
                )}
                {size && (
                  <span className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center">
                    {size}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Price & Action - Fixed at Bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between h-10">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              
              <Button 
                size="sm" 
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-10 px-4 text-sm min-w-[5rem]"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleProductCard;