
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
    <div className={`p-8 rounded-lg ${sectionBg || ''} mb-12`}>
      <h4 className="font-semibold mb-8 font-poppins text-sm uppercase tracking-wide">{title}</h4>
      <div className="grid grid-cols-12 gap-6">
        {examples.map((example, index) => (
          <div key={index} className="col-span-12 md:col-span-6">
            <ThemeCard
              title={example.title}
              description={example.description}
              buttonLabel={example.buttonLabel}
              theme={theme}
              author={example.author}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card style={{ borderRadius: '0px' }}>
      <CardHeader className="pb-8">
        <CardTitle className="font-poppins text-2xl">Systematic Theme Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderThemeSection('Promotional Theme', 'promotion', themeExamples.promotion, 'bg-gradient-to-br from-pink-50/40 to-pink-100/30')}
        
        {renderThemeSection('Action Theme', 'action', themeExamples.action, 'bg-gradient-to-br from-orange-50/40 to-orange-100/30')}
        
        {renderThemeSection('Neutral Theme', 'neutral', themeExamples.neutral, 'bg-gradient-to-br from-gray-900/5 to-gray-800/10')}
        
        {renderThemeSection('Testimonial Theme', 'testimonial', themeExamples.testimonial, 'bg-gradient-to-br from-amber-50/40 to-peach-100/30')}
        
        {renderThemeSection('Success Theme', 'success', themeExamples.success, 'bg-gradient-to-br from-green-50/40 to-green-100/30')}
        
        {renderThemeSection('Informational Theme', 'info', themeExamples.info, 'bg-gradient-to-br from-blue-50/40 to-blue-100/30')}
        
        {renderThemeSection('White Theme', 'white', themeExamples.white, 'bg-gradient-to-br from-slate-50/40 to-gray-50/30')}
        
        {renderThemeSection('Gray Theme', 'gray', themeExamples.gray, 'bg-gradient-to-br from-gray-100/40 to-gray-200/30')}
      </CardContent>
    </Card>
  );
};

export default ThemeShowcase;
