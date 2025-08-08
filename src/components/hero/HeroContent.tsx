
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from '@/components/ui/animated-text';

interface HeroContentProps {
  scrollPosition: number;
}

const HeroContent = ({ scrollPosition }: HeroContentProps) => {
  const progress = Math.min(scrollPosition / 600, 1);
  const scaleX = 1 - progress * 0.2; // shrink up to 20% horizontally as user scrolls

  return (
    <div className="w-full">
      <AnimatedText
        as="span"
        className="inline-block px-6 py-3 mb-6 text-sm font-bold bg-white text-[hsl(var(--brand-pink))] rounded-full shadow-lg"
        animation="breath-fade-up-1"
      >
        Beautifully Organized
      </AnimatedText>
      
      <AnimatedText
        as="h1"
        className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem] font-black text-white mb-3 leading-none tracking-tight"
        animation="breath-fade-up-2"
        words
      >
        CULTURE / WITHOUT CLUTTER.
      </AnimatedText>
      
      <AnimatedText
        as="h2"
        className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-10 mt-8 font-black leading-none tracking-tight"
        animation="breath-fade-up-3"
      >
        DESIGNED BY US — FOR US.
      </AnimatedText>

      <div className="flex flex-col sm:flex-row gap-8 mb-6">
        <Button 
          variant="buy"
          size="buy"
          className="w-full sm:w-1/2 animate-breath-fade-up-4"
          style={{ transform: `scaleX(${scaleX})` }}
          asChild
        >
          <Link to="/shop" className="flex items-center justify-center gap-2" aria-label="Shop Now">
            <ShoppingBag className="h-4 w-4" />
            <span>Shop Now</span>
          </Link>
        </Button>
      </div>
      
      <AnimatedText
        as="p"
        className="text-lg text-white max-w-xl leading-relaxed font-medium opacity-90"
        animation="breath-fade-up-5"
      >
        Made by us, for us... By sisters, for sisters.<br />
        Clutter never had a place in our culture.
      </AnimatedText>
    </div>
  );
};

export default HeroContent;
