-- Create WooCommerce integration tables
CREATE TABLE public.woocommerce_products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2),
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER,
  manage_stock BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]',
  categories JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '[]',
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create WooCommerce orders table
CREATE TABLE public.woocommerce_orders (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL,
  total DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  billing JSONB DEFAULT '{}',
  shipping JSONB DEFAULT '{}',
  line_items JSONB DEFAULT '[]',
  meta_data JSONB DEFAULT '{}',
  date_created TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create WooCommerce customers table
CREATE TABLE public.woocommerce_customers (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  billing JSONB DEFAULT '{}',
  shipping JSONB DEFAULT '{}',
  orders_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sync log table for tracking WooCommerce syncs
CREATE TABLE public.woocommerce_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  records_processed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.woocommerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.woocommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.woocommerce_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.woocommerce_sync_log ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.woocommerce_products 
FOR SELECT 
USING (true);

-- Create policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" 
ON public.woocommerce_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.woocommerce_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for customers (users can only see their own data)
CREATE POLICY "Users can view their own customer data" 
ON public.woocommerce_customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data" 
ON public.woocommerce_customers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for sync log (admin access only - will be handled by Edge Functions)
CREATE POLICY "Sync log is readable by service role" 
ON public.woocommerce_sync_log 
FOR ALL 
USING (false);

-- Create indexes for better performance
CREATE INDEX idx_woocommerce_products_categories ON public.woocommerce_products USING GIN(categories);
CREATE INDEX idx_woocommerce_products_in_stock ON public.woocommerce_products(in_stock);
CREATE INDEX idx_woocommerce_orders_user_id ON public.woocommerce_orders(user_id);
CREATE INDEX idx_woocommerce_orders_status ON public.woocommerce_orders(status);
CREATE INDEX idx_woocommerce_customers_user_id ON public.woocommerce_customers(user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_woocommerce_products_updated_at
    BEFORE UPDATE ON public.woocommerce_products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_woocommerce_orders_updated_at
    BEFORE UPDATE ON public.woocommerce_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_woocommerce_customers_updated_at
    BEFORE UPDATE ON public.woocommerce_customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();