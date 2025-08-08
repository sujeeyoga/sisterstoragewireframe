
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
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer animate-breath-fade-up-5 z-20"
      style={{
        opacity: scrollPosition > 200 ? 0 : 1,
        transition: 'opacity 0.3s ease-out'
      }}
      onClick={handleScrollDown}
    >
      
    </div>
  );
};

export default ScrollIndicator;
