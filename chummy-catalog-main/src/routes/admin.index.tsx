import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminProducts,
});

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  notes: string[];
  price: number;
  old_price: number | null;
  ml: number;
  stock: number;
  category_id: string | null;
  tags: string[];
  image: string | null;
}

const empty: Omit<Product, "id"> = {
  slug: "",
  name: "",
  brand: "",
  description: "",
  notes: [],
  price: 0,
  old_price: null,
  ml: 100,
  stock: 0,
  category_id: null,
  tags: [],
  image: "",
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    toast.success("Imagen subida");
  };

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts((p ?? []) as Product[]);
    setCategories((c ?? []) as Category[]);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    const { id: _id, ...rest } = p;
    setForm(rest);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      ml: Number(form.ml),
      stock: Number(form.stock),
      image: form.image || null,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Producto actualizado" : "Producto creado");
    setOpen(false);
    load();
  };

  const remove = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Producto eliminado");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Productos ({products.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Slug">
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </Field>
              <Field label="Marca">
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </Field>
              <Field label="Categoría">
                <Select
                  value={form.category_id ?? "none"}
                  onValueChange={(v) => setForm({ ...form, category_id: v === "none" ? null : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Precio">
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </Field>
              <Field label="Precio anterior (opcional)">
                <Input
                  type="number"
                  step="0.01"
                  value={form.old_price ?? ""}
                  onChange={(e) => setForm({ ...form, old_price: e.target.value ? Number(e.target.value) : null })}
                />
              </Field>
              <Field label="ML">
                <Input type="number" value={form.ml} onChange={(e) => setForm({ ...form, ml: Number(e.target.value) })} />
              </Field>
              <Field label="Stock">
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </Field>
              <Field label="Imagen del producto" className="col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f);
                      }}
                    />
                    {uploading && <span className="text-xs text-muted-foreground">Subiendo...</span>}
                  </div>
                  <Input
                    placeholder="O pega una URL"
                    value={form.image ?? ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  {form.image && (
                    <img src={form.image} alt="preview" className="h-32 w-32 rounded-sm border border-border object-cover" />
                  )}
                </div>
              </Field>
              <Field label="Notas (separadas por coma)" className="col-span-2">
                <Input
                  value={form.notes.join(", ")}
                  onChange={(e) => setForm({ ...form, notes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              </Field>
              <Field label="Tags (separados por coma)" className="col-span-2">
                <Input
                  value={form.tags.join(", ")}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              </Field>
              <Field label="Descripción" className="col-span-2">
                <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={save}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left text-xs uppercase tracking-luxury text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categories.find((c) => c.id === p.category_id)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">S/ {Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Sin productos todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={"space-y-2 " + (className ?? "")}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
