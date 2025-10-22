-- Update the launch card text
UPDATE launch_cards 
SET 
  collection_name = 'Pssttt… there''s a secret drop.',
  tagline = NULL,
  description = 'Only the sisters knows when it happens. Sign up — and we''ll whisper the details when it''s time.',
  cta_label = 'Sign Me Up'
WHERE status = 'upcoming';