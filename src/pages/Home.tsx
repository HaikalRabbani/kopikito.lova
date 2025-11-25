import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-coffee.jpg";
import americanoImage from "@/assets/americano.jpg";
import latteImage from "@/assets/latte.jpg";
import cappuccinoImage from "@/assets/cappuccino.jpg";
import robustaImage from "@/assets/robusta.jpg";

const Home = () => {
  const featuredCoffees = [
    {
      title: "Americano",
      description: "Rasa klasik yang kuat, cocok untuk pecinta kopi hitam.",
      image: americanoImage,
    },
    {
      title: "Latte",
      description: "Perpaduan lembut antara espresso dan susu hangat.",
      image: latteImage,
    },
    {
      title: "Cappuccino",
      description: "Kopi susu dengan busa tebal yang creamy.",
      image: cappuccinoImage,
    },
    {
      title: "Robusta Bengkulu",
      description: "Cita rasa khas Bengkulu, pekat dan berkarakter.",
      image: robustaImage,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Nikmati Cerita di Setiap Seduhan
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Dari aroma robusta Bengkulu sampai rasa manis latte kekinian — semua ada di Kopi Kito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kedai">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                Jelajahi Kedai
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/kategori">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all border-2"
              >
                Lihat Menu Kopi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Coffee Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kopi Pilihan Kami
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap cangkir punya cerita. Temukan favoritmu di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCoffees.map((coffee, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={coffee.image}
                  alt={coffee.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">
                  {coffee.title}
                </h3>
                <p className="text-muted-foreground">{coffee.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/kategori">
            <Button size="lg" variant="outline" className="shadow-md">
              Lihat Semua Kategori
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Siap Untuk Ngopi?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Temukan kedai kopi favorit kamu dan rasakan kehangatan di setiap cangkir.
          </p>
          <Link to="/kedai">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl"
            >
              Cari Kedai Terdekat
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
