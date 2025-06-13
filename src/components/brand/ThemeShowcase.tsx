
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
    <div className={`p-8 rounded-lg ${sectionBg || ''}`}>
      <h4 className="font-semibold mb-8 font-poppins text-sm uppercase tracking-wide">{title}</h4>
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
      <CardContent className="space-y-16">
        {renderThemeSection('Promotional Theme', 'promotion', themeExamples.promotion, 'bg-gradient-to-br from-pink-50/40 to-pink-100/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Action Theme', 'action', themeExamples.action, 'bg-gradient-to-br from-orange-50/40 to-orange-100/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Neutral Theme', 'neutral', themeExamples.neutral, 'bg-gradient-to-br from-gray-900/5 to-gray-800/10')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Testimonial Theme', 'testimonial', themeExamples.testimonial, 'bg-gradient-to-br from-amber-50/40 to-peach-100/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Success Theme', 'success', themeExamples.success, 'bg-gradient-to-br from-green-50/40 to-green-100/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Informational Theme', 'info', themeExamples.info, 'bg-gradient-to-br from-blue-50/40 to-blue-100/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('White Theme', 'white', themeExamples.white, 'bg-gradient-to-br from-slate-50/40 to-gray-50/30')}
        
        <div className="border-t border-gray-200"></div>
        {renderThemeSection('Gray Theme', 'gray', themeExamples.gray, 'bg-gradient-to-br from-gray-100/40 to-gray-200/30')}
      </CardContent>
    </Card>
  );
};

export default ThemeShowcase;
