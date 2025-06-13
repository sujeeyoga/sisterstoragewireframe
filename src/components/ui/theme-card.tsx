
import React from 'react';
import { Card } from './card';
import { Button } from './button';
import { Package, Star, Heart, CheckCircle, Info, Zap } from 'lucide-react';

interface ThemeCardProps {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonVariant?: 'default' | 'primary-inverse' | 'secondary' | 'outline' | 'pink' | 'orange' | 'gold' | 'peach';
  theme: 'promotion' | 'action' | 'neutral' | 'testimonial' | 'success' | 'info';
  author?: string;
}

const themeConfig = {
  promotion: {
    backgrounds: ['#E90064', '#FE5FA4'],
    iconColors: ['#FE5FA4', '#E90064'],
    icons: [Heart, Star],
    textColor: 'text-white'
  },
  action: {
    backgrounds: ['#FF8021', '#FFA51E'],
    iconColors: ['#FFA51E', '#FF8021'],
    icons: [Package, Zap],
    textColor: 'text-white'
  },
  neutral: {
    backgrounds: ['#000000', '#403E43'],
    iconColors: ['#403E43', '#000000'],
    icons: [Info, CheckCircle],
    textColor: 'text-white'
  },
  testimonial: {
    backgrounds: ['#FFDCBD', '#FDE1D3'],
    iconColors: ['#FF8021', '#E90064'],
    icons: [Star, Star],
    textColor: 'text-black/90'
  },
  success: {
    backgrounds: ['#F2FCE2', '#FEF7CD'],
    iconColors: ['#4ADE80', '#FFA51E'],
    icons: [CheckCircle, Heart],
    textColor: 'text-black/90'
  },
  info: {
    backgrounds: ['#FFDEE2', '#D3E4FD'],
    iconColors: ['#E90064', '#3B82F6'],
    icons: [Info, CheckCircle],
    textColor: 'text-black/90'
  }
};

const ThemeCard: React.FC<ThemeCardProps> = ({ 
  title, 
  description, 
  buttonLabel, 
  buttonVariant = 'primary-inverse', 
  theme,
  author 
}) => {
  const config = themeConfig[theme];
  const IconComponent = config.icons[0];
  const backgroundColor = config.backgrounds[0];
  const iconColor = config.iconColors[0];

  if (theme === 'testimonial') {
    return (
      <Card className="p-6 md:p-8" style={{ borderRadius: '0px', backgroundColor }}>
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 stroke-[1.5] fill-current" style={{ color: iconColor }} />
            ))}
          </div>
          <p className="text-sm italic font-poppins" style={{ color: config.textColor === 'text-white' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.9)' }}>
            {description}
          </p>
          {author && (
            <p className="text-xs font-semibold font-poppins" style={{ color: config.textColor === 'text-white' ? '#D1D5DB' : 'rgba(0, 0, 0, 0.7)' }}>
              — {author}
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8" style={{ borderRadius: '0px', backgroundColor }}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IconComponent className="w-6 h-6 stroke-[1.5]" style={{ color: iconColor }} />
          <h3 className="font-bold text-lg font-poppins" style={{ color: config.textColor === 'text-white' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.9)' }}>
            {title}
          </h3>
        </div>
        <p className="text-sm font-poppins" style={{ color: config.textColor === 'text-white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.75)' }}>
          {description}
        </p>
        {buttonLabel && (
          <div className="pt-2">
            <Button size="sm" variant={buttonVariant} className="font-poppins" style={{ borderRadius: '0px' }}>
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ThemeCard;
