import PerformanceImage from '@/components/ui/performance-image';

const OrganizationGallery = () => {
  const galleryImages = [
    {
      src: '/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png',
      alt: 'Organized jewelry display with bangles'
    },
    {
      src: '/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png',
      alt: 'Elegant jewelry storage solution'
    },
    {
      src: '/lovable-uploads/76c5f6ac-f27b-4f26-8377-759dfc17c71d.png',
      alt: 'Beautiful bangle organization system'
    },
    {
      src: '/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png',
      alt: 'Sister Storage product showcase'
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ORGANIZATION MADE BEAUTIFUL
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our storage solutions transform your space
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <PerformanceImage
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationGallery;
