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

  // Only show the first card
  const featuredCard = launchCards?.[0];

  return (
    <section className="w-full bg-[#FFF0F5]" style={{ borderRadius: '0px' }}>
      <div className="container-custom py-8 md:py-12">
        {isLoading ? (
          <Skeleton className="h-64 rounded-3xl max-w-6xl mx-auto" />
        ) : featuredCard ? (
          <LaunchCard card={featuredCard} />
        ) : null}
      </div>
    </section>
  );
};

export default LaunchCardsSection;
