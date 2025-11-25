import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      toast("Pesan kamu berhasil dikirim!", {
        description: "Kami akan segera menghubungi kamu.",
      });

      setFormData({ nama: "", email: "", pesan: "" });
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim pesan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ada pertanyaan atau saran? Kami senang mendengar dari kamu!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card className="border-2">
              <CardContent className="p-8">
                <h2 className="font-serif text-3xl font-semibold mb-6 text-foreground">
                  Kirim Pesan
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nama" className="text-base">
                      Nama
                    </Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="Nama kamu"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pesan" className="text-base">
                      Pesan
                    </Label>
                    <Textarea
                      id="pesan"
                      name="pesan"
                      value={formData.pesan}
                      onChange={handleChange}
                      required
                      className="mt-2 min-h-[150px]"
                      placeholder="Tulis pesan kamu di sini..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                      Alamat
                    </h3>
                    <p className="text-muted-foreground">
                      Jl. Soekarno Hatta No. 123
                      <br />
                      Bengkulu, Indonesia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                      Email
                    </h3>
                    <p className="text-muted-foreground">info@kopikito.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                      Telepon
                    </h3>
                    <p className="text-muted-foreground">+62 812-3456-7890</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-semibold mb-3">Jam Operasional</h3>
                <div className="space-y-2 text-primary-foreground/90">
                  <p>Senin - Jumat: 08:00 - 20:00</p>
                  <p>Sabtu - Minggu: 09:00 - 21:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
