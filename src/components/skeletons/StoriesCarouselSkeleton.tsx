import { Skeleton } from "@/components/ui/skeleton";

export const StoriesCarouselSkeleton = () => {
  return (
    <section className="-mt-8 md:-mt-48 py-12 md:py-16 bg-[hsl(var(--brand-gray))] overflow-x-hidden relative z-10">
      <div className="container-custom text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-6" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>
      
      <div className="flex justify-center gap-5 px-4">
        {[1, 2, 3].map(i => (
          <Skeleton 
            key={i} 
            className="w-[360px] rounded-2xl" 
            style={{ aspectRatio: '9 / 16' }}
          />
        ))}
      </div>
    </section>
  );
};
