import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import americanoImage from "@/assets/americano.jpg";
import latteImage from "@/assets/latte.jpg";
import cappuccinoImage from "@/assets/cappuccino.jpg";
import robustaImage from "@/assets/robusta.jpg";
import esKopiImage from "@/assets/es-kopi-susu.jpg";

type Category = {
  id: string;
  title: string;
  description: string;
  details: string;
  image_url: string;
};

const imageMap: Record<string, string> = {
  "americano.jpg": americanoImage,
  "latte.jpg": latteImage,
  "cappuccino.jpg": cappuccinoImage,
  "robusta.jpg": robustaImage,
  "es-kopi-susu.jpg": esKopiImage,
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("coffee_categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Kategori Kopi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dari yang klasik sampai yang kekinian, setiap kategori punya cerita dan karakter unik.
            Pilih yang sesuai dengan seleramu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary h-full cursor-pointer">

              <div className="aspect-square overflow-hidden">
                <img
                  src={imageMap[category.image_url] || americanoImage}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-3xl font-semibold mb-3 text-foreground">
                  {category.title}
                </h3>
                <p className="text-lg text-primary font-medium mb-3">
                  {category.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {category.details}
                </p>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
