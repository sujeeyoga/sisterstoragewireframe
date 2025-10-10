import { useEffect, useState } from 'react';
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';
import MobileGallery from './MobileGallery';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const BrandVoice = () => {
  const [gridImages, setGridImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('uploaded_images')
          .select('id, file_path, file_name')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          const images = data.map((img, index) => ({
            id: index + 1,
            src: supabase.storage.from('images').getPublicUrl(img.file_path).data.publicUrl,
            alt: img.file_name,
            link: `/brand/content/${img.file_name.toLowerCase().replace(/\s+/g, '-')}`,
            title: img.file_name.replace(/\.[^/.]+$/, '')
          }));
          setGridImages(images);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold mb-8 font-poppins"
          animation="breath-fade-up"
        >
          Our Voice
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg font-thin mb-12 font-poppins"
          animation="breath-fade-up-2"
        >
          {SisterBrand.brandVoice.mission}
        </AnimatedText>
        
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 max-w-3xl mx-auto space-y-8">
            <AnimatedText
              as="p"
              className="text-xl italic mb-12 font-poppins"
              animation="breath-fade-up-2"
            >
              "{SisterBrand.brandVoice.tone}"
            </AnimatedText>
            
            <div className="bg-[#E90064] p-12" style={{ borderRadius: '0px' }}>
              <AnimatedText
                as="h3"
                className="text-2xl font-bold mb-6 font-poppins"
                animation="breath-fade-up-3"
              >
                {SisterBrand.brandVoice.tagline}
              </AnimatedText>
              <AnimatedText
                as="p"
                className="text-lg font-poppins leading-relaxed"
                animation="breath-fade-up-4"
              >
                Our visual identity celebrates the beauty of organized living while honoring our cultural heritage. Every color, every curve, every choice reflects our mission.
              </AnimatedText>
            </div>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Gallery Section */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <AnimatedText
            as="h3"
            className="text-2xl md:text-3xl font-bold font-poppins"
            animation="breath-fade-up-3"
          >
            Inspiration Gallery
          </AnimatedText>
        </div>
        <MobileGallery items={gridImages} />
      </div>
    </div>
  );
};

export default BrandVoice;
