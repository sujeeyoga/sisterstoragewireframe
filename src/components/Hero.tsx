
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=1920&auto=format&fit=crop")', 
            backgroundPosition: `50% ${50 + scrollPosition * 0.05}%`,
            transition: 'background-position 0.1s ease-out'
          }}
        >
          <div 
            className="absolute inset-0 hero-gradient"
            style={{
              opacity: Math.max(0.6, 1 - scrollPosition * 0.001)
            }}
          ></div>
        </div>
        
        {/* Content with Fade In Effect */}
        <div className="container-custom relative h-full flex flex-col justify-center items-start pt-20">
          <div 
            className="max-w-2xl"
            style={{
              transform: `translateY(${Math.min(0, -20 + scrollPosition * 0.1)}px)`,
              opacity: Math.max(0.2, 1 - scrollPosition * 0.002)
            }}
          >
            <span className="inline-block px-4 py-1 mb-5 text-sm font-medium bg-purple-600 text-white rounded-full animate-fade-in">
              Beautifully Organized
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Organize<br />Beautifully with<br /><span className="text-purple-300">Sister Storage</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
              Our thoughtfully designed storage solutions bring both beauty and functionality to your space, transforming chaos into elegance with every box, tray, and organizer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="px-6 py-5 text-base w-full sm:w-auto group relative overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 transition-transform group-hover:translate-x-1">Shop Now</span>
                <span className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              </Button>
              <Button 
                variant="secondary" 
                className="px-6 py-5 text-base w-full sm:w-auto group"
              >
                <span className="flex items-center">
                  Learn Our Story 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator with enhanced bounce */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce"
          style={{
            opacity: Math.max(0, 1 - scrollPosition * 0.005)
          }}
        >
          <span className="text-white text-sm font-medium mb-2">Discover</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Story Highlight Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div 
            className={`transition-all duration-700 transform ${storyVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
              Our Story
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
