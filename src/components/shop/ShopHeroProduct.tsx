import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import HeroProductBadge from "./hero/HeroProductBadge";
import HeroProductRating from "./hero/HeroProductRating";
import HeroProductIncludes from "./hero/HeroProductIncludes";
import HeroProductPrice from "./hero/HeroProductPrice";

interface HeroProductContent {
  qty: number;
  label: string;
  rodsEach: number;
  detail: string;
}

interface HeroProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  ratingCount: number;
  image: string;
  badge: string;
  contents: HeroProductContent[];
}

interface ShopHeroProductProps {
  product: HeroProduct;
}

const ShopHeroProduct: React.FC<ShopHeroProductProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  return (
    <div className="relative shadow-lg overflow-hidden max-w-6xl w-full mx-auto" style={{ borderRadius: '0px' }}>
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img 
          src={product.image} 
          alt={`${product.title} product image`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Badge Container */}
      {product.badge && <HeroProductBadge badge={product.badge} />}

      {/* Content Container */}
      <div className="relative z-10 min-h-[500px] md:min-h-[600px] grid md:grid-cols-2">
        {/* Left side - spacer */}
        <div className="hidden md:block" />
        
        {/* Right side - Information Panel */}
        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-center">
          {/* Rating Section */}
          <HeroProductRating ratingCount={product.ratingCount} />

          {/* Title Section */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide mb-2">
            {product.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">{product.subtitle}</p>
          <hr className="my-6 border-border" />

          {/* Includes Section */}
          <HeroProductIncludes contents={product.contents} />

          {/* Price & CTA Section */}
          <HeroProductPrice 
            price={product.price}
            compareAt={product.compareAt}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopHeroProduct;
