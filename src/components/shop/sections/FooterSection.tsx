import React from "react";
import { useSiteTexts } from "@/hooks/useSiteTexts";

const FooterSection: React.FC = () => {
  const { texts } = useSiteTexts('footer_copyright');
  const footerText = (texts as any)?.subtitle || '© 2025 Sister Storage — Culture without clutter.';
  
  return (
    <footer className="text-center text-xs text-muted-foreground py-6 uppercase tracking-widest border-t border-border mt-4">
      {footerText}
    </footer>
  );
};

export default FooterSection;
