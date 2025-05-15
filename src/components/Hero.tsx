
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [storyVisible, setStoryVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check if we've scrolled enough to show the story section
      if (window.scrollY > window.innerHeight * 0.5) {
        setStoryVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden bg-[#E90064]">
        {/* Solid Color Background Instead of Image */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: '#E90064',
          }}
        >
        </div>
        
        {/* Content with Fade and Float Effect */}
        <div className="container-custom relative h-full flex flex-col justify-center items-center md:items-start pt-20">
          <div 
            className="max-w-2xl text-center md:text-left"
            style={{
              transform: `translateY(${Math.min(0, -20 + scrollPosition * 0.1)}px)`,
              opacity: Math.max(0.2, 1 - scrollPosition * 0.002)
            }}
          >
            <span className="inline-block px-4 py-1 mb-5 text-sm font-medium bg-white text-[#E90064] rounded-full animate-fade-in">
              Beautifully Organized
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Culture Without Clutter.
            </h1>
            <h3 className="text-xl md:text-2xl text-white/90 mb-6">
              Designed by us — for us.
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                className="px-6 py-5 text-base w-full sm:w-auto group relative overflow-hidden transition-all duration-300"
                asChild
              >
                <Link to="/shop" className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">BUY</span>
                  <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                </Link>
              </Button>
            </div>
            <p className="text-sm md:text-base text-white/90 max-w-lg">
              Made by us, for us... By sisters, for sisters.<br />
              Clutter never had a place in our culture.
            </p>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          style={{
            opacity: Math.max(0, 1 - scrollPosition * 0.005)
          }}
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <span className="text-white text-sm font-medium mb-2">Discover More</span>
          <div className="relative h-12 w-6 border-2 border-white rounded-full flex justify-center">
            <div className="absolute top-2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Story Highlight Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div 
            className={`transition-all duration-700 transform ${storyVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
              By Sisters, For Sisters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg bg-[#FF8021] h-64 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">Sister Storage</span>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sister Storage was created for the women who celebrate their culture boldly, 
                  live beautifully, and organize powerfully. We believe in honoring our traditions 
                  while designing for our modern lives.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                  "Designed with love, built for everyday beauty."
                </p>
                <Button 
                  variant="secondary" 
                  className="px-6 py-5 text-base group mt-4"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="flex items-center">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
