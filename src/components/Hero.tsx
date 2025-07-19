
import { useEffect, useState } from 'react';
import HeroMedia from './hero/HeroMedia';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import StorySection from './hero/StorySection';

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
        <div className="container-custom relative h-full flex flex-col lg:flex-row items-center justify-between pt-20 lg:pt-24 z-20 gap-12 lg:gap-8">
          {/* Hero Image with White Container - Above title on mobile, beside on desktop */}
          <div className="flex-1 flex justify-center lg:justify-end items-center px-4 lg:px-8 order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] w-full transform hover:scale-[1.02] transition-all duration-500 ease-out hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.4)]">
              <div className="aspect-square overflow-hidden rounded-2xl mb-6 lg:mb-8 shadow-lg relative group">
                <img
                  src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
                  alt="Sister Storage lifestyle organization"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl lg:text-2xl font-black text-[#E90064] tracking-tight leading-tight">BEAUTIFUL ORGANIZATION</h3>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed font-medium">
                  Transform your space with our thoughtfully designed storage solutions. Made by sisters, for sisters.
                </p>
              </div>
            </div>
          </div>
          
          {/* Hero Content - Below image on mobile, beside on desktop */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start order-2 lg:order-1 px-4 lg:px-0">
            <HeroContent scrollPosition={scrollPosition} />
          </div>
        </div>
        
        <ScrollIndicator scrollPosition={scrollPosition} />
      </div>
      
      <StorySection storyVisible={storyVisible} />
    </>
  );
};

export default Hero;
