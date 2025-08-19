import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "./ProductCard";

interface DualProductCardProps {
  products: [Product, Product?]; // Array with 1 or 2 products
}

const DualProductCard = ({ products }: DualProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
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

  const ProductContent = ({ product }: { product: Product }) => (
    <div className="flex-1 space-y-3">
      {/* Product Image */}
      <Link to={`/shop/${product.id}`} className="block group">
        <div 
          className="aspect-square rounded-lg overflow-hidden"
          style={{ backgroundColor: product.color }}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform duration-300">
            Sister Storage
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
          ))}
        </div>
        
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-600 line-clamp-2">
          {product.description || "Premium storage solution for your jewelry collection"}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="h-7 px-3 text-xs"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingBag className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <ProductContent product={products[0]} />
          
          {products[1] && (
            <>
              <div className="w-px bg-gray-200 my-2" />
              <ProductContent product={products[1]} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DualProductCard;