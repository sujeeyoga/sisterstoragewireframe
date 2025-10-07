import React from "react";

interface HeroProductContent {
  qty: number;
  label: string;
  rodsEach: number;
  detail: string;
}

interface HeroProductIncludesProps {
  contents: HeroProductContent[];
}

const IncludesList: React.FC<{ items: HeroProductContent[] }> = ({ items }) => (
  <ul className="grid gap-3 text-sm text-foreground">
    {items.map((it, i) => (
      <li key={i} className="flex items-center gap-3">
        <svg className="w-5 h-5 text-brand-orange flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span className="inline-grid grid-cols-[48px_auto_auto] items-center gap-2.5">
          <b className="px-2 py-1.5 border-2 border-brand-pink text-brand-pink font-extrabold text-center uppercase" style={{ borderRadius: '0px' }}>{it.qty}×</b>
          <span className="font-bold uppercase text-xs tracking-wide">{it.label}</span>
          <span className="text-muted-foreground text-xs">— {it.detail}</span>
        </span>
      </li>
    ))}
  </ul>
);

const HeroProductIncludes: React.FC<HeroProductIncludesProps> = ({ contents }) => {
  const totalRods = contents.reduce((sum, c) => sum + c.qty * c.rodsEach, 0);

  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-brand-pink uppercase tracking-widest mb-4 letter-spacing-[0.1em]">
        WHAT'S INCLUDED
      </h2>
      <IncludesList items={contents} />
      <div className="mt-4">
        <span className="inline-block bg-brand-gray text-foreground text-xs font-bold uppercase px-3 py-1.5 tracking-wide" style={{ borderRadius: '0px' }}>
          TOTAL: {totalRods} RODS
        </span>
      </div>
    </div>
  );
};

export default HeroProductIncludes;
