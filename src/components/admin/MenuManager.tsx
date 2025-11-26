import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

type MenuItem = {
  id: string;
  shop_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

type Shop = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  title: string;
};

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shop_id: "",
    category_id: "",
    name: "",
    description: "",
    price: 0,
    image_url: "",
  });

  useEffect(() => {
    fetchMenuItems();
    fetchShops();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Gagal memuat menu");
      return;
    }

    setMenuItems(data || []);
  };

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("id, name")
      .order("name", { ascending: true });

    if (!error && data) {
      setShops(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("coffee_categories")
      .select("id, title")
      .order("title", { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("menu_items")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast.error("Gagal mengupdate menu");
        return;
      }

      toast.success("Menu berhasil diupdate");
    } else {
      const { error } = await supabase
        .from("menu_items")
        .insert([formData]);

      if (error) {
        toast.error("Gagal menambah menu");
        return;
      }

      toast.success("Menu berhasil ditambahkan");
    }

    setOpen(false);
    resetForm();
    fetchMenuItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus menu");
      return;
    }

    toast.success("Menu berhasil dihapus");
    fetchMenuItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      shop_id: item.shop_id,
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      shop_id: "",
      category_id: "",
      name: "",
      description: "",
      price: 0,
      image_url: "",
    });
  };

  const getShopName = (shopId: string) => {
    return shops.find(s => s.id === shopId)?.name || "Unknown";
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Kelola Menu Kopi</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Menu" : "Tambah Menu"}
              </DialogTitle>
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
                <label className="text-sm font-medium mb-2 block">Kategori</label>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Menu</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Harga (Rp)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">URL Gambar</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  placeholder="nama-file.jpg"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Tambah"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Kedai:</span> {getShopName(item.shop_id)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Kategori:</span> {getCategoryName(item.category_id)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Harga:</span> Rp {item.price.toLocaleString('id-ID')}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;
