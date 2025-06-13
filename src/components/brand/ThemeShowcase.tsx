
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeCard from '@/components/ui/theme-card';
import { themeExamples } from '@/config/theme-examples';

const ThemeShowcase = () => {
  const renderThemeSection = (
    title: string,
    theme: keyof typeof themeExamples,
    examples: any[]
  ) => (
    <div>
      <h4 className="font-semibold mb-4 font-poppins text-sm uppercase tracking-wide">{title}</h4>
      <div className="grid md:grid-cols-2 gap-4">
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
      <CardContent className="space-y-8">
        {renderThemeSection('Promotional Theme', 'promotion', themeExamples.promotion)}
        {renderThemeSection('Action Theme', 'action', themeExamples.action)}
        {renderThemeSection('Neutral Theme', 'neutral', themeExamples.neutral)}
        {renderThemeSection('Testimonial Theme', 'testimonial', themeExamples.testimonial)}
        {renderThemeSection('Success Theme', 'success', themeExamples.success)}
        {renderThemeSection('Informational Theme', 'info', themeExamples.info)}
      </CardContent>
    </Card>
  );
};

export default ThemeShowcase;
