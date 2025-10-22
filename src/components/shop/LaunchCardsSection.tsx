import React from "react";
import { useLaunchCards } from "@/hooks/useLaunchCards";
import LaunchCard from "./LaunchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteTexts } from "@/hooks/useSiteTexts";

const LaunchCardsSection = () => {
  const { data: launchCards, isLoading } = useLaunchCards();
  const { getText } = useSiteTexts();
  
  const launchText = getText('shop_launch_cards');
  
  // Don't render section if no cards
  if (!isLoading && (!launchCards || launchCards.length === 0)) {
    return null;
  }

  return (
    <section className="w-full bg-[#FFF0F5]" style={{ borderRadius: '0px' }}>
      <div className="container-custom py-8 md:py-12">
        <header className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
              {launchText?.title || 'Upcoming Collections'}
            </h2>
            <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
              {launchText?.subtitle || 'Be the first to know when we launch'}
            </p>
          </div>
        </header>
        
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {launchCards?.map((card) => (
              <LaunchCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LaunchCardsSection;
