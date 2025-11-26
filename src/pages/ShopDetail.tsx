import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import americanoImage from "@/assets/americano.jpg";
import latteImage from "@/assets/latte.jpg";
import cappuccinoImage from "@/assets/cappuccino.jpg";
import robustaImage from "@/assets/robusta.jpg";
import esKopiImage from "@/assets/es-kopi-susu.jpg";

type Shop = {
  id: string;
  name: string;
  address: string;
  description: string;
  image_url: string;
  map_url: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
};

const imageMap: Record<string, string> = {
  "americano.jpg": americanoImage,
  "latte.jpg": latteImage,
  "cappuccino.jpg": cappuccinoImage,
  "robusta.jpg": robustaImage,
  "es-kopi-susu.jpg": esKopiImage,
};

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchShopDetails();
      fetchMenuItems();
    }
  }, [id]);

  const fetchShopDetails = async () => {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setShop(data);
    }
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("shop_id", id);

    if (!error && data) {
      setMenuItems(data);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Kedai tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Daftar Kedai", href: "/coffee-shops" },
            { label: shop.name },
          ]}
        />

        <Link to="/coffee-shops">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Kedai
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={imageMap[shop.image_url] || americanoImage}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              {shop.name}
            </h1>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <p className="text-lg">{shop.address}</p>
            </div>
            <p className="text-lg leading-relaxed">{shop.description}</p>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-semibold mb-6">Lokasi</h2>
          <div className="aspect-video rounded-xl overflow-hidden border-2 border-border">
            <iframe
              src={shop.map_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Menu Section */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-semibold mb-6">Menu Kopi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={imageMap[item.image_url] || americanoImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold text-primary">{formatPrice(item.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Coffees Section */}
        {menuItems.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-semibold mb-6">
              Kopi Lainnya dari Kedai Ini
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={imageMap[item.image_url] || americanoImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Menu Item Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">{selectedItem.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={imageMap[selectedItem.image_url] || americanoImage}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedItem.description}
                    </p>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Harga</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(selectedItem.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ShopDetail;
