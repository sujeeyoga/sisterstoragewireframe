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
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
            ORGANIZATION MADE <span className="text-[hsl(var(--brand-pink))]">BEAUTIFUL</span>
          </h2>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            See how our storage solutions transform your space
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 items-stretch">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden animate-fade-in"
            >
              <PerformanceImage
                src={image.src}
                alt={image.alt}
                className={`w-full h-full block group-hover:scale-110 transition-transform duration-700 ease-out ${
                  index === 1 || index === 2 ? 'object-cover object-center' : 'object-cover'
                }`}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
              {/* Instagram Icon Overlay - Only on last card */}
              {index === galleryImages.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-500">
                  <svg
                    className="w-24 h-24 md:w-40 md:h-40 text-white drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
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
