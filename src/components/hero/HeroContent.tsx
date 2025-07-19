
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from '@/components/ui/animated-text';

interface HeroContentProps {
  scrollPosition: number;
}

const HeroContent = ({ scrollPosition }: HeroContentProps) => {
  return (
    <div className="w-full">
      <AnimatedText
        as="span"
        className="inline-block px-6 py-3 mb-8 text-sm font-bold bg-white text-[#E90064] rounded-full shadow-lg"
        animation="breath-fade-up-1"
      >
        Beautifully Organized
      </AnimatedText>
      
      <AnimatedText
        as="h1"
        className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight"
        animation="breath-fade-up-2"
        words
      >
        CULTURE / WITHOUT CLUTTER.
      </AnimatedText>
      
      <AnimatedText
        as="h3"
        className="text-xl md:text-2xl lg:text-3xl text-white mb-8 font-semibold"
        animation="breath-fade-up-3"
      >
        Designed by us — for us.
      </AnimatedText>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Button 
          className="px-8 py-6 text-lg w-full sm:w-auto group relative overflow-hidden transition-all duration-300 animate-breath-fade-up-4 bg-white text-black hover:bg-[#E90064] hover:text-white border-4 border-white hover:border-[#E90064] font-black shadow-xl hover:shadow-2xl"
          asChild
        >
          <Link to="/shop" className="flex items-center justify-center gap-4">
            <ShoppingBag className="h-6 w-6" />
            <span className="relative z-10 transition-transform group-hover:translate-x-1">SHOP NOW</span>
            <span className="absolute inset-0 bg-[#E90064] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
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
