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
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-out overflow-hidden"
      style={{
        backgroundColor: '#F00881',
        animation: isVisible ? 'none' : 'fade-out 0.3s ease-out forwards'
      }}
    >
      {/* White shimmer effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          animation: 'shimmer 2s infinite',
          transform: 'translateX(-100%)'
        }}
      />
      
      <div className="text-center animate-fade-in relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          SISTER STORAGE
        </h1>
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
