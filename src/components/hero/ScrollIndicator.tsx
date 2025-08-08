
import { ArrowDown } from 'lucide-react';

interface ScrollIndicatorProps {
  scrollPosition: number;
}

const ScrollIndicator = ({ scrollPosition }: ScrollIndicatorProps) => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer animate-breath-fade-up-5 z-20 lg:left-1/4"
      style={{
        opacity: scrollPosition > 200 ? 0 : 1,
        transition: 'opacity 0.3s ease-out'
      }}
      onClick={handleScrollDown}
    >
      <span className="text-white text-base md:text-lg font-medium text-center">Discover More</span>
    </div>
  );
};

export default ScrollIndicator;
