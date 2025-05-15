
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  maxQuantity: number;
}

const QuantitySelector = ({ quantity, setQuantity, maxQuantity }: QuantitySelectorProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold mb-2">Quantity:</h3>
      <div className="flex items-center">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l"
        >
          -
        </button>
        <div className="w-10 h-7 flex items-center justify-center border-t border-b border-gray-300 text-xs">
          {quantity}
        </div>
        <button 
          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
