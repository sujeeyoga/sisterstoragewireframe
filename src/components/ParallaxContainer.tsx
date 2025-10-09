import { useViewportHeight } from '@/hooks/use-viewport-height';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const ParallaxContainer = () => {
  useViewportHeight();

  const imageUrl = "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png";

  return (
    <section 
      className="relative w-full overflow-hidden"
      aria-label="Parallax showcase section"
      style={{
        height: 'calc(var(--vh, 1vh) * 70)',
        backgroundImage: `url(${imageUrl})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: 'hsl(var(--brand-pink))'
      }}
    >
      {/* Centered Instagram button */}
      <section 
        className="relative z-10 h-full flex items-center justify-center px-4 md:px-6"
      >
        <Button
          asChild
          variant="pink"
          size="lg"
          aria-label="Follow us on Instagram"
          className="shadow-lg"
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
      </section>

      {/* Optional subtle bottom gradient for contrast */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))'
        }}
      />
    </section>
  );
};

export default ParallaxContainer;
