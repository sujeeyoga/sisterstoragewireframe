
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check, X } from 'lucide-react';

const ButtonDemonstration = () => {
  return (
    <div className="container-custom py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Sister Storage Button System</h2>
        <p className="text-gray-600">Consistent, elegant buttons following our design system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Primary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button>
              Default Button
            </Button>
            
            <Button size="sm">
              Small Button
            </Button>
            
            <Button size="lg">
              Large Button
            </Button>
            
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              With Icon
            </Button>
            
            <Button disabled>
              Disabled
            </Button>
          </div>
        </div>
        
        {/* Secondary Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">
              Default Button
            </Button>
            
            <Button variant="secondary" size="sm">
              Small Button
            </Button>
            
            <Button variant="secondary" size="lg">
              Large Button
            </Button>
            
            <Button variant="secondary">
              <Check className="mr-2 h-4 w-4" />
              With Icon
            </Button>
            
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </div>
      
      {/* Button Sizes Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      
      {/* Button with Icons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Button with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          
          <Button variant="secondary">
            Learn More
            <X className="ml-2 h-4 w-4" />
          </Button>
          
          <Button size="icon">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemonstration;
