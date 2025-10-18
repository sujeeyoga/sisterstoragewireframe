import { useViewportHeight } from '@/hooks/use-viewport-height';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ParallaxContainer = () => {
  useViewportHeight();
  const isMobile = useIsMobile();

  const imageUrl = "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png";

  return (
    <section 
      className="relative w-full overflow-hidden"
      aria-label="Follow us on Instagram"
      style={{
        height: 'calc(var(--vh, 1vh) * 70)',
      }}
    >
      {/* Background Image - fixed on desktop, scroll on mobile for performance */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: 'hsl(var(--brand-pink))'
        }}
      />

      {/* Dark overlay for better button contrast */}
      <div
        className="absolute inset-0 bg-black/30"
        aria-hidden="true"
      />

      {/* Centered Instagram button */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-6">
        <Button
          asChild
          variant="pink"
          size="lg"
          aria-label="Follow us on Instagram"
          className="shadow-2xl hover:scale-105 transition-transform"
        >
          <a
            href="https://www.instagram.com/sisterstorageinc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
            <span>Follow on Instagram</span>
          </a>
        </Button>
      </div>

      {/* Bottom gradient for visual depth */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))'
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default ParallaxContainer;
