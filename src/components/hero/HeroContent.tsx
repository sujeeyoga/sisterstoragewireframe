
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedText from '@/components/ui/animated-text';

interface HeroContentProps {
  scrollPosition: number;
}

const HeroContent = ({ scrollPosition }: HeroContentProps) => {
  return (
    <div className="container-custom relative h-full flex flex-col justify-center items-center md:items-start pt-20 z-20">
      <div 
        className="max-w-3xl text-center md:text-left relative z-10"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <AnimatedText
          as="span"
          className="inline-block px-6 py-3 mb-8 text-sm font-bold bg-white text-[#E90064] rounded-full"
          animation="breath-fade-up-1"
        >
          Beautifully Organized
        </AnimatedText>
        
        {/* Improved line breaking and enhanced visual hierarchy */}
        <AnimatedText
          as="h1"
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-10 leading-tight tracking-tight"
          animation="breath-fade-up-2"
          words
        >
          CULTURE / WITHOUT CLUTTER.
        </AnimatedText>
        
        <AnimatedText
          as="h3"
          className="text-2xl md:text-4xl text-white mb-12 font-semibold"
          animation="breath-fade-up-3"
        >
          Designed by us — for us.
        </AnimatedText>
      </div>
      
      <div 
        className="max-w-3xl text-center md:text-left relative z-10"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {/* Single prominent CTA button */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <Button 
            className="px-10 py-8 text-xl w-full sm:w-auto group relative overflow-hidden transition-all duration-300 animate-breath-fade-up-4 bg-white text-black hover:bg-[#E90064] hover:text-white border-4 border-white hover:border-[#E90064] font-black"
            asChild
          >
            <Link to="/shop" className="flex items-center justify-center gap-4">
              <ShoppingBag className="h-7 w-7" />
              <span className="relative z-10 transition-transform group-hover:translate-x-1">SHOP NOW</span>
              <span className="absolute inset-0 bg-[#E90064] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </Link>
          </Button>
        </div>
        
        <AnimatedText
          as="p"
          className="text-lg md:text-xl text-white max-w-2xl leading-relaxed font-medium"
          animation="breath-fade-up-5"
        >
          Made by us, for us... By sisters, for sisters.<br />
          Clutter never had a place in our culture.
        </AnimatedText>
      </div>
    </div>
  );
};

export default HeroContent;
