import { Skeleton } from "@/components/ui/skeleton";

export const ProductsGridSkeleton = () => {
  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};
