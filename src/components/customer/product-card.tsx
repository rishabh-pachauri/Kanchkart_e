"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addCartItem } from "@/lib/client-api";
import { formatMoney } from "@/lib/format";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="group overflow-hidden rounded-md border border-champagne bg-pearl shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-premium">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="product-media aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">{product.category}</p>
          <span className="inline-flex items-center gap-1 text-xs text-smoke">
            <Star size={14} className="fill-gold text-gold" /> {product.rating}
          </span>
        </div>
        <Link href={`/products/${product.slug}`} className="luxury-focus rounded-md">
          <h3 className="font-display text-2xl leading-7 text-ink">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-smoke">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-ink">{formatMoney(product.price)}</p>
            <p className="text-xs text-smoke line-through">{formatMoney(product.mrp)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Add to wishlist"
              className="luxury-focus inline-flex h-10 w-10 items-center justify-center rounded-md border border-champagne text-ink transition hover:border-gold hover:bg-champagne/50"
            >
              <Heart size={18} />
            </button>
            <Button
              type="button"
              className="h-10 px-3"
              onClick={() =>
                addCartItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  slug: product.slug
                })
              }
            >
              <ShoppingBag size={17} /> Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
