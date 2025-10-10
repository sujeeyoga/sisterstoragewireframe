-- Drop and recreate the RLS policy for better anonymous access
DROP POLICY IF EXISTS "Sister stories are publicly viewable" ON public.sister_stories;

CREATE POLICY "Sister stories are publicly viewable"
  ON public.sister_stories
  FOR SELECT
  USING (
    is_active = true 
    OR (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'))
  );