import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after a short delay (faster for SEO)
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 600);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[hsl(var(--brand-pink))] flex items-center justify-center animate-fade-out"
      style={{
        animation: isVisible ? 'none' : 'fade-out 0.3s ease-out forwards'
      }}
    >
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          LOADING EXPERIENCE
        </h1>
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
