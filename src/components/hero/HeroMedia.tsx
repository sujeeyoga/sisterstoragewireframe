
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
      <div className="absolute inset-0 z-10">
        <img
          src="https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png"
          alt="Sister Storage lifestyle home organization scene showcasing beautiful storage solutions"
          className={`absolute inset-0 w-full h-full object-cover animate-slide-in-left transition-opacity duration-1000 ${
            fadeOutImage ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Second Hero Image - appears after first image fades */}
      {showSecondImage && (
        <div className="absolute inset-0 z-10">
          <img
            src="https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png"
            alt="Sister Storage lifestyle home organization showcasing elegant storage solutions"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              fadeOutSecondImage ? 'opacity-0' : 'opacity-100'
            }`}
            loading="eager"
          />
        </div>
      )}

      {/* Video - appears behind images after both fade */}
      {showVideo && (
        <div className="absolute inset-0 z-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Solid Color Background Fallback */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundColor: 'hsl(var(--brand-pink))',
        }}
      />
    </>
  );
};

export default HeroMedia;
