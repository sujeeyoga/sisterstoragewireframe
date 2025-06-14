
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
      {/* Enhanced backdrop for text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-lg"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      <div 
        className="max-w-2xl text-center md:text-left relative z-10"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <AnimatedText
          as="span"
          className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-white text-[#E90064] rounded-full shadow-lg"
          animation="breath-fade-up-1"
        >
          Beautifully Organized
        </AnimatedText>
        
        {/* Improved line breaking and visual hierarchy */}
        <AnimatedText
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          animation="breath-fade-up-2"
          words
          style={{ 
            textShadow: '0 4px 8px rgba(0,0,0,0.7)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          }}
        >
          CULTURE / WITHOUT CLUTTER.
        </AnimatedText>
        
        <AnimatedText
          as="h3"
          className="text-xl md:text-3xl text-gray-100 mb-8 font-medium"
          animation="breath-fade-up-3"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
        >
          Designed by us — for us.
        </AnimatedText>
      </div>
      
      <div 
        className="max-w-2xl text-center md:text-left relative z-10"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        {/* Single prominent CTA button - removed duplication */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            className="px-8 py-6 text-lg w-full sm:w-auto group relative overflow-hidden transition-all duration-300 animate-breath-fade-up-4 bg-white text-black hover:bg-[#E90064] hover:text-white border-2 border-white hover:border-[#E90064] shadow-xl font-bold"
            asChild
          >
            <Link to="/shop" className="flex items-center justify-center gap-3">
              <ShoppingBag className="h-6 w-6" />
              <span className="relative z-10 transition-transform group-hover:translate-x-1">SHOP NOW</span>
              <span className="absolute inset-0 bg-[#E90064] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </Link>
          </Button>
        </div>
        
        <AnimatedText
          as="p"
          className="text-base md:text-lg text-gray-100 max-w-lg leading-relaxed"
          animation="breath-fade-up-5"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
        >
          Made by us, for us... By sisters, for sisters.<br />
          Clutter never had a place in our culture.
        </AnimatedText>
      </div>
    </div>
  );
};

export default HeroContent;
