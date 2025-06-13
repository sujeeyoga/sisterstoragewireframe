
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeCard from '@/components/ui/theme-card';
import { themeExamples } from '@/config/theme-examples';

const ThemeShowcase = () => {
  const renderThemeSection = (
    title: string,
    theme: keyof typeof themeExamples,
    examples: any[],
    sectionBg?: string
  ) => (
    <div className={`p-6 rounded-lg ${sectionBg || ''}`}>
      <h4 className="font-semibold mb-6 font-poppins text-sm uppercase tracking-wide">{title}</h4>
      <div className="grid md:grid-cols-2 gap-6">
        {examples.map((example, index) => (
          <ThemeCard
            key={index}
            title={example.title}
            description={example.description}
            buttonLabel={example.buttonLabel}
            theme={theme}
            author={example.author}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Card style={{ borderRadius: '0px' }}>
      <CardHeader>
        <CardTitle className="font-poppins">Systematic Theme Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {renderThemeSection('Promotional Theme', 'promotion', themeExamples.promotion, 'bg-pink-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderThemeSection('Action Theme', 'action', themeExamples.action, 'bg-orange-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderThemeSection('Neutral Theme', 'neutral', themeExamples.neutral, 'bg-gray-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderThemeSection('Testimonial Theme', 'testimonial', themeExamples.testimonial, 'bg-amber-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderThemeSection('Success Theme', 'success', themeExamples.success, 'bg-green-50/30')}
        
        <div className="border-t border-gray-100"></div>
        {renderThemeSection('Informational Theme', 'info', themeExamples.info, 'bg-blue-50/30')}
      </CardContent>
    </Card>
  );
};

export default ThemeShowcase;
