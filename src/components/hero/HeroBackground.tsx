import heroMainImage from '@/assets/hero-bg-main.jpg';

interface HeroBackgroundProps {
  isMobile?: boolean;
  offset?: number;
}

export const HeroBackground = ({ isMobile = false, offset = 0 }: HeroBackgroundProps) => {
  if (isMobile) {
    return (
      <div className="w-full h-[70vh] overflow-hidden -mb-64">
        <img
          src={heroMainImage}
          alt="Woman showcasing Sister Storage jewelry organization solution"
          className="w-full h-full object-cover"
          style={{ transform: `translateY(${-offset}px)` }}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] h-[100%] overflow-hidden animate-[slide-in-right_1.2s_ease-out]">
      <img
        src={heroMainImage}
        alt="Woman showcasing Sister Storage jewelry organization solution"
        className="w-full h-full object-contain object-right"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
};
