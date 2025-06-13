
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
        <HeroMedia />
        <HeroContent scrollPosition={scrollPosition} />
        <ScrollIndicator scrollPosition={scrollPosition} />
      </div>
      
      <StorySection storyVisible={storyVisible} />
    </>
  );
};

export default Hero;
