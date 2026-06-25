import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react";
import { tagLabels, type Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, whatsappLink } from "@/lib/config";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageSrc } from "@/lib/utils";

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ params }) => {
    const { data: p, error } = await supabase
      .from("products")
      .select("*, categories(slug)")
      .eq("slug", params.slug)
      .maybeSingle();

    if (error || !p) throw notFound();

    const product: Product = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      description: p.description,
      notes: p.notes || [],
      price: Number(p.price),
      oldPrice: p.old_price ? Number(p.old_price) : undefined,
      ml: p.ml,
      stock: p.stock,
      category: p.categories?.slug || "unisex",
      tags: p.tags || [],
      image: resolveImageSrc(p.image || ""),
    };

    // Fetch related products (same category)
    let relatedData: any[] = [];

    if (p.category_id) {
      const { data } = await supabase
        .from("products")
        .select("*, categories(slug)")
        .eq("category_id", p.category_id)
        .neq("id", p.id)
        .limit(3);

      relatedData = data || [];
    }

    const related = (relatedData || []).map((rp: any) => ({
      id: rp.id,
      slug: rp.slug,
      name: rp.name,
      brand: rp.brand,
      description: rp.description,
      notes: rp.notes || [],
      price: Number(rp.price),
      oldPrice: rp.old_price ? Number(rp.old_price) : undefined,
      ml: rp.ml,
      stock: rp.stock,
      category: rp.categories?.slug || "unisex",
      tags: rp.tags || [],
      image: resolveImageSrc(rp.image || ""),
    }));

    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Aura Black` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Aura Black` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: resolveImageSrc(loaderData.product.image) },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Producto no encontrado</h1>
      <Link to="/catalogo" className="mt-6 inline-block text-xs uppercase tracking-luxury text-gold">
        Volver al catálogo
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData() as { product: Product; related: Product[] };
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waMsg = `Hola Aura Black, quisiera consultar por *${product.name}* (${product.ml}ml) — ${formatPrice(product.price)}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-3 w-3" /> Catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-sm bg-secondary">
          <img src={resolveImageSrc(product.image)} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          {product.tags[0] && (
            <span className="absolute left-6 top-6 rounded-sm border border-gold/40 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-luxury text-gold backdrop-blur">
              {tagLabels[product.tags[0]]}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-luxury text-gold">{product.brand}</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">{product.name}</h1>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-4xl text-gold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 border-t border-border pt-8">
            <p className="text-xs uppercase tracking-luxury text-gold">Notas olfativas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.notes.map((n) => (
                <span key={n} className="rounded-sm border border-border px-3 py-1 text-xs text-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-border pt-8">
            <span className="text-xs uppercase tracking-luxury text-muted-foreground">Cantidad</span>
            <div className="flex items-center rounded-sm border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-gold"
                aria-label="Menos"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-gold"
                aria-label="Más"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="group flex flex-1 items-center justify-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs uppercase tracking-luxury text-primary-foreground transition hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              {added ? "Añadido ✓" : "Añadir al carrito"}
            </button>
            <a
              href={whatsappLink(waMsg)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-3 rounded-sm border border-border bg-transparent px-8 py-4 text-xs uppercase tracking-luxury text-foreground transition hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <h2 className="mb-10 font-display text-4xl">También te puede gustar</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
