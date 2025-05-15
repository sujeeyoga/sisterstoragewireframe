
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-14 px-4">
          <span className="text-[#E90064] font-medium">Customer Love</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">What Our Sisters Are Saying</h2>
          <p className="text-gray-600">
            Don't just take our word for it—hear from our community of organized enthusiasts
          </p>
        </div>
        
        <div className="px-4 md:px-10 max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 p-2">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col">
                    <div className="mb-4">
                      <svg className="h-6 w-6 text-[#E90064]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 flex-grow">{testimonial.quote}</p>
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
                        <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex mt-8">
              <CarouselPrevious className="-left-4 bg-white border border-gray-200" />
              <CarouselNext className="-right-4 bg-white border border-gray-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
