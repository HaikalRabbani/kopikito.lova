import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import americanoImage from "@/assets/americano.jpg";

type Category = {
  id: string;
  title: string;
  description: string;
};

type Shop = {
  id: string;
  name: string;
  address: string;
  description: string;
  image_url: string;
};

const imageMap: Record<string, string> = {
  "coffee-shop-1.jpg": require("@/assets/coffee-shop-1.jpg"),
  "coffee-shop-2.jpg": require("@/assets/coffee-shop-2.jpg"),
  "coffee-shop-3.jpg": require("@/assets/coffee-shop-3.jpg"),
  "coffee-shop-4.jpg": require("@/assets/coffee-shop-4.jpg"),
};

const CategoryShops = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCategoryAndShops();
    }
  }, [id]);

  const fetchCategoryAndShops = async () => {
    // Fetch category details
    const { data: categoryData, error: categoryError } = await supabase
      .from("coffee_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (!categoryError && categoryData) {
      setCategory(categoryData);
    }

    // Fetch shops that serve this category
    const { data: shopsData, error: shopsError } = await supabase
      .from("shop_categories")
      .select("coffee_shops(*)")
      .eq("category_id", id);

    if (!shopsError && shopsData) {
      const shopsList = shopsData.map((item: any) => item.coffee_shops);
      setShops(shopsList);
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

  if (!category) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Kategori tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Kategori Kopi", href: "/categories" },
            { label: category.title },
          ]}
        />

        <Link to="/categories">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Kategori
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">
            {category.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Belum ada kedai yang menyajikan kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <Link key={shop.id} to={`/shop/${shop.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imageMap[shop.image_url] || americanoImage}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-2xl font-semibold mb-3 text-foreground">
                      {shop.name}
                    </h3>
                    <div className="flex items-start gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p className="text-sm">{shop.address}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {shop.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryShops;
