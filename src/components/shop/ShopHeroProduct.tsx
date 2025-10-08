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
    <section className="w-full bg-white">
      {/* Hero Container */}
      <div className="container-custom py-16 md:py-20">
        {/* Page Title */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-gray-900 mb-4">
            Shop
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover our curated collection of beautiful storage solutions
          </p>
        </div>

        {/* Featured Product Card */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-gray-50 rounded-3xl overflow-hidden shadow-xl">
            {/* Image Side */}
            <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badge && <HeroProductBadge badge={product.badge} />}
            </div>

            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
              {/* Rating */}
              <HeroProductRating ratingCount={product.ratingCount} />

              {/* Title */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase mb-3">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Price & CTA */}
              <HeroProductPrice 
                price={product.price}
                compareAt={product.compareAt}
                onAddToCart={handleAddToCart}
                hideCompareAt={true}
              />

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Includes */}
              <HeroProductIncludes contents={product.contents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHeroProduct;
