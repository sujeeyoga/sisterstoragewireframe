-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can read active QR codes" ON public.qr_codes;

-- Create new policy that properly handles unauthenticated users
CREATE POLICY "Anyone can read active QR codes"
  ON public.qr_codes
  FOR SELECT
  USING (
    is_active = true 
    OR (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'))
  );