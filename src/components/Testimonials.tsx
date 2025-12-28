
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    quote: "These organizers changed my life! Now everything has a home.",
    author: "Priya S.",
    title: "Jewelry Collector",
    color: "#E80065"
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
  const [api, setApi] = useState<CarouselApi>();
  
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="container-custom">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column - Header Section */}
        <div className="text-center md:text-left px-4">
          <span className="text-[#E80065] font-medium">Customer Love</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-3">What Our Sisters Are Saying</h2>
          <p className="text-gray-600">
            Don't just take our word for it—hear from our community of organized enthusiasts
          </p>
        </div>
        
        {/* Right Column - Testimonials Carousel */}
        <div className="px-4 md:px-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              duration: 0,
            }}
            setApi={setApi}
            className="w-full"
          >
             <CarouselContent>
               {testimonials.map((testimonial) => (
                 <CarouselItem key={testimonial.id} className="basis-full p-2">
                   <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-[280px] flex flex-col">
                     {/* Quote Icon - Fixed Height */}
                     <div className="mb-4 h-6">
                       <svg className="h-6 w-6 text-[#E80065]" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                       </svg>
                     </div>
                     
                     {/* Quote Text - Fixed Height */}
                     <div className="flex-1 min-h-[6rem] mb-6">
                       <p className="text-gray-700 line-clamp-4">{testimonial.quote}</p>
                     </div>
                     
                     {/* Author Section - Fixed Height */}
                     <div className="h-[3rem] flex items-center">
                       <div className="flex-shrink-0">
                         <div 
                           className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                           style={{ backgroundColor: testimonial.color }}
                         >
                           {testimonial.author.split(' ')[0][0]}{testimonial.author.split(' ')[1][0]}
                         </div>
                       </div>
                       <div className="ml-3 flex-1">
                         <p className="text-sm font-medium text-gray-900 line-clamp-1">{testimonial.author}</p>
                         <p className="text-sm text-gray-500 line-clamp-1">{testimonial.title}</p>
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
    </div>
  );
};

export default Testimonials;
