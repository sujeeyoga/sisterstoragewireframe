
import AnimatedText from '@/components/ui/animated-text';

const BrandTypography = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container-custom">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins"
          animation="breath-fade-up"
        >
          Typography — Poppins
        </AnimatedText>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '0px' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-poppins">Display / Hero</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#E90064] leading-tight font-poppins">
              Culture Without Clutter
            </h1>
          </div>
          
          <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '0px' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-poppins">Heading</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">
              Designed by us — for us
            </h2>
          </div>
          
          <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '0px' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-poppins">Body Text</p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-poppins">
              Made by sisters, for sisters. Sister Storage was created for the women who celebrate their culture boldly, live beautifully, and organize powerfully. We believe in honoring our traditions while designing for our modern lives.
            </p>
          </div>

          <div className="bg-white p-8 shadow-sm" style={{ borderRadius: '0px' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-poppins">Small Text / Captions</p>
            <p className="text-sm text-gray-600 font-poppins">
              Clutter never had a place in our culture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTypography;
