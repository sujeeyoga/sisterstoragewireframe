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
    <div className="relative w-full bg-white">
      <div className="container-custom py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left: Shop Title */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider mb-4 text-foreground">
              Shop
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground font-light tracking-wide">
              Discover our curated collection
            </p>
          </div>
          
          {/* Right: Image Container */}
          <div className="flex-1 relative h-[400px] md:h-[500px] w-full overflow-hidden shadow-xl">
            <img 
              src={product.image} 
              alt={`${product.title} product image`} 
              className="w-full h-full object-cover"
            />
            
            {/* Badge Container */}
            {product.badge && <HeroProductBadge badge={product.badge} />}
          </div>
        </div>
        
        {/* Product Information Panel Below */}
        <div className="bg-gray-50 p-6 md:p-8 mt-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Product Information */}
            <div className="flex-1">
              {/* Rating Section */}
              <HeroProductRating ratingCount={product.ratingCount} />

              {/* Title Section */}
              <h2 className="text-xl lg:text-2xl font-bold text-foreground uppercase tracking-wide mb-2">
                {product.title}
              </h2>
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
    </div>
  );
};

export default ShopHeroProduct;
