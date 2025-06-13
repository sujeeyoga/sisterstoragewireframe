
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Star, Heart, AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';
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

          {/* Color Combinations in Components */}
          <Card style={{ borderRadius: '0px' }}>
            <CardHeader>
              <CardTitle className="font-poppins">Color Combinations in Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Pink Theme - Promotional */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Pink Theme - Promotional</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#E90064' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" style={{ color: '#FE5FA4' }} />
                        <h3 className="font-bold text-lg font-poppins">LIMITED OFFER</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Save 25% on your first Sister Storage collection.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#FE5FA4', borderRadius: '0px' }}>
                        SHOP NOW →
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FE5FA4' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" style={{ color: '#E90064' }} />
                        <h3 className="font-bold text-lg font-poppins">CUSTOMER FAVORITE</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Our most-loved storage solution for modern homes.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#E90064', borderRadius: '0px' }}>
                        LEARN MORE →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Orange/Gold Theme - Action */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Orange/Gold Theme - Action</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FF8021' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" style={{ color: '#FFA51E' }} />
                        <h3 className="font-bold text-lg font-poppins">FREE DELIVERY</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Get your products delivered free on orders over $75.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#FFA51E', borderRadius: '0px' }}>
                        DELIVERY INFO →
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FFA51E' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" style={{ color: '#FF8021' }} />
                        <h3 className="font-bold text-lg font-poppins">QUICK SETUP</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Assembly-free storage solutions ready in minutes.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#FF8021', borderRadius: '0px' }}>
                        GET STARTED →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Neutral Theme - Professional */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Neutral Theme - Professional</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#000000' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: '#403E43' }} />
                        <h3 className="font-bold text-lg font-poppins">DESIGN PHILOSOPHY</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Culture without clutter. Modern storage with heritage.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#403E43', borderRadius: '0px' }}>
                        OUR STORY →
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#403E43' }}>
                    <div className="space-y-3 text-white">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" style={{ color: '#000000' }} />
                        <h3 className="font-bold text-lg font-poppins">QUALITY ASSURED</h3>
                      </div>
                      <p className="text-sm font-poppins opacity-90">
                        Premium materials and craftsmanship in every piece.
                      </p>
                      <Button size="sm" className="text-white font-poppins" style={{ backgroundColor: '#000000', borderRadius: '0px' }}>
                        WARRANTY →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Soft Theme - Testimonials */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Soft Theme - Testimonials</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FFDCBD' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#FDE1D3' }} />
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-800 font-poppins">
                        "Beautiful storage that celebrates my culture while keeping my home organized."
                      </p>
                      <p className="text-xs font-semibold font-poppins text-gray-700">— Priya S.</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FDE1D3' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#FFDCBD' }} />
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-800 font-poppins">
                        "Finally, storage solutions that understand my lifestyle and heritage."
                      </p>
                      <p className="text-xs font-semibold font-poppins text-gray-700">— Zara M.</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Fresh Theme - Success States */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Fresh Theme - Success States</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#F2FCE2' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" style={{ color: '#FEF7CD' }} />
                        <h3 className="font-bold text-lg font-poppins text-gray-800">ORDER CONFIRMED</h3>
                      </div>
                      <p className="text-sm font-poppins text-gray-700">
                        Your Sister Storage collection is on its way!
                      </p>
                      <Button size="sm" className="font-poppins text-gray-800" style={{ backgroundColor: '#FEF7CD', borderRadius: '0px' }}>
                        TRACK ORDER →
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FEF7CD' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" style={{ color: '#F2FCE2' }} />
                        <h3 className="font-bold text-lg font-poppins text-gray-800">REVIEW SUBMITTED</h3>
                      </div>
                      <p className="text-sm font-poppins text-gray-700">
                        Thank you for sharing your experience with us!
                      </p>
                      <Button size="sm" className="font-poppins text-gray-800" style={{ backgroundColor: '#F2FCE2', borderRadius: '0px' }}>
                        VIEW REVIEWS →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Cool Theme - Informational */}
              <div>
                <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">Cool Theme - Informational</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#FFDEE2' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: '#D3E4FD' }} />
                        <h3 className="font-bold text-lg font-poppins text-gray-800">CARE INSTRUCTIONS</h3>
                      </div>
                      <p className="text-sm font-poppins text-gray-700">
                        Simple maintenance tips to keep your storage beautiful.
                      </p>
                      <Button size="sm" className="font-poppins text-gray-800" style={{ backgroundColor: '#D3E4FD', borderRadius: '0px' }}>
                        LEARN MORE →
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4" style={{ borderRadius: '0px', backgroundColor: '#D3E4FD' }}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" style={{ color: '#FFDEE2' }} />
                        <h3 className="font-bold text-lg font-poppins text-gray-800">SIZE GUIDE</h3>
                      </div>
                      <p className="text-sm font-poppins text-gray-700">
                        Find the perfect storage size for your space.
                      </p>
                      <Button size="sm" className="font-poppins text-gray-800" style={{ backgroundColor: '#FFDEE2', borderRadius: '0px' }}>
                        SIZE GUIDE →
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Component Examples */}
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
