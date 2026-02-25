import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CultureBagPromoProps {
  variant?: "shop" | "homepage";
}

const CultureBagPromo: React.FC<CultureBagPromoProps> = ({ variant = "shop" }) => {
  const isHomepage = variant === "homepage";
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section
      className={
        isHomepage
          ? "py-16 md:py-24 bg-white overflow-hidden"
          : "w-full bg-[#F0F4F1]"
      }
      style={!isHomepage ? { borderRadius: "0px" } : undefined}
    >
      <div className={isHomepage ? "max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12" : "container-custom py-8 md:py-12"}>
        {/* Header */}
        {isHomepage && (
          <div className="text-center mb-10 md:mb-14">
            <p className="text-sm font-medium text-[hsl(var(--brand-pink))] uppercase tracking-widest mb-2">
              New Product
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight">
              Culture Bag
            </h2>
          </div>
        )}

        {!isHomepage && (
          <header className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold text-[hsl(var(--brand-pink))] uppercase tracking-widest mb-1">
                New
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                Culture Bag
              </h2>
              <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                Saree storage, designed with intention
              </p>
            </div>
          </header>
        )}

        {/* Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center ${isHomepage ? "lg:grid-cols-3" : ""}`}>
          {/* Image */}
          <Link to="/culture-bag" className="block rounded-2xl overflow-hidden group">
            <img
              src="/lovable-uploads/culture-bag-front.jpeg"
              alt="Culture Bag for Sarees — cotton blend organizer with clear window"
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Video (homepage only) */}
          {isHomepage && (
            <div className="rounded-2xl overflow-hidden relative">
              {!videoLoaded && (
                <div className="aspect-[4/3] bg-muted animate-pulse rounded-2xl" />
              )}
              <video
                src="/lovable-uploads/culture-bag-teaser.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[4/3] object-cover rounded-2xl"
                onLoadedData={() => setVideoLoaded(true)}
              />
            </div>
          )}

          {/* Text + CTA */}
          <div className="space-y-5">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              For Sarees
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-tight">
              Make Space For Culture.
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              A cotton blend organizer with a clear front window and back compartment
              for blouses, underskirts, and matching pieces. Structured, stackable,
              and closet-friendly.
            </p>

            {!isHomepage && (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-foreground">From $24.50</span>
                <span className="text-sm text-muted-foreground">/ bundle of 5</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button asChild size="lg" className="font-bold uppercase tracking-wide">
                <Link to="/culture-bag">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CultureBagPromo;
