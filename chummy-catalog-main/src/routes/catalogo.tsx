import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Category } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

interface Search {
  cat?: Category;
  brand?: string;
  q?: string;
}

export const Route = createFileRoute("/catalogo")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: (s.cat as Category) || undefined,
    brand: (s.brand as string) || undefined,
    q: (s.q as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — Aura Black" },
      { name: "description", content: "Explora todas las fragancias Aura Black: hombre, mujer, unisex, importados y nicho." },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { cat, brand, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const [sort, setSort] = useState<"featured" | "asc" | "desc">("featured");

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: Category; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const brandsList = useMemo(() => {
    let list = productsList;
    if (cat) {
      list = list.filter((p) => p.category === cat);
    }
    const brands = list.map((p) => p.brand).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [productsList, cat]);

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
            id: c.slug as Category,
            label: c.name
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

  const filtered = useMemo(() => {
    let r = productsList;
    if (cat) r = r.filter((p) => p.category === cat);
    if (brand) r = r.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (query.trim()) {
      const s = query.toLowerCase();
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.notes.some((n) => n.toLowerCase().includes(s)),
      );
    }
    if (sort === "asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [productsList, cat, brand, query, sort]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground bg-background">
        Cargando catálogo...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="border-b border-border pb-10">
        <p className="text-xs uppercase tracking-luxury text-gold">Colección</p>
        <h1 className="mt-3 font-display text-6xl">Catálogo</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {filtered.length} fragancias seleccionadas para ti.
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[240px_1fr]">
        {/* SIDEBAR */}
        <aside className="space-y-10">
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-luxury text-gold">Buscar</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Notas, marca…"
                className="w-full rounded-sm border border-border bg-input py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-luxury text-gold">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ search: { q: query || undefined } })}
                  className={`text-left transition ${!cat ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Todas
                </button>
              </li>
              {categoriesList.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate({ search: { cat: c.id, q: query || undefined } })}
                    className={`text-left transition ${cat === c.id ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-luxury text-gold">Marcas</h3>
            <ul className="space-y-2 text-sm max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/20">
              <li>
                <button
                  onClick={() => navigate({ search: { cat, q: query || undefined } })}
                  className={`text-left transition ${!brand ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Todas las marcas
                </button>
              </li>
              {brandsList.map((b) => (
                <li key={b}>
                  <button
                    onClick={() => navigate({ search: { cat, brand: b, q: query || undefined } })}
                    className={`text-left transition ${brand === b ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-luxury text-gold">Ordenar</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full rounded-sm border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
            >
              <option value="featured">Destacados</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
          </div>
        </aside>

        {/* GRID */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border py-24 text-center">
              <p className="font-display text-2xl">Sin resultados</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con otra búsqueda o categoría.
              </p>
              <Link to="/catalogo" className="mt-6 inline-block text-xs uppercase tracking-luxury text-gold">
                Ver todo
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
