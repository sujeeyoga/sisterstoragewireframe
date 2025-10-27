import React from "react";

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

interface HeroSectionProps {
  product: HeroProduct;
}

const HeroSection: React.FC<HeroSectionProps> = ({ product }) => {
  return (
    <section className="w-full bg-white">
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden py-16 px-1.5">
        <div className="max-w-full">
          <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-xl">
            <img 
              src={product.image} 
              alt="Shop Hero"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-2" style={{ textShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  Shop
                </h1>
                <p className="text-lg md:text-xl text-white font-light" style={{ textShadow: '0 6px 16px rgba(0, 0, 0, 0.3), 0 3px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15)' }}>
                  Discover our curated collection of beautiful storage solutions
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
            src={product.image} 
            alt="Shop Hero"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        
        {/* Text Content - Right Side */}
        <div className="flex items-center justify-center px-12 py-20 bg-background">
          <div className="max-w-xl">
            <h1 className="text-6xl xl:text-7xl font-black uppercase tracking-tight text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              Shop
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
              Discover our curated collection of beautiful storage solutions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
