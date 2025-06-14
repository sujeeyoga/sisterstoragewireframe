
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
        className="max-w-2xl text-center md:text-left"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <AnimatedText
          as="span"
          className="inline-block px-4 py-1 mb-5 text-sm font-medium bg-white text-[#E90064] rounded-full"
          animation="breath-fade-up-1"
        >
          Beautifully Organized
        </AnimatedText>
        
        <AnimatedText
          as="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          animation="breath-fade-up-2"
          words
        >
          Culture Without Clutter.
        </AnimatedText>
        
        <AnimatedText
          as="h3"
          className="text-xl md:text-2xl text-gray-200 mb-6"
          animation="breath-fade-up-3"
        >
          Designed by us — for us.
        </AnimatedText>
      </div>
      
      {/* Full-width edge-to-edge image */}
      <div className="w-full mb-6 animate-breath-fade-up-4">
        <img
          src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg"
          alt="Sister Storage velvet bangle organization showcasing elegant jewelry storage solutions"
          className="w-full object-cover h-48 md:h-64"
        />
      </div>
      
      <div 
        className="max-w-2xl text-center md:text-left"
        style={{
          opacity: scrollPosition > 500 ? 0 : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button 
            className="px-6 py-5 text-base w-full sm:w-auto group relative overflow-hidden transition-all duration-300 animate-breath-fade-up-5"
            asChild
          >
            <Link to="/shop" className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="relative z-10 transition-transform group-hover:translate-x-1">BUY</span>
              <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            </Link>
          </Button>
        </div>
        
        <AnimatedText
          as="p"
          className="text-sm md:text-base text-gray-200 max-w-lg"
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
