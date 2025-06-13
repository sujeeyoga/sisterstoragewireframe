
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Star, Heart } from 'lucide-react';
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
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Button Styles */}
          <Card style={{ borderRadius: '0px' }}>
            <CardHeader>
              <CardTitle className="font-poppins">Button Styles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button className="bg-black text-white hover:bg-[#FF8021] px-6 py-3 font-semibold font-poppins" style={{ borderRadius: '0px' }}>
                  Primary Button
                </Button>
                <Button variant="secondary" className="border-[#E90064] text-[#E90064] hover:bg-[#E90064] px-6 py-3 font-semibold font-poppins" style={{ borderRadius: '0px' }}>
                  Secondary Button
                </Button>
                <Button variant="outline" className="border-black text-black hover:bg-black px-6 py-3 font-semibold font-poppins" style={{ borderRadius: '0px' }}>
                  Outline Button
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Component Examples */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Delivery Card */}
            <Card className="p-6" style={{ borderRadius: '0px' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#FF8021]" />
                  <h3 className="font-bold text-lg font-poppins">Free Delivery</h3>
                </div>
                <p className="text-sm text-gray-600 font-poppins">
                  Get your Sister Storage products delivered free on orders over $75.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-black text-white font-poppins" style={{ borderRadius: '0px' }}>
                    DELIVERY INFO →
                  </Button>
                  <Button variant="outline" size="sm" className="font-poppins" style={{ borderRadius: '0px' }}>
                    TRACK ORDER
                  </Button>
                </div>
              </div>
            </Card>

            {/* Testimonial Card */}
            <Card className="p-6" style={{ borderRadius: '0px' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFA51E] text-[#FFA51E]" />
                  ))}
                </div>
                <p className="text-sm italic text-gray-700 font-poppins">
                  "Perfect blend of beauty and practicality. These storage solutions honor my heritage while keeping my modern home organized."
                </p>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#E90064]" />
                  <p className="text-xs font-semibold font-poppins">— Priya S., Interior Designer</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandComponents;
