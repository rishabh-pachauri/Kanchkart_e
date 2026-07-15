"use client";

import { useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const [active, setActive] = useState(product.images[0]);

  return (
    <div className="grid gap-4">
      <div className="product-media aspect-square overflow-hidden rounded-md border border-champagne bg-champagne/40">
        <img src={active} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {product.images.map((image) => (
          <button
            type="button"
            key={image}
            onClick={() => setActive(image)}
            className="luxury-focus aspect-square overflow-hidden rounded-md border border-champagne bg-pearl data-[active=true]:border-gold"
            data-active={active === image}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
