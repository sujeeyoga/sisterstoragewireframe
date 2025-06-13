
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
    <div className={`p-8 rounded-lg ${sectionBg || ''}`}>
      <h4 className="font-semibold mb-8 font-poppins text-sm uppercase tracking-wide">{title}</h4>
      <div className="grid grid-cols-12 gap-4">
        {buttons.map((button, index) => {
          const IconLeft = button.iconLeft ? iconMap[button.iconLeft] : null;
          const IconRight = button.iconRight ? iconMap[button.iconRight] : null;

          return (
            <div key={index} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <Button
                variant={button.variant}
                className="font-poppins w-full"
                style={{ borderRadius: '0px' }}
                iconLeft={IconLeft ? <IconLeft className="w-4 h-4 stroke-[1.5]" /> : undefined}
                iconRight={IconRight ? <IconRight className="w-4 h-4 stroke-[1.5]" /> : undefined}
              >
                {button.label}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card style={{ borderRadius: '0px' }}>
      <CardHeader className="pb-8">
        <CardTitle className="font-poppins text-2xl">Enhanced Button System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-16">
        {renderButtonGroup('Primary Buttons', buttonExamples.primary, 'bg-gray-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderButtonGroup('Ghost Buttons with Icons', buttonExamples.ghost, 'bg-slate-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderButtonGroup('Brand Color Variants', buttonExamples.brand, 'bg-pink-50/30')}
        
        <div className="grid grid-cols-12 gap-6 mt-12">
          <div className="col-span-12 p-8 bg-gray-50 rounded-lg" style={{ borderRadius: '8px' }}>
            <h4 className="font-semibold mb-6 text-sm font-poppins">Enhanced Usage Guidelines:</h4>
            <div className="grid grid-cols-12 gap-4">
              {usageGuidelines.map((guideline, index) => (
                <div key={index} className="col-span-12 md:col-span-6 lg:col-span-4">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <div className="text-sm font-poppins text-gray-700">
                      <strong>{guideline.label}:</strong> {guideline.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonShowcase;
