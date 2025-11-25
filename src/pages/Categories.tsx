import { Card, CardContent } from "@/components/ui/card";
import americanoImage from "@/assets/americano.jpg";
import latteImage from "@/assets/latte.jpg";
import cappuccinoImage from "@/assets/cappuccino.jpg";
import robustaImage from "@/assets/robusta.jpg";
import esKopiImage from "@/assets/es-kopi-susu.jpg";

const Categories = () => {
  const categories = [
    {
      title: "Americano",
      description: "Rasa klasik yang kuat, cocok untuk pecinta kopi hitam.",
      image: americanoImage,
      details:
        "Americano adalah espresso yang diencerkan dengan air panas, menciptakan kopi dengan rasa yang kuat namun tidak terlalu pekat. Sempurna untuk memulai hari atau menemani aktivitas.",
    },
    {
      title: "Latte",
      description: "Perpaduan lembut antara espresso dan susu hangat.",
      image: latteImage,
      details:
        "Latte adalah kombinasi harmonis antara espresso yang kaya dengan susu steamed yang lembut. Rasanya creamy dengan sedikit manis alami dari susu, sempurna untuk yang suka kopi tidak terlalu kuat.",
    },
    {
      title: "Cappuccino",
      description: "Kopi susu dengan busa tebal yang creamy.",
      image: cappuccinoImage,
      details:
        "Cappuccino terkenal dengan layer busa susunya yang tebal dan creamy. Perbandingan sempurna antara espresso, susu steamed, dan busa susu menciptakan tekstur yang unik dan rasa yang seimbang.",
    },
    {
      title: "Robusta Bengkulu",
      description: "Cita rasa khas Bengkulu, pekat dan berkarakter.",
      image: robustaImage,
      details:
        "Robusta Bengkulu adalah kebanggaan lokal. Ditanam di dataran tinggi Bengkulu, biji kopi ini menghasilkan seduhan yang pekat, strong, dengan hint cokelat dan rempah yang khas Indonesia.",
    },
    {
      title: "Es Kopi Susu Gula Aren",
      description: "Favorit masa kini dengan rasa manis alami.",
      image: esKopiImage,
      details:
        "Perpaduan es kopi dengan susu segar dan gula aren menciptakan minuman yang menyegarkan sekaligus manis. Gula aren memberikan rasa karamel alami yang khas Indonesia.",
    },
  ];

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
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
