
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';
import MobileGallery from './MobileGallery';

const BrandVoice = () => {
  const gridImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=500&fit=crop',
      alt: 'Organized workspace with laptop',
      link: '/brand/content/workspace-organization',
      title: 'Workspace Organization'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=600&fit=crop',
      alt: 'Modern living room design',
      link: '/brand/content/living-spaces',
      title: 'Living Spaces'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=450&fit=crop',
      alt: 'Woman organizing with laptop',
      link: '/brand/content/digital-organization',
      title: 'Digital Organization'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=550&fit=crop',
      alt: 'Collaborative workspace',
      link: '/brand/content/collaborative-spaces',
      title: 'Collaborative Spaces'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop',
      alt: 'Creative inspiration',
      link: '/brand/content/creative-inspiration',
      title: 'Creative Inspiration'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop',
      alt: 'Organized desk setup',
      link: '/brand/content/desk-organization',
      title: 'Desk Organization'
    }
  ];

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
