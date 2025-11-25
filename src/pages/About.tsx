import aboutBgImage from "@/assets/about-bg.jpg";

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Tentang Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cerita di Balik Setiap Cangkir Kopi
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl mb-12"
            style={{
              backgroundImage: `url(${aboutBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
            <div className="relative p-8 md:p-16">
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-primary/20 shadow-xl">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground mb-6">
                  Kopi Kito lahir dari kecintaan kami pada kopi lokal Bengkulu. Kami percaya setiap
                  seduhan punya cerita — dari kebun, barista, hingga meja pelanggan.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-foreground">
                  Kami ingin membawa rasa lokal ke pengalaman global, memperkenalkan keunikan
                  robusta Bengkulu kepada dunia sambil tetap menjaga kehangatan dan keakraban yang
                  menjadi ciri khas kami.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card rounded-2xl border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-serif font-bold text-primary mb-4">100%</div>
              <div className="text-lg font-medium text-foreground mb-2">Biji Kopi Lokal</div>
              <div className="text-muted-foreground">Langsung dari petani Bengkulu</div>
            </div>

            <div className="text-center p-8 bg-card rounded-2xl border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-serif font-bold text-primary mb-4">10+</div>
              <div className="text-lg font-medium text-foreground mb-2">Kedai Mitra</div>
              <div className="text-muted-foreground">Tersebar di seluruh Bengkulu</div>
            </div>

            <div className="text-center p-8 bg-card rounded-2xl border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-serif font-bold text-primary mb-4">5+</div>
              <div className="text-lg font-medium text-foreground mb-2">Tahun Pengalaman</div>
              <div className="text-muted-foreground">Melayani pecinta kopi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
