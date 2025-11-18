import React from "react";

interface SleeveSelectorProps {
  selectedSleeve: string;
  setSelectedSleeve: (sleeve: string) => void;
}

const sleeveOptions = [
  { value: "none", label: "No Sleeve" },
  { value: "standard", label: "Standard Sleeve" },
  { value: "velvet", label: "Velvet Sleeve" },
  { value: "silk", label: "Silk Sleeve" }
];

const SleeveSelector = ({ selectedSleeve, setSelectedSleeve }: SleeveSelectorProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold mb-2">Sleeve Design:</h3>
      <div className="grid grid-cols-2 gap-2">
        {sleeveOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedSleeve(option.value)}
            className={`px-3 py-2 text-xs border rounded-md transition-all ${
              selectedSleeve === option.value
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border hover:border-primary/50 text-foreground/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SleeveSelector;
