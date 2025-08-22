
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
      <div className="flex flex-col items-center space-y-2">
        <div className="text-white text-sm font-medium tracking-wider uppercase">
          Scroll
        </div>
        <ArrowDown 
          className="h-6 w-6 text-[hsl(var(--brand-pink))] animate-bounce" 
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default ScrollIndicator;
