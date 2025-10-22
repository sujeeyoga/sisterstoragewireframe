import { Skeleton } from "@/components/ui/skeleton";

export const PromoBannerSkeleton = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="bg-[hsl(var(--brand-pink))] rounded-2xl p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto bg-white/20" />
            <Skeleton className="h-6 w-full bg-white/20" />
            <Skeleton className="h-12 w-48 mx-auto bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
};
