
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeCard from '@/components/ui/theme-card';
import { ArrowRight, ShoppingBag, Truck, Info } from 'lucide-react';
import AnimatedText from '@/components/ui/animated-text';

const BrandComponents = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container-custom">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins"
          animation="breath-fade-up"
        >
          Modular Components
        </AnimatedText>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Enhanced Button Styles */}
          <Card style={{ borderRadius: '0px' }}>
            <CardHeader>
              <CardTitle className="font-poppins">Enhanced Button System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Primary Buttons */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Primary Buttons</h4>
                <div className="flex flex-wrap gap-4">
                  <Button className="font-poppins" style={{ borderRadius: '0px' }} iconLeft={<ShoppingBag />}>
                    Primary with Icon
                  </Button>
                  <Button variant="primary-inverse" className="font-poppins" style={{ borderRadius: '0px' }} iconRight={<ArrowRight />}>
                    Primary Inverse
                  </Button>
                  <Button variant="secondary" className="font-poppins" style={{ borderRadius: '0px' }}>
                    Secondary Button
                  </Button>
                  <Button variant="outline" className="font-poppins" style={{ borderRadius: '0px' }}>
                    Outline Button
                  </Button>
                </div>
              </div>

              {/* Ghost Buttons */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Ghost Buttons with Icons</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="ghost-pink" className="font-poppins" style={{ borderRadius: '0px' }} iconRight={<ArrowRight />}>
                    Ghost Pink
                  </Button>
                  <Button variant="ghost-orange" className="font-poppins" style={{ borderRadius: '0px' }} iconLeft={<Truck />}>
                    Ghost Orange
                  </Button>
                  <Button variant="ghost-black" className="font-poppins" style={{ borderRadius: '0px' }} iconLeft={<Info />}>
                    Ghost Black
                  </Button>
                </div>
              </div>

              {/* Brand Color Buttons */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Brand Color Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="pink" className="font-poppins" style={{ borderRadius: '0px' }} iconRight={<ArrowRight />}>
                    Sister Pink
                  </Button>
                  <Button variant="orange" className="font-poppins" style={{ borderRadius: '0px' }} iconLeft={<Truck />}>
                    Sister Orange
                  </Button>
                  <Button variant="gold" className="font-poppins" style={{ borderRadius: '0px' }}>
                    Sister Gold
                  </Button>
                  <Button variant="peach" className="font-poppins" style={{ borderRadius: '0px' }}>
                    Sister Peach
                  </Button>
                </div>
              </div>
              
              {/* Usage Guidelines */}
              <div className="mt-6 p-4 bg-gray-50" style={{ borderRadius: '0px' }}>
                <h4 className="font-semibold mb-2 text-sm font-poppins">Enhanced Usage Guidelines:</h4>
                <ul className="text-sm space-y-1 font-poppins text-gray-700">
                  <li><strong>Primary (Black):</strong> Main actions with optional left/right icons</li>
                  <li><strong>Primary Inverse (White):</strong> Use on dark backgrounds or colored sections</li>
                  <li><strong>Ghost Variants:</strong> Subtle actions that become solid on hover</li>
                  <li><strong>Brand Colors:</strong> Use Sister Pink/Orange for promotional content</li>
                  <li><strong>Icons:</strong> Use arrow-right, shopping-bag, truck, or info icons</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Systematic Theme Components */}
          <Card style={{ borderRadius: '0px' }}>
            <CardHeader>
              <CardTitle className="font-poppins">Systematic Theme Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Promotional Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Promotional Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="LIMITED OFFER"
                    description="Save 25% on your first Sister Storage collection."
                    buttonLabel="SHOP NOW →"
                    theme="promotion"
                  />
                  <ThemeCard
                    title="CUSTOMER FAVORITE"
                    description="Our most-loved storage solution for modern homes."
                    buttonLabel="LEARN MORE →"
                    theme="promotion"
                  />
                </div>
              </div>

              {/* Action Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Action Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="FREE DELIVERY"
                    description="Get your products delivered free on orders over $75."
                    buttonLabel="DELIVERY INFO →"
                    theme="action"
                  />
                  <ThemeCard
                    title="QUICK SETUP"
                    description="Assembly-free storage solutions ready in minutes."
                    buttonLabel="GET STARTED →"
                    theme="action"
                  />
                </div>
              </div>

              {/* Neutral Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Neutral Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="DESIGN PHILOSOPHY"
                    description="Culture without clutter. Modern storage with heritage."
                    buttonLabel="OUR STORY →"
                    theme="neutral"
                  />
                  <ThemeCard
                    title="QUALITY ASSURED"
                    description="Premium materials and craftsmanship in every piece."
                    buttonLabel="WARRANTY →"
                    theme="neutral"
                  />
                </div>
              </div>

              {/* Testimonial Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Testimonial Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="Priya S."
                    description="Beautiful storage that celebrates my culture while keeping my home organized."
                    theme="testimonial"
                    author="Priya S."
                  />
                  <ThemeCard
                    title="Zara M."
                    description="Finally, storage solutions that understand my lifestyle and heritage."
                    theme="testimonial"
                    author="Zara M."
                  />
                </div>
              </div>

              {/* Success Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Success Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="ORDER CONFIRMED"
                    description="Your Sister Storage collection is on its way!"
                    buttonLabel="TRACK ORDER →"
                    theme="success"
                  />
                  <ThemeCard
                    title="REVIEW SUBMITTED"
                    description="Thank you for sharing your experience with us!"
                    buttonLabel="VIEW REVIEWS →"
                    theme="success"
                  />
                </div>
              </div>

              {/* Info Theme */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Informational Theme</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ThemeCard
                    title="CARE INSTRUCTIONS"
                    description="Simple maintenance tips to keep your storage beautiful."
                    buttonLabel="LEARN MORE →"
                    theme="info"
                  />
                  <ThemeCard
                    title="SIZE GUIDE"
                    description="Find the perfect storage size for your space."
                    buttonLabel="SIZE GUIDE →"
                    theme="info"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandComponents;
