import React from "react";
import { LaunchCard as LaunchCardType } from "@/types/launch-card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface LaunchCardProps {
  card: LaunchCardType;
}

const LaunchCard = ({ card }: LaunchCardProps) => {
  return (
    <article
      className="launch-card relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur-sm bg-white/10 border border-white/20 text-center shadow-xl"
      style={{
        "--c1": card.gradient_c1,
        "--c2": card.gradient_c2,
        "--c3": card.gradient_c3,
        "--blur": `${card.blur_level}px`,
        "--speed": `${card.shimmer_speed}s`,
      } as React.CSSProperties}
    >
      {/* Animated gradient background */}
      <div className="launch-card-gradient" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Launch date badge */}
        {card.launch_date && (
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide">
            Launching {format(new Date(card.launch_date), 'MMM d, yyyy')}
          </div>
        )}
        
        {/* Collection name */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-wide">
          {card.collection_name}
        </h2>
        
        {/* Tagline */}
        {card.tagline && (
          <p className="text-lg md:text-xl font-medium italic mb-4 opacity-90">
            {card.tagline}
          </p>
        )}
        
        {/* Description */}
        <p className="text-base mb-6 opacity-80 max-w-md mx-auto">
          {card.description}
        </p>
        
        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="bg-black text-white hover:bg-[#FF8021] transition-colors font-semibold uppercase tracking-wide"
        >
          <a href={card.waitlist_link} target="_blank" rel="noopener noreferrer">
            {card.cta_label}
          </a>
        </Button>
        
        {/* Preview link */}
        {card.preview_link && (
          <div className="mt-4">
            <a
              href={card.preview_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
            >
              View Preview
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default LaunchCard;
