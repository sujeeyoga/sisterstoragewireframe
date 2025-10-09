import Logo from "@/components/ui/Logo";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center mb-8">
          <Logo className="h-16 w-auto" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
        </div>
        
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand-pink))] animate-pulse" />
            <span>Under Construction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
