
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  color: string;
  features: string[];
  material: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <Card key={product.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <Link to={`/shop/${product.id}`} className="block">
        <div className="relative">
          <div 
            className="aspect-square transition-transform duration-300 group-hover:scale-105 flex items-center justify-center"
            style={{ backgroundColor: product.color }}
          >
            <span className="text-white font-bold">Sister Storage</span>
          </div>
          
          {/* Product badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <Badge className="bg-amber-500 text-white">Best Seller</Badge>
            )}
            {product.newArrival && (
              <Badge className="bg-green-500 text-white">New Arrival</Badge>
            )}
            {product.limitedEdition && (
              <Badge className="bg-red-500 text-white">Limited Edition</Badge>
            )}
            {product.stock <= 5 && (
              <Badge className="bg-gray-700 text-white">Only {product.stock} left</Badge>
            )}
          </div>
        </div>
        
        <CardContent className="pt-4">
          <div className="mb-1 flex justify-between items-start">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          
          {/* Material tag */}
          <div className="mb-2 text-xs text-gray-500">
            {product.material}
          </div>
          
          {/* Feature list */}
          <ul className="mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                <Check className="h-3 w-3 text-pink-600" /> {feature}
              </li>
            ))}
          </ul>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
