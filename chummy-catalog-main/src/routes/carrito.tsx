import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, MessageCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [{ title: "Carrito — Aura Black" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();

  const buildMessage = () => {
    const lines = items.map(
      (i) => `• ${i.product.name} (${i.product.ml}ml) × ${i.qty} — ${formatPrice(i.product.price * i.qty)}`,
    );
    return `Hola Aura Black, quiero realizar el siguiente pedido:%0A%0A${lines.join("%0A")}%0A%0A*Total: ${formatPrice(total)}*`;
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-luxury text-gold">Carrito</p>
        <h1 className="mt-4 font-display text-5xl">Tu carrito está vacío</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          La elegancia empieza con una elección.
        </p>
        <Link
          to="/catalogo"
          className="mt-10 inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs uppercase tracking-luxury text-primary-foreground hover:shadow-gold"
        >
          Explorar perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-3 w-3" /> Seguir comprando
      </Link>
      <h1 className="mt-6 font-display text-5xl">Tu carrito</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((i) => (
            <div key={i.product.id} className="flex gap-6 py-6">
              <Link to="/producto/$slug" params={{ slug: i.product.slug }} className="shrink-0">
                <img src={i.product.image} alt={i.product.name} className="h-32 w-24 rounded-sm object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">{i.product.brand}</p>
                    <Link to="/producto/$slug" params={{ slug: i.product.slug }}>
                      <h3 className="mt-1 font-display text-xl hover:text-gold">{i.product.name}</h3>
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{i.product.ml}ml</p>
                  </div>
                  <p className="font-display text-lg text-gold">{formatPrice(i.product.price * i.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-sm border border-border">
                    <button onClick={() => setQty(i.product.id, i.qty - 1)} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-gold">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.product.id, i.qty + 1)} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-gold">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => remove(i.product.id)} className="flex items-center gap-2 text-xs uppercase tracking-luxury text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-6">
            <button onClick={clear} className="text-xs uppercase tracking-luxury text-muted-foreground hover:text-destructive">
              Vaciar carrito
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-sm border border-border bg-card p-8">
          <h2 className="font-display text-2xl">Resumen</h2>
          <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <span>A coordinar</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-xl">
              <span>Total</span>
              <span className="text-gold">{formatPrice(total)}</span>
            </div>
          </div>
          <a
            href={`https://wa.me/51913655352?text=${buildMessage()}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex items-center justify-center gap-3 rounded-sm bg-gold px-6 py-4 text-xs uppercase tracking-luxury text-primary-foreground transition hover:shadow-gold"
          >
            <MessageCircle className="h-4 w-4" />
            Finalizar por WhatsApp
          </a>
          <p className="mt-4 text-center text-[10px] uppercase tracking-luxury text-muted-foreground">
            Coordinamos pago y envío contigo
          </p>
        </aside>
      </div>
    </div>
  );
}
