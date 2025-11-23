
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Bookmark, Tag, AlertTriangle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productTaxonomyMap } from "@/data/product-taxonomy";
import { useStoreDiscount } from "@/hooks/useStoreDiscount";
import { useInventorySettings } from "@/hooks/useInventorySettings";
import { useShowSalePricing } from "@/hooks/useShowSalePricing";

import type { Product } from "@/types/product";


interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  const { discount, applyDiscount } = useStoreDiscount();
  const { lowStock, preorders, isLowStock, isOutOfStock, shouldShowProduct } = useInventorySettings();
  const { showSalePricing } = useShowSalePricing();
  const taxonomy = productTaxonomyMap[product.id] ?? undefined;
  const attrs = taxonomy?.attributes;
  
  // Prioritize product's own sale price over store-wide discount
  const hasProductSalePrice = product.salePrice && product.originalPrice && product.salePrice < product.originalPrice;
  const shouldApplyStoreDiscount = discount?.enabled && 
    !hasProductSalePrice && 
    product.slug !== 'multipurpose-box-1-large-box' &&
    product.slug !== 'jewelry-bag-organizer' &&
    product.slug !== 'jewelry-bag-organizer-7-removable-jewelry-pouches';
  
  const discountedPrice = shouldApplyStoreDiscount ? applyDiscount(product.price) : product.price;
  const displayOriginalPrice = hasProductSalePrice ? product.originalPrice : (shouldApplyStoreDiscount ? product.price : undefined);
  const hasDiscount = (hasProductSalePrice || shouldApplyStoreDiscount) && discountedPrice < (displayOriginalPrice || product.price);
  
  if (!shouldShowProduct(product.stockQuantity)) return null;
  
  const showLowStock = lowStock?.showBadge && isLowStock(product.stockQuantity);
  const showPreorder = preorders?.enabled && isOutOfStock(product.stockQuantity);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.images?.[0] || product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });

    setIsOpen(true);
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
                loading="eager"
                fetchPriority="high"
                decoding="async"
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
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300"></div>
          
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
            {showSalePricing && hasDiscount && displayOriginalPrice && (
              <Badge className="bg-green-600 text-white">
                <Tag className="h-3 w-3 mr-1" />
                {hasProductSalePrice 
                  ? `${Math.round(((displayOriginalPrice - discountedPrice) / displayOriginalPrice) * 100)}% OFF`
                  : `${discount.percentage}% OFF`
                }
              </Badge>
            )}
            {showLowStock && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Low Stock
              </Badge>
            )}
            {showPreorder && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {preorders?.badgeText}
              </Badge>
            )}
            {product.bestSeller && <Badge>Best Seller</Badge>}
            {product.newArrival && <Badge variant="secondary">New Arrival</Badge>}
            {product.limitedEdition && <Badge variant="destructive">Limited Edition</Badge>}
          </div>
        </div>
        
        {/* All product information underneath */}
        <CardContent className="px-4 py-4 flex flex-col h-full">
          {/* Title & Price - Fixed Height */}
          <div className="mb-2 flex justify-between items-start min-h-[5rem]">
            <h3 className="font-bold text-3xl lg:text-4xl line-clamp-2 flex-1 uppercase">{product.name}</h3>
            <div className="text-right flex-shrink-0 ml-2">
              {showSalePricing && hasDiscount && displayOriginalPrice ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground line-through">${displayOriginalPrice.toFixed(2)}</span>
                  <span className="font-bold text-2xl text-green-600">${discountedPrice.toFixed(2)}</span>
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
            {product.description && (
              <div 
                className="text-muted-foreground text-lg line-clamp-2"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
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
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                  <span className="text-2xl font-thin">{attrs.rodCount}</span>
                </div>
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
