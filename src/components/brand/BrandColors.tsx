
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

  // Create color pairs (darker on left, lighter on right)
  const colorPairs = [
    { dark: { name: 'Sister Pink', value: '#E90064' }, light: { name: 'Light Pink', value: '#FE5FA4' } },
    { dark: { name: 'Sister Orange', value: '#FF8021' }, light: { name: 'Sister Gold', value: '#FFA51E' } },
    { dark: { name: 'Sister Black', value: '#000000' }, light: { name: 'Charcoal', value: '#403E43' } },
    { dark: { name: 'Sister Peach', value: '#FFDCBD' }, light: { name: 'Soft Peach', value: '#FDE1D3' } },
    { dark: { name: 'Sister Gray', value: '#F4F4F4' }, light: { name: 'White', value: '#FFFFFF' } },
    { dark: { name: 'Soft Green', value: '#F2FCE2' }, light: { name: 'Soft Yellow', value: '#FEF7CD' } },
    { dark: { name: 'Soft Pink', value: '#FFDEE2' }, light: { name: 'Soft Blue', value: '#D3E4FD' } },
    { dark: { name: 'Soft Gray', value: '#F1F0FB' }, light: { name: 'White', value: '#FFFFFF' } },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {colorPairs.map((pair, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow" style={{ borderRadius: '0px' }}>
              <div className="h-24 flex">
                {/* Left side - Darker color */}
                <div 
                  className="w-1/2 relative cursor-pointer group"
                  style={{ backgroundColor: pair.dark.value }}
                  onClick={() => copyToClipboard(pair.dark.value, `${pair.dark.name}-${index}`)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                    {copiedColor === `${pair.dark.name}-${index}` ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Copy className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Right side - Lighter color */}
                <div 
                  className="w-1/2 relative cursor-pointer group"
                  style={{ backgroundColor: pair.light.value }}
                  onClick={() => copyToClipboard(pair.light.value, `${pair.light.name}-${index}`)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                    {copiedColor === `${pair.light.name}-${index}` ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Copy className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="flex justify-between items-start text-xs">
                  <div className="w-1/2 pr-1">
                    <p className="font-semibold text-xs font-poppins truncate">{pair.dark.name}</p>
                    <p className="text-xs text-gray-600 font-mono">{pair.dark.value}</p>
                  </div>
                  <div className="w-1/2 pl-1">
                    <p className="font-semibold text-xs font-poppins truncate">{pair.light.name}</p>
                    <p className="text-xs text-gray-600 font-mono">{pair.light.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandColors;
