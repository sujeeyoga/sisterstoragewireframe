import { Skeleton } from "@/components/ui/skeleton";

export const GallerySkeleton = () => {
  return (
    <section className="py-16 bg-[hsl(var(--brand-gray))]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="w-full aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
};
