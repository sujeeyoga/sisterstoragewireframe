

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
            <span className="text-[hsl(var(--brand-pink))] font-semibold uppercase tracking-wide text-xs">Process</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2 mb-3 tracking-tight">How It Works</h2>
            <p className="text-gray-600">
              Transform your space in three easy steps with our beautiful storage solutions
            </p>
          </div>
        </ScrollFadeContainer>
        
        <div className="px-4 md:px-0" role="region" aria-label="How it works horizontal scroll">
          <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
          {steps.map((step, index) => (
            <ScrollFadeContainer 
              key={step.id} 
              scrollFadeDirection="both" 
              threshold={0.2} 
              duration={0.8}
              delay={index * 0.15}
            >
              <article className="snap-start shrink-0 w-[75vw] sm:w-64 md:w-72 lg:w-80 aspect-square rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                <div className="relative w-full aspect-square overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundColor: step.color }} aria-hidden="true" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-white/80 text-[hsl(var(--brand-pink))] px-2.5 py-1 text-[11px] font-bold tracking-wide">
                      Step {step.id}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/50 via-black/10 to-transparent text-white">
                    <h3 className="text-base md:text-lg font-bold leading-snug">{step.title}</h3>
                    <p className="hidden sm:block text-xs md:text-sm opacity-90">{step.description}</p>
                  </div>
                </div>
              </article>
            </ScrollFadeContainer>
          ))}

          <ScrollFadeContainer scrollFadeDirection="both" threshold={0.3} duration={0.8} delay={0.45}>
            <article className="snap-start shrink-0 w-[75vw] sm:w-64 md:w-72 lg:w-80 aspect-square rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
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
    </div>
  );
};

export default HowItWorks;
