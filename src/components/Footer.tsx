import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';

// Custom Pinterest icon since it's not available in lucide-react
const PinterestIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest h-4 w-4">
      <path d="M9 22c-.4-.7-.9-1.6-.9-3.2 0-1.3.9-2.6 2.5-2.6 1.2 0 2.1.7 2.1 1.9 0 1.2-.7 3-1.5 4.2"></path>
      <path d="M9.5 9.3c0 .5.1 1 .4 1.5l1.5 6.4"></path>
      <path d="M9.9 5.1a8 8 0 1 1-3 15.9 8 8 0 0 0 6.1-2"></path>
      <path d="M12 2a10 10 0 0 0-7.1 17"></path>
    </svg>
  );
};

const Footer = () => {
  const { texts: brandTexts } = useSiteTexts('footer_brand');
  const { texts: copyrightTexts } = useSiteTexts('footer_copyright');

  const brandText = brandTexts as any;
  const copyrightText = copyrightTexts as any;

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-10 md:py-12">
        <div className="flex flex-col items-center text-center space-y-5 px-4 md:px-0">
          {/* Brand and Description */}
          {brandText && (
            <div className="space-y-3 max-w-xl">
              <EditableText
                siteTextId={brandText.id}
                field="title"
                value={brandText.title}
                as="h2"
                className="font-bold"
              />
              <EditableText
                siteTextId={brandText.id}
                field="description"
                value={brandText.description}
                as="p"
                className="text-gray-400"
              />
            </div>
          )}

          {/* Social */}
          <div className="flex space-x-5">
            <a href="https://www.instagram.com/sisterstorageinc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Pinterest">
              <PinterestIcon />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 px-4 md:px-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sister Storage. All rights reserved.{' '}
            {copyrightText && (
              <EditableText
                siteTextId={copyrightText.id}
                field="description"
                value={copyrightText.description}
                as="span"
              />
            )}
          </p>
          <div className="flex space-x-5 text-sm">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-400">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
