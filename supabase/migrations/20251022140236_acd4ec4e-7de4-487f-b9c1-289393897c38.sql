-- Create launch_cards table for upcoming collection showcases
CREATE TABLE launch_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  launch_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'archived')),
  waitlist_link TEXT,
  preview_link TEXT,
  cta_label TEXT DEFAULT 'Join the Waitlist',
  gradient_c1 TEXT DEFAULT '#FFB7C5',
  gradient_c2 TEXT DEFAULT '#FFD6E0',
  gradient_c3 TEXT DEFAULT '#FFF5F8',
  shimmer_speed NUMERIC DEFAULT 18,
  blur_level NUMERIC DEFAULT 55,
  priority INTEGER DEFAULT 1,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE launch_cards ENABLE ROW LEVEL SECURITY;

-- Public can view enabled upcoming cards
CREATE POLICY "Anyone can view enabled upcoming cards"
ON launch_cards
FOR SELECT
USING (
  (enabled = true AND status = 'upcoming') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can manage all cards
CREATE POLICY "Admins can manage launch cards"
ON launch_cards
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_launch_cards_updated_at
BEFORE UPDATE ON launch_cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed data with 3 example collections
INSERT INTO launch_cards 
(collection_name, tagline, description, launch_date, waitlist_link, gradient_c1, gradient_c2, gradient_c3, priority)
VALUES
('Aurora Bangle Set', 'Radiance in Every Turn', 'Hand-polished gold bangles that shimmer softly under morning light.', '2025-12-25', 'https://sisterstorage.com/waitlist', '#FFB7C5', '#FFD6E0', '#FFF5F8', 1),
('Luna Stack Rings', 'Moonlight Elegance', 'Minimal silver-rose stacks that play with reflection and movement.', '2025-12-30', 'https://sisterstorage.com/waitlist', '#E2C6FF', '#D9E8FF', '#FFF0FA', 2),
('Noir Velvet Box', 'Limited Collectors Edition', 'Midnight-black jewelry box lined with blush satin for timeless pieces.', '2026-01-15', 'https://sisterstorage.com/waitlist', '#1E1E1E', '#3B0A45', '#B02A5F', 3);