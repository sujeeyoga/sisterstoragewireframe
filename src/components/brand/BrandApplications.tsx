
import { Card } from '@/components/ui/card';
import { Mail, Package, Heart } from 'lucide-react';
import AnimatedText from '@/components/ui/animated-text';

const BrandApplications = () => {
  return (
    <section className="py-16 px-6 bg-[#F4F4F4]">
      <div className="container-custom">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins"
          animation="breath-fade-up"
        >
          Brand Applications
        </AnimatedText>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 text-center" style={{ borderRadius: '0px' }}>
            <div className="w-16 h-16 bg-[#E90064] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-poppins">Digital Communications</h3>
            <p className="text-sm text-gray-600 font-poppins">
              Email campaigns, social media, and website design following our bold, cultural aesthetic.
            </p>
          </Card>

          <Card className="p-6 text-center" style={{ borderRadius: '0px' }}>
            <div className="w-16 h-16 bg-[#FF8021] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-poppins">Product Packaging</h3>
            <p className="text-sm text-gray-600 font-poppins">
              Clean, minimal packaging with bold brand colors and zero-radius design elements.
            </p>
          </Card>

          <Card className="p-6 text-center" style={{ borderRadius: '0px' }}>
            <div className="w-16 h-16 bg-[#FFA51E] mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '0px' }}>
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold mb-2 font-poppins">Brand Experience</h3>
            <p className="text-sm text-gray-600 font-poppins">
              Every touchpoint reflects our commitment to cultural celebration and organized living.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandApplications;
