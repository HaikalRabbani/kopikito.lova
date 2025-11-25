import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import shop1Image from "@/assets/coffee-shop-1.jpg";
import shop2Image from "@/assets/coffee-shop-2.jpg";
import shop3Image from "@/assets/coffee-shop-3.jpg";
import shop4Image from "@/assets/coffee-shop-4.jpg";

const CoffeeShops = () => {
  const shops = [
    {
      name: "Kopi Bengkulu Corner",
      address: "Jl. Soekarno Hatta, Bengkulu",
      description: "Kedai lokal dengan racikan robusta khas Bengkulu.",
      image: shop1Image,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.26!3d-3.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDcnMjQuMCJTIDEwMsKwMTUnMzYuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
    },
    {
      name: "Kito Brew",
      address: "Jl. Veteran, Bengkulu",
      description: "Suasana cozy dengan aroma kopi susu klasik.",
      image: shop2Image,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.27!3d-3.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDYnNDguMCJTIDEwMsKwMTYnMTIuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
    },
    {
      name: "Ngopi di Pantai Panjang",
      address: "Kawasan Pantai Panjang, Bengkulu",
      description: "Ngopi sambil nikmati angin laut dan senja.",
      image: shop3Image,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.25!3d-3.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDknMTIuMCJTIDEwMsKwMTUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
    },
    {
      name: "Teras Kopi Nusantara",
      address: "Jl. Basuki Rahmat, Bengkulu",
      description:
        "Campuran biji kopi lokal dan impor dalam satu racikan istimewa.",
      image: shop4Image,
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3516235!2d102.28!3d-3.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDYnMTIuMCJTIDEwMsKwMTYnNDguMCJF!5e0!3m2!1sen!2sid!4v1234567890",
    },
  ];

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
          {shops.map((shop, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={shop.image}
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
                    src={shop.mapUrl}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeShops;
