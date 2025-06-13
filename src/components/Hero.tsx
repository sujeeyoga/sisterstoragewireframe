
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '@/components/ui/animated-text';

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [storyVisible, setStoryVisible] = useState(false);
  
  // New state for image/video transition
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOutImage, setFadeOutImage] = useState(false);

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
      <div className="relative h-screen w-full overflow-hidden bg-[#E90064]">
        {/* Hero Image - slides in from left then fades out */}
        <img
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          alt="Sister Storage Hero"
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
        
        {/* Content with Fixed Position - No Movement */}
        <div className="container-custom relative h-full flex flex-col justify-center items-center md:items-start pt-20 z-20">
          <div 
            className="max-w-2xl text-center md:text-left"
            style={{
              opacity: scrollPosition > 500 ? 0 : 1,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <AnimatedText
              as="span"
              className="inline-block px-4 py-1 mb-5 text-sm font-medium bg-white text-[#E90064] rounded-full"
              animation="breath-fade-up-1"
            >
              Beautifully Organized
            </AnimatedText>
            
            <AnimatedText
              as="h1"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              animation="breath-fade-up-2"
              words
            >
              Culture Without Clutter.
            </AnimatedText>
            
            <AnimatedText
              as="h3"
              className="text-xl md:text-2xl text-gray-200 mb-6"
              animation="breath-fade-up-3"
            >
              Designed by us — for us.
            </AnimatedText>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button 
                className="px-6 py-5 text-base w-full sm:w-auto group relative overflow-hidden transition-all duration-300 animate-breath-fade-up-4"
                asChild
              >
                <Link to="/shop" className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">BUY</span>
                  <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                </Link>
              </Button>
            </div>
            
            <AnimatedText
              as="p"
              className="text-sm md:text-base text-gray-200 max-w-lg"
              animation="breath-fade-up-5"
            >
              Made by us, for us... By sisters, for sisters.<br />
              Clutter never had a place in our culture.
            </AnimatedText>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator - Fixed Position */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer animate-breath-fade-up-5 z-20"
          style={{
            opacity: scrollPosition > 200 ? 0 : 1,
            transition: 'opacity 0.3s ease-out'
          }}
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <span className="text-white text-sm font-medium mb-2">Discover More</span>
          <div className="flex items-center justify-center">
            <ArrowDown className="h-8 w-8 text-white animate-bounce" />
          </div>
        </div>
      </div>

      {/* Story Highlight Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          <div 
            className={`transition-all duration-700 transform ${storyVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          >
            <AnimatedText
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8"
              animation="breath-fade-up"
              words
            >
              By Sisters, For Sisters
            </AnimatedText>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#FF8021] h-64 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">Sister Storage</span>
              </div>
              <div className="space-y-4">
                <AnimatedText
                  as="p"
                  className="text-lg text-gray-700 leading-relaxed"
                  animation="breath-fade-up-2"
                >
                  Sister Storage was created for the women who celebrate their culture boldly, 
                  live beautifully, and organize powerfully. We believe in honoring our traditions 
                  while designing for our modern lives.
                </AnimatedText>
                
                <AnimatedText
                  as="p"
                  className="text-lg text-gray-700 leading-relaxed font-medium italic"
                  animation="breath-fade-up-3"
                >
                  "Designed with love, built for everyday beauty."
                </AnimatedText>
                
                <Button 
                  variant="secondary" 
                  className="px-6 py-5 text-base group mt-4 animate-breath-fade-up-4"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="flex items-center">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
