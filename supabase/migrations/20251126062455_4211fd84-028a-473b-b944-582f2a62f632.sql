-- Create menu_items table for coffee products at each shop
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.coffee_shops(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.coffee_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create junction table for many-to-many relationship between shops and categories
CREATE TABLE public.shop_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.coffee_shops(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.coffee_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(shop_id, category_id)
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert menu items"
  ON public.menu_items FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update menu items"
  ON public.menu_items FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete menu items"
  ON public.menu_items FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for shop_categories
CREATE POLICY "Anyone can view shop categories"
  ON public.shop_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert shop categories"
  ON public.shop_categories FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete shop categories"
  ON public.shop_categories FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample shop_categories relationships
INSERT INTO public.shop_categories (shop_id, category_id)
SELECT s.id, c.id
FROM public.coffee_shops s
CROSS JOIN public.coffee_categories c
WHERE 
  (s.name = 'Kopi Bengkulu Corner' AND c.title IN ('Robusta Bengkulu', 'Americano', 'Es Kopi Susu Gula Aren'))
  OR (s.name = 'Kito Brew' AND c.title IN ('Robusta Bengkulu', 'Latte', 'Cappuccino'))
  OR (s.name = 'Ngopi di Pantai Panjang' AND c.title IN ('Es Kopi Susu Gula Aren', 'Latte', 'Americano'))
  OR (s.name = 'Teras Kopi Nusantara' AND c.title IN ('Cappuccino', 'Latte', 'Robusta Bengkulu'));

-- Insert sample menu items
INSERT INTO public.menu_items (shop_id, category_id, name, description, price, image_url)
SELECT 
  s.id,
  c.id,
  c.title,
  c.description,
  CASE 
    WHEN c.title LIKE '%Robusta%' THEN 15000
    WHEN c.title LIKE '%Es Kopi%' THEN 18000
    WHEN c.title LIKE '%Latte%' THEN 22000
    WHEN c.title LIKE '%Cappuccino%' THEN 24000
    ELSE 20000
  END,
  c.image_url
FROM public.coffee_shops s
JOIN public.shop_categories sc ON sc.shop_id = s.id
JOIN public.coffee_categories c ON c.id = sc.category_id;