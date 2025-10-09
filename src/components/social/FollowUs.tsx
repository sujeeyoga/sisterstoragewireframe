import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const FollowUs = () => {
  return (
    <section aria-label="Follow us on Instagram" className="w-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Follow us
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted-foreground">
          See new drops, behind-the-scenes, and how sisters style their spaces.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            variant="pink"
            size="lg"
            aria-label="Follow Sister Storage on Instagram"
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

          <a
            href="https://www.instagram.com/sisterstorageinc/"
            target="_blank"
            rel="noopener noreferrer"
            className="story-link text-sm md:text-base"
            aria-label="Visit @sisterstorageinc on Instagram"
          >
            @sisterstorageinc
          </a>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;
