
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, Truck, Info } from 'lucide-react';
import { buttonExamples, usageGuidelines } from '@/config/theme-examples';

const iconMap = {
  'arrow-right': ArrowRight,
  'shopping-bag': ShoppingBag,
  'truck': Truck,
  'info': Info,
};

const ButtonShowcase = () => {
  const renderButtonGroup = (title: string, buttons: any[], sectionBg?: string) => (
    <div className={`p-6 rounded-lg ${sectionBg || ''}`}>
      <h4 className="font-semibold mb-6 font-poppins text-sm uppercase tracking-wide">{title}</h4>
      <div className="flex flex-wrap gap-4">
        {buttons.map((button, index) => {
          const IconLeft = button.iconLeft ? iconMap[button.iconLeft] : null;
          const IconRight = button.iconRight ? iconMap[button.iconRight] : null;

          return (
            <Button
              key={index}
              variant={button.variant}
              className="font-poppins"
              style={{ borderRadius: '0px' }}
              iconLeft={IconLeft ? <IconLeft className="w-4 h-4 stroke-[1.5]" /> : undefined}
              iconRight={IconRight ? <IconRight className="w-4 h-4 stroke-[1.5]" /> : undefined}
            >
              {button.label}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card style={{ borderRadius: '0px' }}>
      <CardHeader>
        <CardTitle className="font-poppins">Enhanced Button System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {renderButtonGroup('Primary Buttons', buttonExamples.primary, 'bg-gray-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderButtonGroup('Ghost Buttons with Icons', buttonExamples.ghost, 'bg-slate-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderButtonGroup('Brand Color Variants', buttonExamples.brand, 'bg-pink-50/30')}
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg" style={{ borderRadius: '8px' }}>
          <h4 className="font-semibold mb-4 text-sm font-poppins">Enhanced Usage Guidelines:</h4>
          <ul className="text-sm space-y-2 font-poppins text-gray-700">
            {usageGuidelines.map((guideline, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong>{guideline.label}:</strong> {guideline.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonShowcase;
