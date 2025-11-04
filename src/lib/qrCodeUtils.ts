import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a random 6-character alphanumeric short code
 */
export function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check if a short code is unique in the database
 */
export async function isShortCodeUnique(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('id')
    .eq('short_code', code)
    .single();

  // If error or no data found, the code is unique
  return error !== null || data === null;
}

/**
 * Generate a unique short code that doesn't exist in the database
 */
export async function generateUniqueShortCode(): Promise<string> {
  let code = generateShortCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const isUnique = await isShortCodeUnique(code);
    if (isUnique) {
      return code;
    }
    code = generateShortCode();
    attempts++;
  }

  // If we couldn't find a unique code after max attempts, throw error
  throw new Error('Could not generate unique short code');
}

/**
 * Build the full short URL for a given short code
 */
export function buildShortUrl(shortCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/q/${shortCode}`;
}

/**
 * Download QR code as PNG image
 */
export function downloadQRCodeImage(
  svgElement: SVGSVGElement,
  name: string,
  shortCode: string
): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${shortCode}-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
}
