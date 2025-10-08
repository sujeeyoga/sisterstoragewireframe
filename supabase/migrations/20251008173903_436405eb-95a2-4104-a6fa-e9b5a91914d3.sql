-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create shop_sections table
CREATE TABLE public.shop_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    background_color TEXT DEFAULT 'bg-background',
    display_order INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT true,
    layout_columns INTEGER DEFAULT 3,
    category_filter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on shop_sections
ALTER TABLE public.shop_sections ENABLE ROW LEVEL SECURITY;

-- Shop sections policies
CREATE POLICY "Anyone can view visible sections"
ON public.shop_sections
FOR SELECT
USING (visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sections"
ON public.shop_sections
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update trigger for shop_sections
CREATE TRIGGER update_shop_sections_updated_at
BEFORE UPDATE ON public.shop_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update woocommerce_products policies for admin access
CREATE POLICY "Admins can manage products"
ON public.woocommerce_products
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default shop sections
INSERT INTO public.shop_sections (name, title, subtitle, display_order, category_filter, layout_columns) VALUES
('top-bundles', 'Top-Selling Bundles', 'Complete jewelry storage solutions', 1, 'Bundles', 3),
('individual-boxes', 'Individual Bangle Boxes', 'Mix and match your perfect storage', 2, 'Bangle Boxes', 4),
('organizers', 'Jewelry Organizers', 'Keep your collection organized', 3, 'Organizers', 3),
('open-box', 'Open Box Deals', 'Great savings on quality items', 4, 'Open Box', 3);