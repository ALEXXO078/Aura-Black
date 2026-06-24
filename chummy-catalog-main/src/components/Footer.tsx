import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/40 bg-card">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl">
            <span>Aura </span>
            <span className="text-gradient-gold italic">Black</span>
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Perfumería de autor. Fragancias seleccionadas para quienes entienden
            que un aroma es una firma.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-luxury text-gold">
            Tienda
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/catalogo" className="hover:text-foreground">Catálogo</Link></li>
            <li><Link to="/catalogo" search={{ cat: "hombre" } as never} className="hover:text-foreground">Hombre</Link></li>
            <li><Link to="/catalogo" search={{ cat: "mujer" } as never} className="hover:text-foreground">Mujer</Link></li>
            <li><Link to="/catalogo" search={{ cat: "nicho" } as never} className="hover:text-foreground">Nicho</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-luxury text-gold">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{SITE.email}</li>
            <li>
              <a href={whatsappLink("Hola Aura Black, quisiera más información")} target="_blank" rel="noreferrer" className="hover:text-foreground">
                WhatsApp
              </a>
            </li>
            <li>Lima, Perú</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="tracking-luxury uppercase">Hecho con elegancia</span>
        </div>
      </div>
    </footer>
  );
}
