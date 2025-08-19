import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "./ProductCard";

interface SingleProductCardProps {
  product: Product;
}

const SingleProductCard = ({ product }: SingleProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="group">
      <Link to={`/shop/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square mb-4 overflow-hidden rounded-sm">
          <div 
            className="w-full h-full flex items-center justify-center text-white font-medium text-sm transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: product.color }}
          >
            {product.name}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 text-xs"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleProductCard;