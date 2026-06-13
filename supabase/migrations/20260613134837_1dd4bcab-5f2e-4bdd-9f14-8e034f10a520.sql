
-- 1) menu_items: recreate write policies to authenticated only
DROP POLICY IF EXISTS "Only admins can delete menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Only admins can insert menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Only admins can update menu items" ON public.menu_items;

CREATE POLICY "Only admins can delete menu items" ON public.menu_items
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert menu items" ON public.menu_items
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update menu items" ON public.menu_items
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) shop_categories: recreate write policies to authenticated only
DROP POLICY IF EXISTS "Only admins can delete shop categories" ON public.shop_categories;
DROP POLICY IF EXISTS "Only admins can insert shop categories" ON public.shop_categories;

CREATE POLICY "Only admins can delete shop categories" ON public.shop_categories
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert shop categories" ON public.shop_categories
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3) Remove broad SELECT (listing) policy on coffee-images bucket.
-- Public bucket files remain accessible via public URLs without requiring storage.objects SELECT policy.
DROP POLICY IF EXISTS "Anyone can view coffee images" ON storage.objects;

-- 4) Lock down internal trigger function from direct API execution.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
