
import { Button } from '@/components/ui/button';

const ButtonDemonstration = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-[#E90064] font-medium">Button System</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Sister Storage Button System</h2>
          <p className="text-gray-600">
            Our consistent button system designed for elegance and functionality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
          {/* Primary Buttons */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Primary Buttons</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Default Primary</p>
                <Button>Primary Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Primary Small</p>
                <Button size="sm">Small Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Primary Large</p>
                <Button size="lg">Large Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Primary Full Width</p>
                <Button size="full">Full Width Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Primary Disabled</p>
                <Button disabled>Disabled Button</Button>
              </div>
            </div>
          </div>
          
          {/* Secondary Buttons */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Secondary Buttons</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Default Secondary</p>
                <Button variant="secondary">Secondary Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Secondary Small</p>
                <Button variant="secondary" size="sm">Small Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Secondary Large</p>
                <Button variant="secondary" size="lg">Large Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Secondary Full Width</p>
                <Button variant="secondary" size="full">Full Width Button</Button>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Secondary Disabled</p>
                <Button variant="secondary" disabled>Disabled Button</Button>
              </div>
            </div>
          </div>
          
          {/* Button Specifications */}
          <div className="border border-gray-200 rounded-lg p-6 md:col-span-2">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">Button Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Primary Button Style</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Background: Black (#000000)</li>
                  <li>Text: White (#FFFFFF)</li>
                  <li>Font: Poppins Semi-Bold, ALL CAPS</li>
                  <li>Hover: Orange background (#FF8021)</li>
                  <li>Active: Scale compress 0.98x</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Secondary Button Style</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Background: Transparent</li>
                  <li>Text: Pink (#E90064)</li>
                  <li>Border: 1px Pink (#E90064)</li>
                  <li>Hover: Filled pink background (#E90064) with white text</li>
                  <li>Active: Scale compress 0.98x</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Disabled Button Style</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Background: Light Gray (#F4F4F4)</li>
                  <li>Text: Muted Gray (#B8B0A8)</li>
                  <li>Cursor: not-allowed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Size & Spacing Settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Padding: 14px top/bottom, 24px left/right</li>
                  <li>Border Radius: 4px</li>
                  <li>Mobile: Full width option available</li>
                  <li>Desktop: Auto width by default</li>
                  <li>Font: Poppins Semi-Bold, ALL CAPS</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ButtonDemonstration;
