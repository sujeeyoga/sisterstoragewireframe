import React from "react";

interface OpenBoxIncludedProps {
  product: {
    id: string;
    name: string;
    shortDescription?: string;
    stockQuantity?: number;
  };
}

const OpenBoxIncluded: React.FC<OpenBoxIncludedProps> = ({ product }) => {
  // Special handling for Starter Set (ID: bundle-1)
  if (product.id === "bundle-1") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
          What's Included
        </h3>
        <ul className="space-y-3">
          <li>
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">2×</span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    Large Bangle Box
                  </span>
                </span>
                <span className="text-gray-600 text-2xl font-semibold">with 4 Rods Each</span>
              </div>
              <p className="text-gray-600 text-sm ml-12">
                38cm (L) × 25cm (W) × 9cm (H) | ~348 bangles each
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">1×</span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    Medium Bangle Box
                  </span>
                </span>
                <span className="text-gray-600 text-2xl font-semibold">with 2 Rods</span>
              </div>
              <p className="text-gray-600 text-sm ml-12">
                38cm (L) × 25cm (W) × 5.5cm (H) | ~174 bangles
              </p>
            </div>
          </li>
          <li>
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">1×</span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    Travel Box
                  </span>
                </span>
                <span className="text-gray-600 text-2xl font-semibold">with 1 Rod</span>
              </div>
              <p className="text-gray-600 text-sm ml-12">
                25cm (L) × 20cm (W) × 6cm (H) | ~87 bangles
              </p>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Special handling for Travel Box (ID: 25814003)
  if (product.id === "25814003") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
          What's Included
        </h3>
        <ul className="space-y-2">
          <li>
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">1×</span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    Travel Box
                  </span>
                </span>
                <span className="text-gray-600 text-2xl font-semibold">with 1 Rod</span>
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Dimensions:</span> 25cm (L) × 20cm (W) × 6cm (H)
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Capacity:</span> ~87 bangles per box
              </p>
              <p className="text-gray-500 text-xs italic">
                Condition: Open Box (may have minor scuffs or scratches)
              </p>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Special handling for Large Bangle Box (ID: 25814007)
  if (product.id === "25814007") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
          What's Included
        </h3>
        <ul className="space-y-2">
          <li>
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">1×</span>
                  <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    Large Bangle Box
                  </span>
                </span>
                <span className="text-gray-600 text-2xl font-semibold">with 4 Rods</span>
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Dimensions:</span> 38cm (L) × 25cm (W) × 9cm (H)
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Capacity:</span> ~348 bangles per box
              </p>
              <p className="text-gray-500 text-xs italic">
                Condition: Open Box (may have minor scuffs or scratches)
              </p>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Extract rods from product name e.g., "(4 Rods)"
  const rodMatch = product.name.match(/\((\d+)\s*Rods?\)/i);
  const rodsEach = rodMatch ? parseInt(rodMatch[1], 10) : undefined;

  // Determine box type from name
  const boxType = product.name.includes("Large")
    ? "Large Bangle Box"
    : product.name.includes("Medium")
    ? "Medium Bangle Box"
    : "Bangle Box";

  // Parse dimensions and capacity from short description
  const dimensionsMatch = product.shortDescription?.match(/(\d+cm.*?×.*?\d+cm.*?×.*?\d+cm)/i);
  const dimensions = dimensionsMatch ? dimensionsMatch[1].trim() : undefined;

  const capacityMatch = product.shortDescription?.match(/~?(\d+)\s*bangles/i);
  const capacity = capacityMatch ? `~${capacityMatch[1]} bangles` : undefined;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
        What's Included
      </h3>
      <ul className="space-y-2">
        <li>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">1×</span>
                <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                  {boxType}
                </span>
              </span>
              {typeof rodsEach === 'number' && (
                <span className="text-gray-600 text-2xl font-semibold">with {rodsEach} Rods</span>
              )}
            </div>
            {dimensions && (
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Dimensions:</span> {dimensions}
              </p>
            )}
            {capacity && (
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Capacity:</span> {capacity}
              </p>
            )}
            <p className="text-gray-500 text-xs italic">
              Condition: Open Box (may have minor scuffs)
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OpenBoxIncluded;
