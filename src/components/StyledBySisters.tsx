import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';

const styledItems = [
  { 
    id: 1, 
    type: "video", 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva_.mp4", 
    title: "Sister Stories",
    author: "@rishegaselva_"
  },
  { 
    id: 2, 
    type: "video", 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/nxtsisterduo_.mp4", 
    title: "Community Love",
    author: "@nxtsisterduo_"
  },
  { 
    id: 3, 
    type: "image", 
    image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png", 
    title: "Elegant Display" 
  },
  { 
    id: 4, 
    type: "quote", 
    text: "Finally, storage that honors my culture and keeps my bangles perfect!",
    author: "Priya K.",
    location: "Toronto"
  },
  { 
    id: 5, 
    type: "video", 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva.mp4", 
    title: "Daily Ritual",
    author: "@rishegaselva"
  },
  { 
    id: 6, 
    type: "image", 
    image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png", 
    title: "Daily Ritual" 
  },
  { 
    id: 7, 
    type: "stat", 
    number: "10k+",
    label: "Happy Sisters",
    subtext: "Organizing with love"
  },
  { 
    id: 8, 
    type: "video", 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/bingewithanbu_.mp4", 
    title: "Style Goals",
    author: "@bingewithanbu_"
  },
  { 
    id: 9, 
    type: "image", 
    image: "/lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png", 
    title: "Perfect Setup" 
  },
  { 
    id: 10, 
    type: "cta", 
    title: "Share Your Style",
    description: "Tag us @sisterstorage and show us how you organize with soul!"
  },
  { 
    id: 11, 
    type: "image", 
    image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png", 
    title: "Cultural Pride" 
  },
  { 
    id: 12, 
    type: "image", 
    image: "/lovable-uploads/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.png", 
    title: "Inspiration" 
  }
];

const StyledBySisters = () => {
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const getGridClass = (item: any, index: number) => {
    if (isMobile) {
      // Mobile: 2 columns, featured items span full width
      if (item.type === "featured") return "col-span-2";
      return "col-span-1";
    }
    
    // Desktop: 4 columns with varied spans
    if (item.type === "featured") return "col-span-2 row-span-2";
    if (item.type === "quote" || item.type === "cta") return "col-span-2";
    return "col-span-1";
  };

  const getAspectClass = (item: any) => {
    if (isMobile) {
      if (item.type === "featured") return "aspect-[16/9]";
      if (item.type === "video") return "aspect-[9/16]";
      return "aspect-square";
    }
    
    if (item.type === "featured") return "aspect-square";
    if (item.type === "quote" || item.type === "cta") return "aspect-[2/1]";
    if (item.type === "video") return "aspect-[9/16]";
    return "aspect-square";
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/50">
      <div className="container-custom">
        <EnhancedScrollFade preset="medium" className="text-center mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-medium text-sm">Community</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
              STYLED BY OUR
              <span className="block text-primary">SISTERS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Real sisters, real spaces, real love. See how our community celebrates organizing with culture, color, and intention.
            </p>
          </div>
        </EnhancedScrollFade>
        
        <EnhancedScrollFade preset="subtle" delay={200}>
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3 md:gap-4 max-w-6xl mx-auto`}>
            {styledItems.map((item, index) => (
              <Card 
                key={item.id} 
                className={`relative overflow-hidden cursor-pointer group border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 ${getGridClass(item, index)} ${getAspectClass(item)}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.type === "image" && (
                  <>
                    <PerformanceImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
                    </div>
                  </>
                )}

                {item.type === "video" && (
                  <>
                    <video
                      src={item.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Video loading error for:', item.video, e);
                        console.log('Video element:', e.target);
                      }}
                      onLoadStart={() => {
                        console.log('Video loading started for:', item.video);
                      }}
                      onCanPlay={() => {
                        console.log('Video can play:', item.video);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs opacity-90">{item.author}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </>
                )}

                {item.type === "featured" && (
                  <>
                    <PerformanceImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="font-bold text-lg md:text-xl mb-2">{item.title}</h3>
                      <p className="text-sm md:text-base opacity-90">{item.description}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Featured
                    </div>
                  </>
                )}

                {item.type === "quote" && (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col justify-center p-4 md:p-6 text-center relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-primary/20 text-4xl md:text-6xl font-serif">"</div>
                    <blockquote className="text-sm md:text-base font-medium text-foreground/90 mb-3 leading-relaxed relative z-10">
                      {item.text}
                    </blockquote>
                    <cite className="text-xs md:text-sm text-muted-foreground">
                      <span className="font-semibold">{item.author}</span>
                      <br />
                      <span>{item.location}</span>
                    </cite>
                  </div>
                )}

                {item.type === "stat" && (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex flex-col justify-center items-center p-4 md:p-6 text-center">
                    <div className="text-2xl md:text-4xl font-black text-primary mb-2">{item.number}</div>
                    <div className="text-sm md:text-base font-semibold text-foreground mb-1">{item.label}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{item.subtext}</div>
                  </div>
                )}

                {item.type === "cta" && (
                  <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex flex-col justify-center p-4 md:p-6 text-center relative overflow-hidden group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/5 transition-all duration-500">
                    <h3 className="font-bold text-base md:text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="absolute bottom-2 right-2 text-primary/40 group-hover:text-primary/60 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </EnhancedScrollFade>

        <EnhancedScrollFade preset="subtle" delay={400} className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="font-bold text-lg md:text-xl mb-3">Join Our Sister Community</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              Share your organization journey and inspire others to organize with intention and cultural pride.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                Share Your Story
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary/10 transition-colors">
                Follow @sisterstorage
              </button>
            </div>
          </div>
        </EnhancedScrollFade>
      </div>
    </section>
  );
};

export default StyledBySisters;