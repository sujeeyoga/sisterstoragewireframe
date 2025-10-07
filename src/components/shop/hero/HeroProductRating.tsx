import React from "react";

interface HeroProductRatingProps {
  ratingCount: number;
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

const HeroProductRating: React.FC<HeroProductRatingProps> = ({ ratingCount }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <Stars />
      <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
        {ratingCount} REVIEWS
      </span>
    </div>
  );
};

export default HeroProductRating;
