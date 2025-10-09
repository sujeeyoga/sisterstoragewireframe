import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
    });
    
    toast({
      title: "Processing purchase",
      description: `${product.title} added to your cart`,
    });
    
    navigate('/checkout');
  };

  return (
    <section className="w-full bg-white">
      {/* Hero Container */}
      <div className="py-16 md:py-20 px-1.5">
        {/* Featured Product Card */}
        <div className="max-w-full">
          <div className="grid md:grid-cols-[77fr,23fr] gap-8 md:gap-12 bg-gray-50 rounded-3xl overflow-hidden shadow-xl">
            {/* Image Side */}
            <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badge && <HeroProductBadge badge={product.badge} />}
              
              {/* Centered Shop Title */}
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,transparent_0%,white_100%)]">
                <div className="text-center">
                  <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[hsl(var(--brand-pink))] mb-2 drop-shadow-2xl">
                    Shop
                  </h1>
                  <p className="text-lg md:text-xl text-[hsl(var(--brand-pink))] font-light drop-shadow-lg">
                    Discover our curated collection of beautiful storage solutions
                  </p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
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

              {/* Includes */}
              <HeroProductIncludes contents={product.contents} />

              {/* Divider */}
              <hr className="border-gray-300" />

              {/* Price & CTA */}
              <HeroProductPrice 
                price={product.price}
                compareAt={product.compareAt}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                hideCompareAt={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHeroProduct;
