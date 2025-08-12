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

      <div className="p-4 lg:p-6 space-y-3">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/20">
            {badge}
          </span>
        )}
        {title && (
          <h3 className="text-xl lg:text-2xl font-black text-primary tracking-tight leading-tight uppercase">
            {title}
          </h3>
        )}
        {body && (
          <p className="text-muted-foreground text-sm lg:text-base leading-relaxed font-medium">
            {body}
          </p>
        )}
        {cta && (
          <Link
            to={cta.href}
            className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
          >
            {cta.label}
            <span aria-hidden>↗</span>
          </Link>
        )}
      </div>
    </aside>
  );
}