import PerformanceImage from '@/components/ui/performance-image';

const OrganizationGallery = () => {
  const galleryImages = [
    {
      src: '/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png',
      alt: 'Elegant jewelry storage solution'
    },
    {
      src: '/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png',
      alt: 'Organized jewelry display with bangles'
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 tracking-wide">
            ORGANIZATION MADE BEAUTIFUL
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">
            See how our storage solutions transform your space
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 items-end">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 group overflow-hidden">
              <PerformanceImage
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover block group-hover:scale-[1.02] group-hover:brightness-[1.02] transition-all duration-700 rounded-2xl"
                loading={index < 2 ? 'eager' : 'lazy'}
              />
              {/* Instagram Icon Overlay - Only on last card */}
              {index === galleryImages.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-64 h-64 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationGallery;
