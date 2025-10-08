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
    <div className="relative w-full mx-auto" style={{ borderRadius: '0px' }}>
      {/* Background Image Container */}
      <div className="relative h-[70vh] min-h-[500px] md:min-h-[600px] overflow-hidden shadow-xl">
        <img 
          src={product.image} 
          alt={`${product.title} product image`} 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay Container */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        </div>
        
        {/* Badge Container */}
        {product.badge && <HeroProductBadge badge={product.badge} />}
        
        {/* Desktop: Shop Title Container (Left Side) */}
        <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 max-w-[400px]">
          <div className="text-white">
            <h1 className="text-6xl lg:text-7xl font-bold uppercase tracking-wider mb-4">
              Shop
            </h1>
            <p className="text-lg lg:text-xl text-white/90 font-light tracking-wide">
              Discover our curated collection
            </p>
          </div>
        </div>
        
        {/* Desktop: Floating Information Panel (Right Side) */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-[600px] max-w-[50%]">
          <div className="bg-white shadow-2xl p-8 flex gap-6 w-full" style={{ borderRadius: '0px' }}>
            {/* Left: Product Information */}
            <div className="flex-1 flex flex-col">
              {/* Rating Section */}
              <HeroProductRating ratingCount={product.ratingCount} />

              {/* Title Section */}
              <h1 className="text-xl lg:text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
                {product.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">{product.subtitle}</p>
              <hr className="my-4 border-border" />

              {/* Includes Section */}
              <HeroProductIncludes contents={product.contents} />
            </div>

            {/* Right: Buy Section */}
            <div className="flex-1 flex flex-col justify-center">
              <HeroProductPrice 
                price={product.price}
                compareAt={product.compareAt}
                onAddToCart={handleAddToCart}
                hideCompareAt={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Information Panel Below Image */}
      <div className="md:hidden bg-white p-6 shadow-lg" style={{ borderRadius: '0px' }}>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: Product Information */}
          <div className="flex-1">
            {/* Rating Section */}
            <HeroProductRating ratingCount={product.ratingCount} />

            {/* Title Section */}
            <h1 className="text-xl font-bold text-foreground uppercase tracking-wide mb-2">
              {product.title}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">{product.subtitle}</p>
            <hr className="my-4 border-border" />

            {/* Includes Section */}
            <HeroProductIncludes contents={product.contents} />
          </div>

          {/* Right: Buy Section */}
          <div className="flex-1 flex flex-col justify-center">
            <HeroProductPrice 
              price={product.price}
              compareAt={product.compareAt}
              onAddToCart={handleAddToCart}
              hideCompareAt={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeroProduct;
