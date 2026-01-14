import { SEO } from '@/components/SEO';
import BaseLayout from '@/components/layout/BaseLayout';
import EnhancedScrollFade from '@/components/ui/enhanced-scroll-fade';

const Culture = () => {
  return (
    <BaseLayout>
      <SEO 
        title="Culture | Sister Storage - Celebrating South Asian Heritage"
        description="Discover how Sister Storage celebrates South Asian culture through thoughtful bangle storage solutions. Preserving traditions, one bangle at a time."
        url="/culture"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-brand-pink py-20 md:py-32">
          <div className="container mx-auto px-4">
            <EnhancedScrollFade>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Culture
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Celebrating the beauty and heritage of South Asian traditions through thoughtful organization.
                </p>
              </div>
            </EnhancedScrollFade>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <EnhancedScrollFade>
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-semibold text-foreground mb-6">
                    Preserving Traditions
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Bangles are more than jewelry—they're a connection to our roots, our mothers, 
                    our grandmothers, and generations of women who came before us. Each piece 
                    tells a story of celebration, love, and cultural pride.
                  </p>
                  
                  <h2 className="text-3xl font-semibold text-foreground mb-6">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    At Sister Storage, we believe that cultural treasures deserve proper care. 
                    Our storage solutions are designed with deep respect for the traditions they protect, 
                    ensuring your bangles remain as beautiful as the memories they hold.
                  </p>
                </div>
              </EnhancedScrollFade>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  );
};

export default Culture;
