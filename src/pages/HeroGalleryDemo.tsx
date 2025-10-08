import { HeroGalleryDemo1, HeroGalleryDemo2, HeroGalleryDemo3 } from '@/components/hero/HeroGalleryDemo';
import { Gallery4 } from '@/components/ui/gallery4';
import { BentoGridGalleryDemo } from '@/components/ui/bento-gallery-demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroGalleryDemoPage = () => {
  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-[100] backdrop-blur-sm bg-background/80 rounded-lg p-1">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Demo 1 - Default Layout */}
      <section className="relative z-10 overflow-hidden" style={{ contain: "layout style paint" }}>
        <HeroGalleryDemo1 />
      </section>
      
      {/* Demo 2 - Four Cells */}
      <section className="relative z-20 overflow-hidden" style={{ contain: "layout style paint" }}>
        <HeroGalleryDemo2 />
      </section>
      
      {/* Demo 3 - Three Cells */}
      <section className="relative z-30 overflow-hidden" style={{ contain: "layout style paint" }}>
        <HeroGalleryDemo3 />
      </section>
      
      {/* Customer Stories Gallery */}
      <section className="relative bg-background pt-20 pb-10">
        <Gallery4 />
      </section>
      
      {/* Interactive Bento Gallery */}
      <section className="relative bg-background py-10">
        <BentoGridGalleryDemo />
      </section>
      
      {/* Footer Navigation */}
      <section className="relative bg-background py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Hero Gallery Animation Demos</h2>
        <p className="text-muted-foreground mb-6">
          Scroll through each section to see the different animation styles in action.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="default">Return to Home</Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">Shop Collection</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HeroGalleryDemoPage;