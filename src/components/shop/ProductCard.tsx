
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productTaxonomyMap } from "@/data/product-taxonomy";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  color: string;
  images?: string[];
  features: string[];
  material: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  stock: number;
  sku?: string;
  caption?: string;
  funnelStage?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const taxonomy = productTaxonomyMap[product.id] ?? undefined;
  const attrs = taxonomy?.attributes;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.color
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
            className="aspect-square transition-transform duration-500 group-hover:scale-105 overflow-hidden"
          >
            {product.images && product.images[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: product.color }}
              >
                <span className="text-background font-bold">Sister Storage</span>
              </div>
            )}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              variant="buy"
              size="sm"
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
            className="absolute top-2 right-2 rounded-full bg-background/70 hover:bg-background opacity-0 group-hover:opacity-100 transition-all duration-300"
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
              <Badge>Best Seller</Badge>
            )}
            {product.newArrival && (
              <Badge variant="secondary">New Arrival</Badge>
            )}
            {product.limitedEdition && (
              <Badge variant="destructive">Limited Edition</Badge>
            )}
            {product.stock <= 5 && (
              <Badge variant="outline">Only {product.stock} left</Badge>
            )}
          </div>
        </div>
        
        {/* All product information underneath */}
        <CardContent className="px-4 py-4 flex flex-col h-full">
          {/* Title & Price - Fixed Height */}
          <div className="mb-2 flex justify-between items-start min-h-[5rem]">
            <h3 className="font-bold text-3xl lg:text-4xl line-clamp-2 flex-1 uppercase">{product.name}</h3>
            <div className="text-right flex-shrink-0 ml-2">
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="font-bold text-2xl text-[hsl(var(--primary))]">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-bold text-2xl">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          {/* Sister Caption - Fixed Height */}
          <div className="min-h-[2rem] mb-2">
            {product.caption && (
              <p className="text-[hsl(var(--primary))] text-lg font-medium italic line-clamp-1">"{product.caption}"</p>
            )}
          </div>
          
          {/* Description - Fixed Height */}
          <div className="h-[3rem] mb-3">
            <p className="text-muted-foreground text-lg line-clamp-2">{product.description}</p>
          </div>
          
          {/* Material - Fixed Height */}
          <div className="h-[1.5rem] mb-3 text-sm text-muted-foreground">
            {product.material}
          </div>
          
          {/* Feature - Fixed Height */}
          <div className="h-[1.5rem] mb-3">
            {product.features.length > 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Check className="h-4 w-4 text-[hsl(var(--primary))]" /> 
                <span className="line-clamp-1">{product.features[0]}</span>
              </div>
            )}
          </div>
          
          {/* Rod Count - Fixed Height */}
          <div className="min-h-[4rem] mb-3 flex justify-center">
            {attrs?.rodCount && (
              <div className="inline-flex flex-col items-center bg-[hsl(var(--primary))] text-primary-foreground rounded-lg px-3 py-2">
                <span className="text-xs font-medium">RODS</span>
                <span className="text-2xl font-bold">{attrs.rodCount}</span>
              </div>
            )}
          </div>
          
          {/* Attribute Chips - Fixed Height */}
          <div className="min-h-[2rem] mb-3">
            {attrs && (
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const chips: React.ReactNode[] = [];
                  const push = (label: string, vals?: unknown) => {
                    const arr = Array.isArray(vals) ? vals : vals ? [vals] : [];
                    arr.forEach((v, i) =>
                      chips.push(
                        <Badge key={`${label}-${String(v)}-${i}`} variant="outline" className="text-xs h-6 px-2">
                          {label}: {String(v)}
                        </Badge>
                      )
                    );
                  };
                  push("Size", attrs.size);
                  push("Use", attrs.useCase);
                  push("Bundle", attrs.bundleSize);
                  return chips;
                })()}
              </div>
            )}
          </div>
          
          {/* Bottom Section - Fixed at Bottom */}
          <div className="mt-auto space-y-2">
            {/* SKU - Fixed Height */}
            <div className="min-h-[1rem]">
              {product.sku && (
                <div className="text-xs text-muted-foreground">
                  SKU: {product.sku}
                </div>
              )}
            </div>
            
            {/* Category Badge - Fixed Height */}
            <div className="flex justify-between items-center h-8">
              <Badge variant="outline" className="h-6 px-3">{product.category}</Badge>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
