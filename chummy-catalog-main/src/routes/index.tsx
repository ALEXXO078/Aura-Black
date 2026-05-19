import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import heroImg from "@/assets/hero-perfume.jpg";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura Black — Perfumería de autor" },
      { name: "description", content: "Descubre Aura Black: perfumes premium, importados y de nicho seleccionados para la noche más elegante." },
    ],
  }),
  component: Index,
});

function Index() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [{ data: pData }, { data: cData }] = await Promise.all([
          supabase.from("products").select("*, categories(slug)"),
          supabase.from("categories").select("*")
        ]);
        if (pData) {
          const mapped = pData.map((p: any) => ({
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
            image: p.image || ""
          }));
          setProductsList(mapped as Product[]);
        }
        if (cData) {
          const mappedCats = cData.map((c: any) => ({
            id: c.slug,
            label: c.name,
            description: c.slug === 'hombre' ? 'Carácter y profundidad' :
                         c.slug === 'mujer' ? 'Sensualidad y matiz' :
                         c.slug === 'unisex' ? 'Sin fronteras' :
                         c.slug === 'importados' ? 'Selección internacional' :
                         c.slug === 'nicho' ? 'Edición limitada' : ''
          }));
          setCategoriesList(mappedCats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground bg-background">
        Cargando catálogo...
      </div>
    );
  }

  const featured = productsList.filter((p) => p.tags.includes("destacado" as any)).slice(0, 3);
  const bestSellers = productsList.filter((p) => p.tags.includes("mas-vendido" as any)).slice(0, 3);
  const offers = productsList.filter((p) => p.oldPrice!).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Perfume Aura Black"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24">
          <p className="animate-fade-up text-xs uppercase tracking-luxury text-gold">
            Edición Otoño · 2026
          </p>
          <h1 className="animate-fade-up mt-6 max-w-2xl font-display text-6xl leading-[1.05] text-foreground md:text-8xl">
            El aroma de
            <br />
            <span className="text-gradient-gold italic">la noche</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Una colección curada de fragancias premium, importadas y de nicho.
            Para quienes entienden que un perfume no se elige: se elige a ti.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4">
            <Link
              to="/catalogo"
              className="group inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs uppercase tracking-luxury text-primary-foreground transition hover:shadow-gold"
            >
              Explorar colección
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/catalogo"
              search={{ cat: "nicho" } as never}
              className="inline-flex items-center gap-3 rounded-sm border border-border bg-transparent px-8 py-4 text-xs uppercase tracking-luxury text-foreground transition hover:border-gold hover:text-gold"
            >
              Nicho · Premium
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border/40 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          {[
            { Icon: Sparkles, t: "100% Originales", d: "Garantía de autenticidad" },
            { Icon: Truck, t: "Envío a todo el país", d: "Empaque discreto y elegante" },
            { Icon: Shield, t: "Atención por WhatsApp", d: "Asesoría olfativa personal" },
          ].map(({ Icon, t, d }, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg text-foreground">{t}</p>
                <p className="text-xs uppercase tracking-luxury text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-luxury text-gold">Universos olfativos</p>
            <h2 className="mt-3 font-display text-5xl">Categorías</h2>
          </div>
        </div>
        <div className="grid gap-px overflow-hidden rounded-sm border border-border md:grid-cols-5">
          {categoriesList.map((c, index) => (
            <Link
              key={c.id}
              to="/catalogo"
              search={{ cat: c.id } as never}
              className="group relative flex flex-col justify-between bg-card p-8 transition hover:bg-secondary"
            >
              <span className="text-[10px] uppercase tracking-luxury text-muted-foreground">
                0{index + 1}
              </span>
              <div className="mt-16">
                <h3 className="font-display text-2xl text-foreground transition group-hover:text-gold">
                  {c.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                <ArrowRight className="mt-4 h-4 w-4 text-gold opacity-0 transition group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <ProductSection
        eyebrow="Selección de la casa"
        title="Destacados"
        items={featured}
      />

      {/* OFFERS BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-sm border border-gold/30 bg-card p-12 md:p-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative max-w-xl">
            <p className="text-xs uppercase tracking-luxury text-gold">Por tiempo limitado</p>
            <h2 className="mt-4 font-display text-5xl md:text-6xl">
              Hasta <span className="text-gradient-gold italic">-30%</span>
              <br />en selección
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Una oportunidad para llevarte un aroma que ya considerabas tuyo.
            </p>
            <Link
              to="/catalogo"
              className="mt-8 inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs uppercase tracking-luxury text-primary-foreground transition hover:shadow-gold"
            >
              Ver ofertas
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <ProductSection
        eyebrow="Los más amados"
        title="Más vendidos"
        items={bestSellers}
      />

      {/* OFFERS LIST */}
      {offers.length > 0 && (
        <ProductSection
          eyebrow="Ofertas"
          title="En promoción"
          items={offers}
        />
      )}
    </>
  );
}

function ProductSection({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Product[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-luxury text-gold">{eyebrow}</p>
          <h2 className="mt-3 font-display text-5xl">{title}</h2>
        </div>
        <Link
          to="/catalogo"
          className="hidden text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold md:inline"
        >
          Ver todo →
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
