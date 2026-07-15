"use client";

import { ArrowDownUp, Check, GitCompare, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/customer/product-card";
import { categories, type CatalogProduct } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";

export function ProductCatalogClient({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return products
      .filter((product) => category === "all" || product.categorySlug === category)
      .filter((product) =>
        [product.name, product.description, product.category, product.sku]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      )
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return Number(Boolean(b.featured || b.bestSeller)) - Number(Boolean(a.featured || a.bestSeller));
      });
  }, [category, products, query, sort]);

  const comparison = compare.map((id) => products.find((product) => product.id === id)).filter(Boolean) as CatalogProduct[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-md border border-champagne bg-pearl p-4 shadow-sm lg:grid-cols-[1fr_220px_220px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search borosilicate storage, serveware, drinkware"
            className="luxury-focus h-11 w-full rounded-md border border-champagne bg-white pl-10 pr-3 text-sm"
          />
        </label>
        <label className="relative">
          <GitCompare className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke" size={18} />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="luxury-focus h-11 w-full appearance-none rounded-md border border-champagne bg-white pl-10 pr-3 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="relative">
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke" size={18} />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="luxury-focus h-11 w-full appearance-none rounded-md border border-champagne bg-white pl-10 pr-3 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="relative">
            <label className="absolute right-3 top-3 z-10 inline-flex cursor-pointer items-center gap-2 rounded-md bg-pearl/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm">
              <input
                type="checkbox"
                className="sr-only"
                checked={compare.includes(product.id)}
                onChange={(event) =>
                  setCompare((current) =>
                    event.target.checked
                      ? [...current.slice(-2), product.id]
                      : current.filter((id) => id !== product.id)
                  )
                }
              />
              <span className="flex h-4 w-4 items-center justify-center rounded-sm border border-gold">
                {compare.includes(product.id) ? <Check size={12} /> : null}
              </span>
              Compare
            </label>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {comparison.length > 1 ? (
        <section className="mt-10 rounded-md border border-gold/30 bg-white p-5 shadow-premium">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            <GitCompare size={18} /> Product Comparison
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-champagne text-smoke">
                <tr>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 pr-4 font-medium">Rating</th>
                  <th className="py-3 pr-4 font-medium">Capacity</th>
                  <th className="py-3 pr-4 font-medium">Care</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((product) => (
                  <tr key={product.id} className="border-b border-champagne/60">
                    <td className="py-4 pr-4 font-semibold text-ink">{product.name}</td>
                    <td className="py-4 pr-4">{formatMoney(product.price)}</td>
                    <td className="py-4 pr-4">{product.rating} / 5</td>
                    <td className="py-4 pr-4">{product.specs.Capacity}</td>
                    <td className="py-4 pr-4">{product.specs.Care}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
