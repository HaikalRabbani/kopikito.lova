import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email tidak valid").max(255, "Email terlalu panjang"),
  password: z.string().min(6, "Password minimal 6 karakter").max(72, "Password terlalu panjang"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const AdminRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validasi input
      const validatedData = registerSchema.parse({
        email: email.trim(),
        password,
        confirmPassword,
      });

      // Signup user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error("Pendaftaran gagal. Silakan coba lagi.");
      }

      // Tambahkan role admin
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: signUpData.user.id,
          role: "admin",
        });

      if (roleError) {
        console.error("Error adding admin role:", roleError);
        // Hapus user jika gagal menambahkan role
        await supabase.auth.admin.deleteUser(signUpData.user.id);
        throw new Error("Gagal menambahkan role admin. Silakan coba lagi.");
      }

      toast.success("Admin berhasil didaftarkan!");
      navigate("/admin");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error.message || "Pendaftaran gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center">
            Daftar Admin
          </CardTitle>
          <CardDescription className="text-center">
            Buat akun admin baru untuk Kopi Kito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@kopikito.com"
                maxLength={255}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
                maxLength={72}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Konfirmasi Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Masukkan ulang password"
                maxLength={72}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link to="/admin-login" className="text-primary hover:underline">
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;
