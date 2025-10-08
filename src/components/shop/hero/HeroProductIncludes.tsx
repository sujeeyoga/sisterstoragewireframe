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
      <li key={i} className="flex items-start gap-4">
        <svg className="w-5 h-5 text-[hsl(var(--brand-orange))] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2">
              <span className="px-3 py-1 bg-[hsl(var(--brand-pink))] text-white font-bold text-sm rounded">
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
        <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg">
          <span className="text-xs font-semibold uppercase tracking-wide">Total:</span>
          <span className="text-lg font-bold">{totalRods} Rods</span>
        </div>
      </div>
    </div>
  );
};

export default HeroProductIncludes;
