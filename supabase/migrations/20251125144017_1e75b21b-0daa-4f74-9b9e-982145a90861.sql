-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create coffee categories table
CREATE TABLE public.coffee_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coffee shops table
CREATE TABLE public.coffee_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  map_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  pesan TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.coffee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
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

-- RLS Policies for coffee_categories
CREATE POLICY "Anyone can view coffee categories"
  ON public.coffee_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert coffee categories"
  ON public.coffee_categories FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update coffee categories"
  ON public.coffee_categories FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete coffee categories"
  ON public.coffee_categories FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coffee_shops
CREATE POLICY "Anyone can view coffee shops"
  ON public.coffee_shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert coffee shops"
  ON public.coffee_shops FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update coffee shops"
  ON public.coffee_shops FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete coffee shops"
  ON public.coffee_shops FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('coffee-images', 'coffee-images', true);

-- Storage policies for coffee-images bucket
CREATE POLICY "Anyone can view coffee images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'coffee-images');

CREATE POLICY "Admins can upload coffee images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'coffee-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update coffee images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'coffee-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete coffee images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'coffee-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_coffee_categories_updated_at
  BEFORE UPDATE ON public.coffee_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coffee_shops_updated_at
  BEFORE UPDATE ON public.coffee_shops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for coffee categories
INSERT INTO public.coffee_categories (title, description, details, image_url) VALUES
('Americano', 'Rasa klasik yang kuat, cocok untuk pecinta kopi hitam.', 'Americano adalah espresso yang diencerkan dengan air panas, menciptakan kopi dengan rasa yang kuat namun tidak terlalu pekat. Sempurna untuk memulai hari atau menemani aktivitas.', 'americano.jpg'),
('Latte', 'Perpaduan lembut antara espresso dan susu hangat.', 'Latte adalah kombinasi harmonis antara espresso yang kaya dengan susu steamed yang lembut. Rasanya creamy dengan sedikit manis alami dari susu, sempurna untuk yang suka kopi tidak terlalu kuat.', 'latte.jpg'),
('Cappuccino', 'Kopi susu dengan busa tebal yang creamy.', 'Cappuccino terkenal dengan layer busa susunya yang tebal dan creamy. Perbandingan sempurna antara espresso, susu steamed, dan busa susu menciptakan tekstur yang unik dan rasa yang seimbang.', 'cappuccino.jpg'),
('Robusta Bengkulu', 'Cita rasa khas Bengkulu, pekat dan berkarakter.', 'Robusta Bengkulu adalah kebanggaan lokal. Ditanam di dataran tinggi Bengkulu, biji kopi ini menghasilkan seduhan yang pekat, strong, dengan hint cokelat dan rempah yang khas Indonesia.', 'robusta.jpg'),
('Es Kopi Susu Gula Aren', 'Favorit masa kini dengan rasa manis alami.', 'Perpaduan es kopi dengan susu segar dan gula aren menciptakan minuman yang menyegarkan sekaligus manis. Gula aren memberikan rasa karamel alami yang khas Indonesia.', 'es-kopi-susu.jpg');

-- Insert sample data for coffee shops
INSERT INTO public.coffee_shops (name, address, description, image_url, map_url) VALUES
('Kopi Bengkulu Corner', 'Jl. Soekarno Hatta, Bengkulu', 'Kedai lokal dengan racikan robusta khas Bengkulu.', 'coffee-shop-1.jpg', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.26!3d-3.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDcnMjQuMCJTIDEwMsKwMTUnMzYuMCJF!5e0!3m2!1sen!2sid!4v1234567890'),
('Kito Brew', 'Jl. Veteran, Bengkulu', 'Suasana cozy dengan aroma kopi susu klasik.', 'coffee-shop-2.jpg', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.27!3d-3.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDYnNDguMCJTIDEwMsKwMTYnMTIuMCJF!5e0!3m2!1sen!2sid!4v1234567890'),
('Ngopi di Pantai Panjang', 'Kawasan Pantai Panjang, Bengkulu', 'Ngopi sambil nikmati angin laut dan senja.', 'coffee-shop-3.jpg', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.25!3d-3.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDknMTIuMCJTIDEwMsKwMTUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890'),
('Teras Kopi Nusantara', 'Jl. Basuki Rahmat, Bengkulu', 'Campuran biji kopi lokal dan impor dalam satu racikan istimewa.', 'coffee-shop-4.jpg', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.28!3d-3.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDYnMTIuMCJTIDEwMsKwMTYnNDguMCJF!5e0!3m2!1sen!2sid!4v1234567890');