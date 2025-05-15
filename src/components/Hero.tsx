
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=1920&auto=format&fit=crop")', 
          backgroundPosition: '50% 50%' 
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative h-full flex flex-col justify-center items-start pt-20">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-block px-4 py-1 mb-5 text-sm font-medium bg-purple-600 text-white rounded-full">
            Beautifully Organized
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Organize<br />Beautifully with<br /><span className="text-purple-300">Sister Storage</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
            Our thoughtfully designed storage solutions bring both beauty and functionality to your space, transforming chaos into elegance with every box, tray, and organizer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-purple-600 hover:bg-white hover:text-purple-600 text-white px-6 py-5 text-base w-full sm:w-auto transition-colors">
              Explore Storage Solutions
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-5 text-base w-full sm:w-auto">
              Learn Our Story <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-white text-sm font-medium mb-2">Discover</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
