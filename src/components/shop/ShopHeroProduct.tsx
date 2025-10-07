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
  <ul className="grid gap-2 text-sm text-foreground/80">
    {items.map((it, i) => (
      <li key={i} className="flex items-center gap-2">
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="inline-grid grid-cols-[44px_auto_auto] items-center gap-2">
          <b className="px-2 py-1 rounded-md border border-primary text-primary font-extrabold text-center">{it.qty}×</b>
          <span className="font-semibold">{it.label}</span>
          <span className="text-muted-foreground">— {it.detail}</span>
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
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden max-w-4xl w-full mx-auto">
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
          <div className="absolute top-4 left-4 bg-card text-primary text-xs font-bold px-3 py-1 rounded-full shadow">
            {product.badge}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center justify-between mb-2">
          <Stars />
          <span className="text-sm text-muted-foreground font-medium">({product.ratingCount})</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
        <p className="text-muted-foreground mt-2">{product.subtitle}</p>
        <hr className="my-4 border-border" />

        <div className="md:flex md:items-start md:space-x-6">
          {/* Included */}
          <div className="md:w-1/2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              WHAT'S INCLUDED
            </h2>
            <IncludesList items={product.contents} />
            <div className="mt-3">
              <span className="inline-block bg-muted text-foreground text-xs font-semibold px-2 py-1 rounded-full">
                Total Rods: {totalRods}
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</p>
                  {product.compareAt && (
                    <p className="text-md text-muted-foreground line-through">
                      ${product.compareAt.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              {product.compareAt && (
                <div className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full text-center">
                  You Save ${(product.compareAt - product.price).toFixed(2)}!
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-4 h-12"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeroProduct;
