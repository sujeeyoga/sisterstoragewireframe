
import { useEffect, useState } from 'react';

const HeroMedia = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOutImage, setFadeOutImage] = useState(false);

  // Image to video transition effect
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOutImage(true), 5000);
    const videoTimer = setTimeout(() => setShowVideo(true), 6000);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <>
      {/* Hero Image - slides in from left then fades out */}
      <img
        src="/lovable-uploads/97e7d7c7-5536-4d18-9887-90897337430d.png"
        alt="Two sisters organizing traditional clothing and jewelry together"
        className={`absolute inset-0 w-full h-full object-cover z-10 animate-slide-in-left transition-opacity duration-1000 ${
          fadeOutImage ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Video - appears behind image after fade */}
      {showVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Solid Color Background Fallback */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundColor: '#E90064',
        }}
      />
    </>
  );
};

export default HeroMedia;
