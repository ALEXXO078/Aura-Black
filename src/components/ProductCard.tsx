import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { tagLabels } from "@/data/products";
import { formatPrice } from "@/lib/config";

export function ProductCard({ product }: { product: Product }) {
  const primaryTag = product.tags[0];
  return (
    <Link
      to="/producto/$slug"
      params={{ slug: product.slug }}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        {primaryTag && (
          <span className="absolute left-4 top-4 rounded-sm border border-gold/40 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-luxury text-gold backdrop-blur">
            {tagLabels[primaryTag]}
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute right-4 top-4 rounded-sm bg-destructive px-3 py-1 text-[10px] uppercase tracking-luxury text-destructive-foreground">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">
            {product.brand} · {product.ml}ml
          </p>
          <h3 className="mt-1 font-display text-xl text-foreground transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </div>
        <div className="text-right">
          {product.oldPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </p>
          )}
          <p className="font-display text-lg text-gold">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
