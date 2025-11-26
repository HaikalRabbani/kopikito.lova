import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import shop1Image from "@/assets/coffee-shop-1.jpg";
import shop2Image from "@/assets/coffee-shop-2.jpg";
import shop3Image from "@/assets/coffee-shop-3.jpg";
import shop4Image from "@/assets/coffee-shop-4.jpg";

type Shop = {
  id: string;
  name: string;
  address: string;
  description: string;
  image_url: string;
  map_url: string;
};

const imageMap: Record<string, string> = {
  "coffee-shop-1.jpg": shop1Image,
  "coffee-shop-2.jpg": shop2Image,
  "coffee-shop-3.jpg": shop3Image,
  "coffee-shop-4.jpg": shop4Image,
};

const CoffeeShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setShops(data);
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
            Daftar Kedai
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temukan kedai kopi favorit di Bengkulu. Setiap tempat punya suasana dan cerita yang
            berbeda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {shops.map((shop) => (
            <Link key={shop.id} to={`/shop/${shop.id}`}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary h-full cursor-pointer">

              <div className="aspect-video overflow-hidden">
                <img
                  src={imageMap[shop.image_url] || shop1Image}
                  alt={shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-3xl font-semibold mb-3 text-foreground">
                  {shop.name}
                </h3>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">{shop.address}</p>
                </div>
                <p className="text-foreground mb-4 leading-relaxed">{shop.description}</p>

                <div className="aspect-video rounded-lg overflow-hidden border-2 border-border">
                  <iframe
                    src={shop.map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Lokasi ${shop.name}`}
                  />
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeShops;
