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
      <div className="bundle-includes-card">
        {showTotals && (
          <div className="bundle-total-header">
            Total: {totalRods} rods
          </div>
        )}
        <ul className="bundle-aggregate-list">
          {items.map((item, index) => {
            const totalRodsForSize = item.quantity * item.rods;
            return (
              <li key={index}>
                <span className="bundle-size">{item.size}</span>
                <span className="bundle-divider">–</span>
                <span className="bundle-count">{item.quantity} box{item.quantity > 1 ? 'es' : ''}</span>
                <span className="bundle-total">({totalRodsForSize} rods total)</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Compact and full variants
  return (
    <div className={isCompact ? "bundle-includes-compact" : "bundle-includes"}>
      <strong className="bundle-includes-heading">
        Bundle Includes
      </strong>
      <ul className="bundle-list">
        {items.map((item, index) => (
          <li key={index}>
            <span className="bundle-qty">{item.quantity}×</span>
            <span className="bundle-item">{item.size}</span>
            <span className="bundle-divider">—</span>
            <span className="bundle-detail">
              {item.rods} rod{item.rods > 1 ? 's' : ''}{item.quantity > 1 ? ' each' : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BundleContentsList;
