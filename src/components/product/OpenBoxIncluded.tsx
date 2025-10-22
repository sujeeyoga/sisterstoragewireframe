import React from "react";

interface OpenBoxIncludedProps {
  product: {
    name: string;
    shortDescription?: string;
  };
}

const OpenBoxIncluded: React.FC<OpenBoxIncludedProps> = ({ product }) => {
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

  const capacityMatch = product.shortDescription?.match(/~(\d+)\s*bangles/i);
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
                <span className="text-gray-600 text-2xl">with {rodsEach} Rods</span>
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
