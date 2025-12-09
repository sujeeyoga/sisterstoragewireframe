import React from "react";
import { Product } from "@/types/product";

interface HeroSectionProps {
  product: Product;
}

const HeroSection: React.FC<HeroSectionProps> = ({ product }) => {
  // Get the first image from the product
  const heroImage = product.images?.[0] || "";
  
  return (
    <section className="w-full bg-white">
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden py-16 px-1.5">
        <div className="max-w-full">
          <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-xl">
            <img 
              src={heroImage} 
              alt={`${product.name} - Bangle Storage Box`}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2" style={{ textShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  Bangle Storage Boxes
                </h1>
                <p className="text-lg md:text-xl text-white font-light px-4" style={{ textShadow: '0 6px 16px rgba(0, 0, 0, 0.3), 0 3px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15)' }}>
                  Dust-free, stackable organizers for your cultural jewelry
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-[600px]">
        {/* Image - Left Side */}
        <div className="relative overflow-hidden">
          <img 
            src={heroImage} 
            alt={`${product.name} - Bangle Storage Box`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        
        {/* Text Content - Right Side */}
        <div className="flex items-center justify-center px-12 py-20 bg-background">
          <div className="max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-black uppercase tracking-tight text-[hsl(var(--brand-pink))] mb-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              Bangle Storage Boxes
            </h1>
            <p className="text-xl text-[hsl(var(--brand-pink))] leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
              Dust-free, stackable organizers designed for your cultural jewelry collection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
