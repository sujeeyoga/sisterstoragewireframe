
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
  const renderButtonGroup = (title: string, buttons: any[]) => (
    <div>
      <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">{title}</h4>
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
              iconLeft={IconLeft ? <IconLeft /> : undefined}
              iconRight={IconRight ? <IconRight /> : undefined}
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
      <CardContent className="space-y-8">
        {renderButtonGroup('Primary Buttons', buttonExamples.primary)}
        {renderButtonGroup('Ghost Buttons with Icons', buttonExamples.ghost)}
        {renderButtonGroup('Brand Color Variants', buttonExamples.brand)}
        
        <div className="mt-6 p-4 bg-gray-50" style={{ borderRadius: '0px' }}>
          <h4 className="font-semibold mb-2 text-sm font-poppins">Enhanced Usage Guidelines:</h4>
          <ul className="text-sm space-y-1 font-poppins text-gray-700">
            {usageGuidelines.map((guideline, index) => (
              <li key={index}>
                <strong>{guideline.label}:</strong> {guideline.description}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonShowcase;
