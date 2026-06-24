import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { SITE } from "@/lib/config";
import { useAdmin } from "@/hooks/use-admin";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/catalogo", search: { cat: "hombre" }, label: "Hombre" },
  { to: "/catalogo", search: { cat: "mujer" }, label: "Mujer" },
  { to: "/catalogo", search: { cat: "nicho" }, label: "Nicho" },
];

export function Header() {
  const { count } = useCart();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-foreground">
            {SITE.name.split(" ")[0]}
          </span>
          <span className="text-gradient-gold font-display text-2xl italic">
            {SITE.name.split(" ")[1]}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((n, i) => (
            <Link
              key={i}
              to={n.to}
              search={n.search as never}
              className="text-xs uppercase tracking-luxury text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              to="/admin"
              className="hidden h-10 items-center gap-2 rounded-full border border-gold/40 px-4 text-xs uppercase tracking-luxury text-gold transition hover:bg-gold/10 sm:flex"
              aria-label="Panel admin"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden h-10 items-center gap-2 rounded-full border border-border px-4 text-xs uppercase tracking-luxury text-muted-foreground transition hover:border-gold hover:text-gold sm:flex"
              aria-label="Iniciar sesión"
            >
              <User className="h-4 w-4" />
              Ingresar
            </Link>
          )}
          <Link
            to="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-gold hover:text-gold"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((n, i) => (
              <Link
                key={i}
                to={n.to}
                search={n.search as never}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-luxury text-muted-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
