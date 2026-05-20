import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SisterBrand } from '@/config/sister-brand.config';
import { Copy, Check, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const ORDER_KEY = 'branding.colorOrder.v1';

const CopyableValue = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: 'Copied', description: `${label} copied to clipboard` });
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="group flex items-center gap-2 text-left hover:bg-muted/50 rounded px-1 -mx-1 transition-colors"
    >
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
};

const ColorSwatch = ({
  name,
  hex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: {
  name: string;
  hex: string;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    toast({ title: 'Copied', description: `${hex} copied to clipboard` });
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40 scale-95' : ''}`}
    >
      <div className="absolute top-1 right-1 z-10 p-1 rounded bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3 w-3 text-white" />
      </div>
      <button onClick={copy} className="w-full text-left">
        <div className="h-24 w-full" style={{ background: hex }} />
        <div className="p-3 flex items-center justify-between bg-white">
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground font-mono">{hex}</p>
          </div>
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />}
        </div>
      </button>
    </div>
  );
};

export const BrandingPage = () => {
  const baseColors = Object.entries(SisterBrand.colors);
  const weights = Object.entries(SisterBrand.typography.weights);

  const [colors, setColors] = useState<[string, string][]>(() => {
    try {
      const saved = localStorage.getItem(ORDER_KEY);
      if (saved) {
        const order: string[] = JSON.parse(saved);
        const map = new Map(baseColors);
        const ordered = order.filter((n) => map.has(n)).map((n) => [n, map.get(n)!] as [string, string]);
        const remaining = baseColors.filter(([n]) => !order.includes(n));
        return [...ordered, ...remaining];
      }
    } catch {}
    return baseColors;
  });

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(colors.map(([n]) => n)));
  }, [colors]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    setColors((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Branding</h1>
          <p className="text-muted-foreground">
            Brand colors, typography, and voice. Click any color to copy its hex code.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/brand" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View public brand guide
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Primary Pink</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="h-32 w-32 rounded-lg" style={{ background: '#FC0079' }} />
            <div>
              <p className="text-2xl font-bold font-mono">#FC0079</p>
              <p className="text-muted-foreground">The standard Sister Pink used across the site.</p>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <CopyableValue label="RGB" value="252, 0, 121" />
                <CopyableValue label="CMYK" value="0%, 100%, 52%, 1%" />
                <CopyableValue label="HSV" value="331°, 100%, 99%" />
                <CopyableValue label="HSL" value="331°, 100%, 49%" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colors.map(([name, hex]) => (
              <ColorSwatch key={name} name={name} hex={hex} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Primary font: <span className="font-medium text-foreground">{SisterBrand.typography.primary}</span>
          </p>
          <div className="space-y-3">
            {weights.map(([name, weight]) => (
              <div key={name} className="flex items-baseline gap-4 border-b pb-3">
                <span className="text-xs text-muted-foreground w-24">{name} ({weight})</span>
                <span className="text-2xl font-poppins" style={{ fontWeight: weight }}>
                  Culture Without Clutter
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Brand Voice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tagline</p>
            <p className="text-xl font-bold">{SisterBrand.brandVoice.tagline}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tone</p>
            <p>{SisterBrand.brandVoice.tone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Personality</p>
            <div className="flex flex-wrap gap-2">
              {SisterBrand.brandVoice.personality.map((trait) => (
                <span key={trait} className="px-3 py-1 rounded-full text-sm text-white" style={{ background: '#FC0079' }}>
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
