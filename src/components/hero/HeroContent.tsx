
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroContentProps {
  scrollPosition: number;
}

const HeroContent = ({ scrollPosition }: HeroContentProps) => {
  const progress = Math.min(scrollPosition / 600, 1);
  const scaleX = 1 - progress * 0.2; // shrink up to 20% horizontally as user scrolls

  return (
    <div className="w-full">
      <span className="inline-block px-6 py-3 mb-6 text-sm font-bold bg-white text-[hsl(var(--brand-pink))] rounded-full shadow-lg">
        Beautifully Organized
      </span>
      
      <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem] font-black text-white mb-3 leading-none tracking-tight">
        CULTURE <span className="text-3xl md:text-4xl lg:text-[4.5rem] xl:text-[6rem] 2xl:text-[7rem] mx-4 md:mx-5 lg:mx-6">/</span> WITHOUT CLUTTER.
      </h1>
      
      <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-10 mt-8 font-black leading-none tracking-tight">
        BROUGHT TO YOU BY SISTERS WHO GET IT.
      </h2>

      <div className="flex flex-col items-center gap-8 mb-6">
        <Button 
          variant="buy"
          size="buy"
          style={{ transform: `scaleX(${scaleX})` }}
          asChild
        >
          <Link to="/shop" className="flex items-center gap-2" aria-label="Shop the Drop">
            <ShoppingBag className="h-4 w-4" />
            <span>Shop the Drop</span>
          </Link>
        </Button>
      </div>
      
      <p className="text-lg text-white max-w-xl leading-relaxed font-medium opacity-90">
        Made by sisters, for sisters.<br />
        Clutter never had a place in our culture.
      </p>
    </div>
  );
};

export default HeroContent;
