
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
        
        <div className="px-4 md:px-0 columns-2 gap-4 sm:gap-6 [column-fill:_balance]">
          {steps.map((step, index) => (
            <ScrollFadeContainer 
              key={step.id} 
              scrollFadeDirection="both" 
              threshold={0.2} 
              duration={0.8}
              delay={index * 0.15}
            >
              <article className="mb-6 break-inside-avoid rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                <div className="p-6 text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFDCBD' }}>
                    <span className="text-[#FF8021] font-bold">{step.id}</span>
                  </div>
                  <div 
                    className={`${index === 0 ? 'h-40 md:h-72' : index === 1 ? 'h-36 md:h-56' : 'h-44 md:h-64'} w-full rounded-lg mb-4 flex items-center justify-center text-white font-bold`}
                    style={{ backgroundColor: step.color }}
                  >
                    Step {step.id}
                  </div>
                  
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  <div className="mt-4 flex items-center justify-center text-[hsl(var(--brand-pink))]">
                    <Check className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Easy & Intuitive</span>
                  </div>
                </div>
              </article>
            </ScrollFadeContainer>
          ))}

          <ScrollFadeContainer scrollFadeDirection="both" threshold={0.3} duration={0.8} delay={0.45}>
            <article className="mb-6 break-inside-avoid rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl mb-3">Learn More About Our Process</h3>
                <p className="text-gray-600 mb-4">See how we design, test, and refine for sisters everywhere.</p>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </article>
          </ScrollFadeContainer>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
