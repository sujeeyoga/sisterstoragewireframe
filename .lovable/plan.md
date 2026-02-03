

## Update Sleeve Selector: Baby Shower Label + Enlarged Image Preview

### Changes Overview

**1. Rename "Pregnancy" to "Baby Shower"**
- Update the label in the `sleeveOptions` array from "Pregnancy" to "Baby Shower"

**2. Add Large Image Preview on Click**
- When a sleeve is selected, show an enlarged version of the image in a modal/dialog
- Use the existing Radix Dialog component for a clean popup experience
- Clicking the thumbnail will both select the sleeve AND open the larger preview

### Technical Implementation

**File: `src/components/product/SleeveSelector.tsx`**

```tsx
// Update label
{ value: "pregnancy", label: "Baby Shower", image: pregnancySleeve }

// Add state for enlarged image modal
const [enlargedImage, setEnlargedImage] = useState<{image: string, label: string} | null>(null);

// On click: select sleeve + open enlarged view
onClick={() => {
  setSelectedSleeve(option.value);
  setEnlargedImage({ image: option.image, label: option.label });
}}

// Add Dialog component for enlarged preview
<Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
  <DialogContent className="max-w-md">
    <img src={enlargedImage?.image} alt={enlargedImage?.label} className="w-full rounded-lg" />
    <p className="text-center font-semibold">{enlargedImage?.label}</p>
  </DialogContent>
</Dialog>
```

### Result
- "Pregnancy" becomes "Baby Shower"
- Clicking any sleeve thumbnail opens a large, detailed view of the sleeve design
- Users can see the intricate details before confirming their selection

