import React from "react";
import { Link } from "react-router-dom";

type Source = { src: string; width: number };
type Props = {
  alt: string;
  sources: Source[];
  badge?: string;
  title?: string;
  body?: string;
  cta?: { label: string; href: string };
  aspect?: `${number}/${number}`;
  className?: string;
};

export default function HeroSpotlightCard({
  alt,
  sources,
  badge = "Beautifully Organized",
  title = "Beautiful Organization",
  body = "Transform your space with thoughtfully designed storage solutions.",
  cta,
  aspect = "4/3",
  className = "",
}: Props) {
  // Build srcset string
  const sorted = [...sources].sort((a, b) => a.width - b.width);
  const fallback = sorted[0]?.src || "";
  const srcSet = sorted.map(s => `${s.src} ${s.width}w`).join(", ");

  return (
    <aside
      className={[
        // sizing & layout
        "pointer-events-auto select-none",
        // width at breakpoints
        "w-full sm:max-w-[420px] md:max-w-[320px] lg:max-w-[360px]",
        // card styling - using design system colors
        "rounded-2xl border border-black/5 bg-white shadow-xl shadow-black/5",
        "overflow-hidden",
        // spacing relative to hero container
        "ml-auto",             // push to right when there is room
        "mt-6 md:mt-0",        // stack under copy on small
        "animate-fade-in",     // entrance animation
        className,
      ].join(" ")}
      style={{ animationDelay: '0.3s' }}
      aria-label="Hero spotlight"
      role="complementary"
    >
      <div className={`relative w-full aspect-[${aspect}] bg-muted`}>
        {/* image with art-directed sources */}
        <picture>
          {/* HiDPI + large screens */}
          <source
            srcSet={srcSet}
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 320px, 100vw"
          />
          <img
            src={fallback}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </picture>

        {/* subtle hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* subtle inset shadow top to separate from bg */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
      </div>

    </aside>
  );
}