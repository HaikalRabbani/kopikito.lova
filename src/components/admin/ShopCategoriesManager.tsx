import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

type ShopCategory = {
  id: string;
  shop_id: string;
  category_id: string;
};

type Shop = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  title: string;
};

const ShopCategoriesManager = () => {
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    shop_id: "",
    category_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [shopCategoriesRes, shopsRes, categoriesRes] = await Promise.all([
      supabase.from("shop_categories").select("*"),
      supabase.from("coffee_shops").select("id, name").order("name", { ascending: true }),
      supabase.from("coffee_categories").select("id, title").order("title", { ascending: true }),
    ]);

    if (!shopCategoriesRes.error) setShopCategories(shopCategoriesRes.data || []);
    if (!shopsRes.error) setShops(shopsRes.data || []);
    if (!categoriesRes.error) setCategories(categoriesRes.data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("shop_categories")
      .insert([formData]);

    if (error) {
      if (error.code === "23505") {
        toast.error("Relasi ini sudah ada");
      } else {
        toast.error("Gagal menambah relasi");
      }
      return;
    }

    toast.success("Relasi berhasil ditambahkan");
    setOpen(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus relasi ini?")) return;

    const { error } = await supabase
      .from("shop_categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus relasi");
      return;
    }

    toast.success("Relasi berhasil dihapus");
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      shop_id: "",
      category_id: "",
    });
  };

  const getShopName = (shopId: string) => {
    return shops.find(s => s.id === shopId)?.name || "Unknown";
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown";
  };

  const getCategoriesForShop = (shopId: string) => {
    return shopCategories
      .filter(sc => sc.shop_id === shopId)
      .map(sc => ({
        id: sc.id,
        name: getCategoryName(sc.category_id),
      }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Kelola Relasi Kedai-Kategori</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Relasi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Relasi Kedai-Kategori</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kedai</label>
                <Select
                  value={formData.shop_id}
                  onValueChange={(value) => setFormData({ ...formData, shop_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kedai" />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Kategori Kopi</label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Tambah
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((shop) => {
          const shopCats = getCategoriesForShop(shop.id);
          return (
            <Card key={shop.id}>
              <CardHeader>
                <CardTitle className="text-lg">{shop.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {shopCats.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada kategori</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {shopCats.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="gap-1">
                        {cat.name}
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ShopCategoriesManager;
