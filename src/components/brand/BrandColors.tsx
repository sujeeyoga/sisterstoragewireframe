
import { useState } from 'react';
import { SisterBrand } from '@/config/sister-brand.config';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import AnimatedText from '@/components/ui/animated-text';

const BrandColors = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container-custom">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins"
          animation="breath-fade-up"
        >
          Brand Colors
        </AnimatedText>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Object.entries(SisterBrand.colors).map(([name, value]) => (
            <Card key={name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => copyToClipboard(value, name)} style={{ borderRadius: '0px' }}>
              <div className="h-24 relative" style={{ backgroundColor: value }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                  {copiedColor === name ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <Copy className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-sm font-poppins">{name}</p>
                <p className="text-xs text-gray-600 font-mono">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandColors;
