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
      <div className="container-custom py-16 md:py-20 lg:py-24">
        {/* Top Section: Shop Title + Image */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-16">
          {/* Left: Shop Title */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6 text-gray-900">
              Shop
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
              Discover our curated collection of beautiful storage solutions
            </p>
          </div>
          
          {/* Right: Image Container */}
          <div className="flex-1 w-full">
            <div className="relative h-[450px] md:h-[550px] overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src={product.image} 
                alt={`${product.title} product image`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Badge Container */}
              {product.badge && <HeroProductBadge badge={product.badge} />}
            </div>
          </div>
        </div>
        
        {/* Product Information Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Product Information */}
            <div className="flex-1 space-y-6">
              {/* Rating Section */}
              <HeroProductRating ratingCount={product.ratingCount} />

              {/* Title Section */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-wide mb-3">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">{product.subtitle}</p>
              </div>
              
              <hr className="border-gray-300" />

              {/* Includes Section */}
              <HeroProductIncludes contents={product.contents} />
            </div>

            {/* Right: Buy Section */}
            <div className="flex-1 flex flex-col justify-center bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100">
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
