import { Link } from 'react-router-dom';
import { useAnnouncementBanner } from '@/hooks/useAnnouncementBanner';

export const AnnouncementBanner = () => {
  const { banner, isLoading } = useAnnouncementBanner();

  if (isLoading || !banner.enabled || !banner.message?.trim()) return null;

  const hasButton = Boolean(banner.buttonLabel?.trim() && banner.buttonLink?.trim());
  const isExternal = /^https?:\/\//i.test(banner.buttonLink || '');

  return (
    <div className="w-full bg-[hsl(var(--brand-pink))] text-white">
      <div className="container-custom flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-sm font-medium">
        <span>{banner.message}</span>
        {hasButton &&
          (isExternal ? (
            <a
              href={banner.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 font-semibold hover:opacity-80"
            >
              {banner.buttonLabel}
            </a>
          ) : (
            <Link
              to={banner.buttonLink}
              className="underline underline-offset-4 font-semibold hover:opacity-80"
            >
              {banner.buttonLabel}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
