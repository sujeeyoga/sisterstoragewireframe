import React from "react";

interface BundleItem {
  quantity: number;
  size: string;
  rods: number;
}

interface BundleContentsListProps {
  contents: string;
  variant?: "compact" | "full" | "card";
  showTotals?: boolean;
}

const BundleContentsList = ({ contents, variant = "full", showTotals = false }: BundleContentsListProps) => {
  // Parse bundle contents string (e.g., "4 Large Boxes, 2 Medium Boxes, 2 Small Boxes")
  const parseContents = (contents: string): BundleItem[] => {
    const items: BundleItem[] = [];
    const parts = contents.split(',').map(s => s.trim());
    
    parts.forEach(part => {
      // Extract quantity and size
      const match = part.match(/(\d+)\s+(Large|Medium|Small)/i);
      if (match) {
        const quantity = parseInt(match[1]);
        const size = match[2];
        
        // Determine rod count based on size
        let rods = 1;
        if (size.toLowerCase() === 'large') rods = 4;
        else if (size.toLowerCase() === 'medium') rods = 2;
        
        items.push({ quantity, size, rods });
      }
    });
    
    return items;
  };

  const items = parseContents(contents);
  
  if (items.length === 0) {
    return null;
  }

  // Calculate total rods
  const totalRods = items.reduce((sum, item) => sum + (item.quantity * item.rods), 0);

  const isCompact = variant === "compact";
  const isCard = variant === "card";

  // Card variant - aggregate format
  if (isCard) {
    return (
      <div className="space-y-5">
        {showTotals && (
          <div className="pb-4 border-b border-gray-200">
            <div className="inline-flex items-center gap-2 text-[hsl(var(--brand-pink))] text-3xl font-bold">
              <span className="uppercase tracking-wide">Total:</span>
              <span>{totalRods} Rods</span>
            </div>
          </div>
        )}
        <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
          What's Included
        </h3>
        <ul className="space-y-4">
          {items.map((item, index) => {
            const totalRodsForSize = item.quantity * item.rods;
            return (
              <li key={index}>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
                      {item.quantity}×
                    </span>
                    <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                      {item.size}
                    </span>
                  </span>
                  <span className="text-gray-600 text-2xl">
                    {item.rods} rod{item.rods > 1 ? 's' : ''} each
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Compact and full variants
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
        Bundle Includes
      </h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <svg className="w-5 h-5 text-[hsl(var(--brand-orange))] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div className="flex-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="px-3 py-1 bg-[hsl(var(--brand-pink))] text-white font-bold text-sm rounded">
                    {item.quantity}×
                  </span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    {item.size}
                  </span>
                </span>
                <span className="text-gray-600 text-sm">
                  {item.rods} rod{item.rods > 1 ? 's' : ''}{item.quantity > 1 ? ' each' : ''}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BundleContentsList;
