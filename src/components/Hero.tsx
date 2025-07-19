
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
        <div className="container-custom relative h-full flex flex-col lg:flex-row items-center justify-between pt-20 z-20">
          {/* Hero Image with White Container - Above title on mobile, beside on desktop */}
          <div className="flex-1 flex justify-center lg:justify-end items-center px-4 lg:px-8 mb-8 lg:mb-0 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] max-w-md w-full transform hover:scale-[1.02] transition-all duration-500 ease-out">
              <div className="aspect-square overflow-hidden rounded-2xl mb-8 shadow-lg">
                <img
                  src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
                  alt="Sister Storage lifestyle organization"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-[#E90064] mb-3 tracking-tight">BEAUTIFUL ORGANIZATION</h3>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  Transform your space with our thoughtfully designed storage solutions. Made by sisters, for sisters.
                </p>
              </div>
            </div>
          </div>
          
          {/* Hero Content - Below image on mobile, beside on desktop */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start order-2 lg:order-1">
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
