import React from 'react';
import { HeroGalleryDemo1, HeroGalleryDemo2, HeroGalleryDemo3 } from '@/components/hero/HeroGalleryDemo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroGalleryDemoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Demo 1 - Default Layout */}
      <HeroGalleryDemo1 />
      
      {/* Demo 2 - Four Cells */}
      <HeroGalleryDemo2 />
      
      {/* Demo 3 - Three Cells */}
      <HeroGalleryDemo3 />
      
      {/* Footer Navigation */}
      <div className="bg-background py-12 px-6 text-center">
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
      </div>
    </div>
  );
};

export default HeroGalleryDemoPage;