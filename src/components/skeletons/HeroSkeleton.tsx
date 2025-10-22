import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <section className="relative min-h-screen w-full bg-background">
      <div className="container-custom h-screen flex items-center justify-between gap-8">
        {/* Left content */}
        <div className="flex-1 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-12 w-48 mt-8" />
        </div>
        
        {/* Right image */}
        <div className="flex-1">
          <Skeleton className="w-full aspect-square rounded-2xl" />
        </div>
      </div>
    </section>
  );
};
