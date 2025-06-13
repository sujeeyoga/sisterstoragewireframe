
import { Card } from '@/components/ui/card';
import { Mail, Package, Heart } from 'lucide-react';
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';

const BrandApplications = () => {
  return (
    <div className="text-center">
      <div className="mb-16">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold mb-8 font-poppins"
          animation="breath-fade-up"
        >
          Brand Applications
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg font-thin text-gray-600 font-poppins"
          animation="breath-fade-up-2"
        >
          {SisterBrand.brandVoice.mission}
        </AnimatedText>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 md:col-span-4 p-8 text-center" style={{ borderRadius: '0px' }}>
          <div className="w-16 h-16 bg-[#E90064] mx-auto mb-6 flex items-center justify-center" style={{ borderRadius: '0px' }}>
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold mb-4 font-poppins text-lg">Digital Communications</h3>
          <p className="text-sm text-gray-600 font-poppins leading-relaxed">
            Email campaigns, social media, and website design following our bold, cultural aesthetic.
          </p>
        </Card>

        <Card className="col-span-12 md:col-span-4 p-8 text-center" style={{ borderRadius: '0px' }}>
          <div className="w-16 h-16 bg-[#FF8021] mx-auto mb-6 flex items-center justify-center" style={{ borderRadius: '0px' }}>
            <Package className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold mb-4 font-poppins text-lg">Product Packaging</h3>
          <p className="text-sm text-gray-600 font-poppins leading-relaxed">
            Clean, minimal packaging with bold brand colors and zero-radius design elements.
          </p>
        </Card>

        <Card className="col-span-12 md:col-span-4 p-8 text-center" style={{ borderRadius: '0px' }}>
          <div className="w-16 h-16 bg-[#FFA51E] mx-auto mb-6 flex items-center justify-center" style={{ borderRadius: '0px' }}>
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold mb-4 font-poppins text-lg">Brand Experience</h3>
          <p className="text-sm text-gray-600 font-poppins leading-relaxed">
            Every touchpoint reflects our commitment to cultural celebration and organized living.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default BrandApplications;
