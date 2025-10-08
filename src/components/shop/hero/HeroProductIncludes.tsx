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
  <ul className="space-y-4">
    {items.map((it, i) => (
      <li key={i}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
              {it.qty}×
            </span>
            <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
              {it.label}
            </span>
          </span>
          <span className="text-gray-600 text-sm">
            {it.detail}
          </span>
        </div>
      </li>
    ))}
  </ul>
);

const HeroProductIncludes: React.FC<HeroProductIncludesProps> = ({ contents }) => {
  const totalRods = contents.reduce((sum, c) => sum + c.qty * c.rodsEach, 0);

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
        What's Included
      </h3>
      <IncludesList items={contents} />
      <div className="pt-4 border-t border-gray-200">
        <div className="inline-flex items-center gap-2 text-[hsl(var(--brand-pink))] text-3xl font-bold">
          <span className="uppercase tracking-wide">Total:</span>
          <span>{totalRods} Rods</span>
        </div>
      </div>
    </div>
  );
};

export default HeroProductIncludes;
