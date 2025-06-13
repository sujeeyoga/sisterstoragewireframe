
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
    iconColors: ['#FDE1D3', '#FFDCBD'],
    icons: [Star, Star],
    textColor: 'text-gray-800'
  },
  success: {
    backgrounds: ['#F2FCE2', '#FEF7CD'],
    iconColors: ['#FEF7CD', '#F2FCE2'],
    icons: [CheckCircle, Heart],
    textColor: 'text-gray-800'
  },
  info: {
    backgrounds: ['#FFDEE2', '#D3E4FD'],
    iconColors: ['#D3E4FD', '#FFDEE2'],
    icons: [Info, CheckCircle],
    textColor: 'text-gray-800'
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
      <Card className="p-4" style={{ borderRadius: '0px', backgroundColor }}>
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" style={{ color: iconColor }} />
            ))}
          </div>
          <p className="text-sm italic font-poppins" style={{ color: config.textColor === 'text-white' ? '#FFFFFF' : '#374151' }}>
            {description}
          </p>
          {author && (
            <p className="text-xs font-semibold font-poppins" style={{ color: config.textColor === 'text-white' ? '#D1D5DB' : '#6B7280' }}>
              — {author}
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4" style={{ borderRadius: '0px', backgroundColor }}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" style={{ color: iconColor }} />
          <h3 className="font-bold text-lg font-poppins" style={{ color: config.textColor === 'text-white' ? '#FFFFFF' : '#374151' }}>
            {title}
          </h3>
        </div>
        <p className="text-sm font-poppins opacity-90" style={{ color: config.textColor === 'text-white' ? '#FFFFFF' : '#6B7280' }}>
          {description}
        </p>
        {buttonLabel && (
          <Button size="sm" variant={buttonVariant} className="font-poppins" style={{ borderRadius: '0px' }}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ThemeCard;
