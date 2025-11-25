import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Mail } from "lucide-react";

type Message = {
  id: string;
  nama: string;
  email: string;
  pesan: string;
  created_at: string;
};

const MessagesViewer = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat pesan");
      return;
    }

    setMessages(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus pesan");
      return;
    }

    toast.success("Pesan berhasil dihapus");
    fetchMessages();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Pesan dari Pengunjung</h2>
        <div className="text-sm text-muted-foreground">
          Total: {messages.length} pesan
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada pesan masuk</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{message.nama}</CardTitle>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{message.pesan}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesViewer;
