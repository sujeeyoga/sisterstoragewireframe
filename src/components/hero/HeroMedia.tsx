
import { useEffect, useState } from 'react';

const HeroMedia = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOutImage, setFadeOutImage] = useState(false);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const [fadeOutSecondImage, setFadeOutSecondImage] = useState(false);

  // Three-stage transition effect: Image 1 → Image 2 → Video
  useEffect(() => {
    const fadeFirstTimer = setTimeout(() => setFadeOutImage(true), 5000);
    const showSecondTimer = setTimeout(() => setShowSecondImage(true), 5500);
    const fadeSecondTimer = setTimeout(() => setFadeOutSecondImage(true), 10000);
    const videoTimer = setTimeout(() => setShowVideo(true), 10500);
    
    return () => {
      clearTimeout(fadeFirstTimer);
      clearTimeout(showSecondTimer);
      clearTimeout(fadeSecondTimer);
      clearTimeout(videoTimer);
    };
  }, []);

  return (
    <>
      {/* First Hero Image - slides in from left then fades out */}
      <img
        src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
        alt="Sister Storage lifestyle home organization scene showcasing beautiful storage solutions"
        className={`absolute inset-0 w-full h-full object-cover z-10 animate-slide-in-left transition-opacity duration-1000 ${
          fadeOutImage ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Second Hero Image - appears after first image fades */}
      {showSecondImage && (
        <img
          src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-43-scaled.jpg"
          alt="Sister Storage lifestyle home organization showcasing elegant storage solutions"
          className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
            fadeOutSecondImage ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Video - appears behind images after both fade */}
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
