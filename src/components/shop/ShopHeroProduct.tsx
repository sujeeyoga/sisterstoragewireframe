import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

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

const Stars: React.FC = () => (
  <div className="flex text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.445a1 1 0 00-1.175 0l-3.365 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path>
      </svg>
    ))}
  </div>
);

const IncludesList: React.FC<{ items: HeroProductContent[] }> = ({ items }) => (
  <ul className="grid gap-3 text-sm text-foreground">
    {items.map((it, i) => (
      <li key={i} className="flex items-center gap-3">
        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="inline-grid grid-cols-[48px_auto_auto] items-center gap-2.5">
          <b className="px-2 py-1.5 border-2 border-brand-pink text-brand-pink font-extrabold text-center uppercase" style={{ borderRadius: '0px' }}>{it.qty}×</b>
          <span className="font-bold uppercase text-xs tracking-wide">{it.label}</span>
          <span className="text-muted-foreground text-xs">— {it.detail}</span>
        </span>
      </li>
    ))}
  </ul>
);

const ShopHeroProduct: React.FC<ShopHeroProductProps> = ({ product }) => {
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  
  const totalRods = product.contents.reduce((sum, c) => sum + c.qty * c.rodsEach, 0);

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
    <div className="bg-card shadow-lg overflow-hidden max-w-4xl w-full mx-auto" style={{ borderRadius: '0px' }}>
      {/* Image */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={product.image} 
            alt={`${product.title} product image`} 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        {product.badge && (
          <div className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-bold uppercase px-4 py-2 shadow-md" style={{ borderRadius: '0px' }}>
            {product.badge}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6 md:p-8">
        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <Stars />
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            {product.ratingCount} REVIEWS
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide mb-2">
          {product.title}
        </h1>
        <p className="text-muted-foreground mt-2 text-base">{product.subtitle}</p>
        <hr className="my-6 border-border" />

        <div className="md:flex md:items-start md:space-x-8">
          {/* Included */}
          <div className="md:w-1/2">
            <h2 className="text-xs font-bold text-brand-pink uppercase tracking-widest mb-4 letter-spacing-[0.1em]">
              WHAT'S INCLUDED
            </h2>
            <IncludesList items={product.contents} />
            <div className="mt-4">
              <span className="inline-block bg-brand-gray text-foreground text-xs font-bold uppercase px-3 py-1.5 tracking-wide" style={{ borderRadius: '0px' }}>
                TOTAL: {totalRods} RODS
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="bg-brand-gray p-5" style={{ borderRadius: '0px' }}>
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-baseline space-x-3">
                  <p className="text-3xl md:text-4xl font-bold text-foreground">${product.price.toFixed(2)}</p>
                  {product.compareAt && (
                    <p className="text-lg text-muted-foreground line-through">
                      ${product.compareAt.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              {product.compareAt && (
                <div className="bg-brand-orange text-white text-sm font-bold uppercase px-4 py-2 text-center tracking-wide" style={{ borderRadius: '0px' }}>
                  SAVE ${(product.compareAt - product.price).toFixed(2)}!
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-4 h-12 bg-brand-black hover:bg-brand-orange text-white font-bold uppercase tracking-wide transition-colors"
              onClick={handleAddToCart}
              style={{ borderRadius: '0px' }}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              ADD TO CART
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3 uppercase tracking-wide">
              Free shipping on orders $75+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeroProduct;
