import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";

type Shop = {
  id: string;
  name: string;
  address: string;
  description: string;
  image_url: string;
  map_url: string;
};

const ShopsManager = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    image_url: "",
    map_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Gagal memuat kedai");
      return;
    }

    setShops(data || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `shops/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('coffee-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('coffee-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success("Gambar berhasil diupload");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("coffee_shops")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast.error("Gagal mengupdate kedai");
        return;
      }

      toast.success("Kedai berhasil diupdate");
    } else {
      const { error } = await supabase
        .from("coffee_shops")
        .insert([formData]);

      if (error) {
        toast.error("Gagal menambah kedai");
        return;
      }

      toast.success("Kedai berhasil ditambahkan");
    }

    setOpen(false);
    resetForm();
    fetchShops();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kedai ini?")) return;

    const { error } = await supabase
      .from("coffee_shops")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus kedai");
      return;
    }

    toast.success("Kedai berhasil dihapus");
    fetchShops();
  };

  const handleEdit = (shop: Shop) => {
    setEditingId(shop.id);
    setFormData({
      name: shop.name,
      address: shop.address,
      description: shop.description,
      image_url: shop.image_url,
      map_url: shop.map_url,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      address: "",
      description: "",
      image_url: "",
      map_url: "",
    });
    clearFile();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Kelola Kedai Kopi</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kedai
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Kedai" : "Tambah Kedai"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Kedai</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Alamat</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                <label className="text-sm font-medium mb-2 block">Gambar</label>
                <div className="space-y-3">
                  {previewUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {!previewUrl && formData.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img src={formData.image_url} alt="Current" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                    )}
                  </div>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Atau masukkan URL gambar langsung"
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Google Maps Embed URL</label>
                <Textarea
                  value={formData.map_url}
                  onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                  required
                  rows={3}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Tambah"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((shop) => (
          <Card key={shop.id}>
            <CardHeader>
              <CardTitle className="text-xl">{shop.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{shop.address}</p>
              <p className="text-sm">{shop.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(shop)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(shop.id)}
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

export default ShopsManager;
