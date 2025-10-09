import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 20,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetTime = new Date().getTime() + (20 * 60 * 60 * 1000); // 20 hours from now
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        hours: Math.floor(distance / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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
        
        {/* Countdown Timer */}
        <div className="flex gap-4 justify-center items-center">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--brand-pink))]">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Hours</div>
          </div>
          <div className="text-3xl font-bold text-foreground">:</div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--brand-pink))]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Minutes</div>
          </div>
          <div className="text-3xl font-bold text-foreground">:</div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--brand-pink))]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Seconds</div>
          </div>
        </div>
        
        <div className="pt-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Follow us for updates</p>
            <Button
              asChild
              size="lg"
              className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90 text-white"
            >
              <a 
                href="https://www.instagram.com/sisterstorage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="h-5 w-5" />
                Visit us on Instagram
              </a>
            </Button>
          </div>
          
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
