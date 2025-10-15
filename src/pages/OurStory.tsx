import BaseLayout from "@/components/layout/BaseLayout";
import { EnhancedScrollFade } from "@/components/ui/enhanced-scroll-fade";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import StyledBySisters from "@/components/StyledBySisters";
import { Button } from "@/components/ui/button";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { EditableText } from "@/components/admin/EditableText";

const testimonials = [
  {
    id: 1,
    quote: "These organizers changed my life! Now everything has a home.",
    author: "Priya S.",
    title: "Jewelry Collector",
    color: "#E90064"
  },
  {
    id: 2,
    quote: "Perfect blend of beauty and practicality.",
    author: "Anjali R.",
    title: "Interior Designer",
    color: "#FF8021"
  },
  {
    id: 3,
    quote: "Feels like it was made just for us.",
    author: "Meena K.",
    title: "Minimalist Enthusiast",
    color: "#FFDCBD"
  },
  {
    id: 4,
    quote: "Finally found storage solutions that celebrate our culture with elegance.",
    author: "Reema T.",
    title: "Art Collector",
    color: "#FE5FA2"
  },
  {
    id: 5,
    quote: "Sister Storage understands what we need - beautiful organization that honors our traditions.",
    author: "Kavya M.",
    title: "Cultural Enthusiast",
    color: "#8B5CF6"
  },
  {
    id: 6,
    quote: "From chaos to calm - these storage solutions transformed my space completely.",
    author: "Deepa L.",
    title: "Home Organizer",
    color: "#10B981"
  }
];

const storyMilestones = [
  {
    title: "The Problem",
    description: "Two sisters with beautiful bangles but nowhere to store them properly.",
    icon: "💫"
  },
  {
    title: "The Vision", 
    description: "Storage that celebrates culture, not hides it.",
    icon: "✨"
  },
  {
    title: "The Solution",
    description: "Thoughtfully designed organizers that honor what matters to us.",
    icon: "💎"
  },
  {
    title: "The Community",
    description: "Thousands of sisters now organizing with love and intention.",
    icon: "💖"
  }
];

const OurStory = () => {
  const { texts: heroTexts } = useSiteTexts('our_story_hero');
  const { texts: beginningTexts } = useSiteTexts('our_story_beginning');
  const { texts: solutionTexts } = useSiteTexts('our_story_solution');
  const { texts: testimonialsTexts } = useSiteTexts('our_story_testimonials');
  const { texts: ctaTexts } = useSiteTexts('our_story_cta');
  
  const heroText = heroTexts as any;
  const beginningText = beginningTexts as any;
  const solutionText = solutionTexts as any;
  const testimonialsText = testimonialsTexts as any;
  const ctaText = ctaTexts as any;
  
  return (
    <BaseLayout variant="standard" pageId="our-story">
      {/* Hero Section */}
      <section aria-label="Our Story Hero" className="bg-gradient-to-b from-background to-background/50">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
          <EnhancedScrollFade preset="medium">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-medium text-sm">Our Journey</span>
            </div>
            {heroText && (
              <>
                <EditableText
                  siteTextId={heroText.id}
                  field="title"
                  value={heroText.title}
                  as="h1"
                  className="text-4xl md:text-6xl font-black tracking-tight mb-6"
                />
                <EditableText
                  siteTextId={heroText.id}
                  field="description"
                  value={heroText.description}
                  as="p"
                  className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                />
              </>
            )}
          </EnhancedScrollFade>
        </div>
      </section>

      {/* Story Milestones */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <EnhancedScrollFade preset="medium" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How We Started</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {storyMilestones.map((milestone, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{milestone.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </EnhancedScrollFade>
        </div>
      </section>

      {/* Detailed Story */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="mx-auto max-w-3xl px-6">
          <EnhancedScrollFade preset="subtle">
            <div className="space-y-8">
              {beginningText && (
                <div>
                  <EditableText
                    siteTextId={beginningText.id}
                    field="title"
                    value={beginningText.title}
                    as="h2"
                    className="text-2xl md:text-3xl font-bold mb-4"
                  />
                  <EditableText
                    siteTextId={beginningText.id}
                    field="description"
                    value={beginningText.description}
                    as="p"
                    className="text-muted-foreground text-lg leading-relaxed mb-6"
                  />
                </div>
              )}

              {solutionText && (
                <div>
                  <EditableText
                    siteTextId={solutionText.id}
                    field="title"
                    value={solutionText.title}
                    as="h2"
                    className="text-2xl md:text-3xl font-bold mb-4"
                  />
                  <EditableText
                    siteTextId={solutionText.id}
                    field="description"
                    value={solutionText.description}
                    as="p"
                    className="text-muted-foreground leading-relaxed mb-6"
                  />
                </div>
              )}
            </div>
          </EnhancedScrollFade>
        </div>
      </section>

      {/* Customer Love Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <EnhancedScrollFade preset="medium">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-primary font-medium text-sm">Customer Love</span>
              </div>
              {testimonialsText && (
                <>
                  <EditableText
                    siteTextId={testimonialsText.id}
                    field="title"
                    value={testimonialsText.title}
                    as="h2"
                    className="text-3xl md:text-5xl font-bold mb-4"
                  />
                  <EditableText
                    siteTextId={testimonialsText.id}
                    field="description"
                    value={testimonialsText.description}
                    as="p"
                    className="text-muted-foreground text-lg"
                  />
                </>
              )}
            </div>
            
            <div className="max-w-5xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-3">
                      <div className="bg-card p-6 rounded-xl shadow-sm border h-full flex flex-col">
                        <div className="mb-4">
                          <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-foreground flex-grow leading-relaxed">{testimonial.quote}</p>
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                            <div 
                              className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: testimonial.color }}
                            >
                              {testimonial.author.split(' ')[0][0]}{testimonial.author.split(' ')[1][0]}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:flex mt-8 justify-center">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </EnhancedScrollFade>
        </div>
      </section>

      {/* Community Stories - StyledBySisters */}
      <StyledBySisters />

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <EnhancedScrollFade preset="medium">
            {ctaText && (
              <>
                <EditableText
                  siteTextId={ctaText.id}
                  field="title"
                  value={ctaText.title}
                  as="h2"
                  className="text-3xl md:text-4xl font-bold mb-4"
                />
                <EditableText
                  siteTextId={ctaText.id}
                  field="description"
                  value={ctaText.description}
                  as="p"
                  className="text-muted-foreground text-lg mb-8 leading-relaxed"
                />
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaText && (
                <Button size="lg" asChild>
                  <a href="/shop">
                    <EditableText
                      siteTextId={ctaText.id}
                      field="button_text"
                      value={ctaText.button_text}
                      as="span"
                    />
                  </a>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <a href="/">Explore More</a>
              </Button>
            </div>
          </EnhancedScrollFade>
        </div>
      </section>
    </BaseLayout>
  );
};

export default OurStory;