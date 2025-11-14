import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export const StoriesCarouselSkeleton = () => {
  return (
    <div className="w-full overflow-hidden relative flex justify-center items-center px-4 md:px-0">
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
      
      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />
      
      {/* Carousel Container */}
      <div className="w-full max-w-[100vw] min-h-[60vh]">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {[1, 2, 3, 4].map((i) => (
              <CarouselItem 
                key={i} 
                className="pl-5 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex-shrink-0"
              >
                <Card className="overflow-hidden border-0 bg-transparent h-full w-full">
                  <div 
                    className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] overflow-hidden rounded-2xl shadow-xl"
                    style={{ aspectRatio: '9 / 16' }}
                  >
                    {/* Video skeleton */}
                    <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
                    
                    {/* Play icon skeleton */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Skeleton className="w-16 h-16 rounded-full" />
                    </div>
                    
                    {/* Text overlay skeleton */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
