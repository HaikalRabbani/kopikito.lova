import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CategoriesManager from "@/components/admin/CategoriesManager";
import ShopsManager from "@/components/admin/ShopsManager";
import MessagesViewer from "@/components/admin/MessagesViewer";
import MenuManager from "@/components/admin/MenuManager";
import ShopCategoriesManager from "@/components/admin/ShopCategoriesManager";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin-login");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !roleData) {
        toast.error("Akses ditolak");
        navigate("/");
        return;
      }

      setLoading(false);
    } catch (error) {
      navigate("/admin-login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout berhasil");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="categories">Kategori</TabsTrigger>
            <TabsTrigger value="shops">Kedai</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="relations">Relasi</TabsTrigger>
            <TabsTrigger value="messages">Pesan</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="shops">
            <ShopsManager />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManager />
          </TabsContent>

          <TabsContent value="relations">
            <ShopCategoriesManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
