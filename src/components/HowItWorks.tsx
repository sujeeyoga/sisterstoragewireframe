
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollFadeContainer from './ui/scroll-fade-container';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: "Bangles, But Make It Organized",
    description: "Slide, snap, and go. It's that easy.",
    color: "#E90064"
  },
  {
    id: 2,
    title: "No More Ziplocks",
    description: "Your bangles deserve better. We made it happen.",
    color: "#FF8021"
  },
  {
    id: 3,
    title: "Stack. Seal. Style.",
    description: "The easiest way to keep your bangles in check.",
    color: "#FFDCBD"
  }
];

const HowItWorks = () => {
  return (
    <div className="w-full">{/* Spacing controlled by Section wrapper */}
      <div className="container-custom">
        <ScrollFadeContainer scrollFadeDirection="both" threshold={0.2} duration={0.8}>
          <div className="text-center max-w-lg mx-auto mb-12 md:mb-16 px-4">
            <span className="text-[#E90064] font-medium">Simple Process</span>
            <h2 className="font-bold mt-2 mb-3">How It Works</h2>
            <p className="text-gray-600">
              Transform your space in three easy steps with our beautiful storage solutions
            </p>
          </div>
        </ScrollFadeContainer>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 px-4 md:px-0">
          {steps.map((step, index) => (
            <ScrollFadeContainer 
              key={step.id} 
              scrollFadeDirection="both" 
              threshold={0.2} 
              duration={0.8}
              delay={index * 0.2}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#FFDCBD] flex items-center justify-center mb-2">
                    <span className="text-[#FF8021] font-bold">{step.id}</span>
                  </div>
                  <div className="absolute top-1/2 left-full h-0.5 bg-[#FFDCBD] w-full -translate-y-1/2 hidden md:block" 
                       style={{ display: step.id === steps.length ? 'none' : undefined }}></div>
                </div>
                
                <div 
                  className="h-48 w-full rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-white font-bold">Step {step.id}</span>
                </div>
                
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                <div className="mt-4 flex items-center justify-center text-[#E90064]">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Easy & Intuitive</span>
                </div>
              </div>
            </ScrollFadeContainer>
          ))}
        </div>
        
        <ScrollFadeContainer scrollFadeDirection="both" threshold={0.3} duration={0.8} delay={0.4}>
          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/about">Learn More About Our Process</Link>
            </Button>
          </div>
        </ScrollFadeContainer>
      </div>
    </div>
  );
};

export default HowItWorks;
