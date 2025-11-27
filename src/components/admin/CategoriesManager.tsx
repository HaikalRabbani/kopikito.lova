import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";

type Category = {
  id: string;
  title: string;
  description: string;
  details: string;
  image_url: string;
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("coffee_categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Gagal memuat kategori");
      return;
    }

    setCategories(data || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);
    
    // Create preview
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
      const filePath = `categories/${fileName}`;

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
        .from("coffee_categories")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast.error("Gagal mengupdate kategori");
        return;
      }

      toast.success("Kategori berhasil diupdate");
    } else {
      const { error } = await supabase
        .from("coffee_categories")
        .insert([formData]);

      if (error) {
        toast.error("Gagal menambah kategori");
        return;
      }

      toast.success("Kategori berhasil ditambahkan");
    }

    setOpen(false);
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    const { error } = await supabase
      .from("coffee_categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus kategori");
      return;
    }

    toast.success("Kategori berhasil dihapus");
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      title: category.title,
      description: category.description,
      details: category.details,
      image_url: category.image_url,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      details: "",
      image_url: "",
    });
    clearFile();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Kelola Kategori Kopi</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Kategori" : "Tambah Kategori"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Judul</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi Singkat</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Detail</label>
                <Textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  required
                  rows={4}
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
              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Tambah"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-xl">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
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

export default CategoriesManager;
