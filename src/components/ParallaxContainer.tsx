import React, { useEffect, useState } from 'react';

const ParallaxContainer = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[100vh] overflow-hidden">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 w-full h-[120%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg)',
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />
      
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
      
      {/* Content overlay (if needed) */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white">
          {/* Add any content here if needed */}
        </div>
      </div>
    </div>
  );
};

export default ParallaxContainer;