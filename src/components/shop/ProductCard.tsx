
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductImage from "../product/ProductImage";

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
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-full">
      <Link to={`/shop/${product.id}`} className="block relative">
        <div className="relative overflow-hidden">
          {/* Product Image with 3:2 aspect ratio */}
          <div 
            className="aspect-[3/2] transition-transform duration-500 group-hover:scale-105 flex items-center justify-center"
            style={{ 
              backgroundColor: product.color,
            }}
          >
            <span className="text-white font-bold">Sister Storage</span>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              size="sm" 
              variant="buy"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Quick Add
            </Button>
          </div>
          
          {/* Bookmark button */}
          <Button 
            size="icon"
            variant="ghost" 
            className="absolute top-2 right-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast({
                title: "Saved",
                description: `${product.name} saved to your collection`,
              });
            }}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
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
        
        {/* All product information underneath */}
        <CardContent className="px-4 py-4">
          <div className="mb-2 flex justify-between items-start">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          {/* Material tag */}
          <div className="mb-3 text-sm text-gray-500">
            {product.material}
          </div>
          
          {/* Feature list */}
          {product.features.length > 0 && (
            <div className="text-sm text-gray-600 flex items-center gap-1 mb-3">
              <Check className="h-4 w-4 text-pink-600" /> {product.features[0]}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
