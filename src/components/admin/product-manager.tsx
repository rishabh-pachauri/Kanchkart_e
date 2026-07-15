"use client";

import { Archive, Edit3, FileUp, Save, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";
import { formatMoney } from "@/lib/format";

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  story?: string | null;
  price: string;
  mrp?: string | null;
  gstRate: string;
  inventory: number;
  lowStockAt: number;
  images: string[];
  material: string;
  dimensions?: string | null;
  categoryId: string;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  category?: AdminCategory;
};

const emptyProduct = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  story: "",
  price: "",
  mrp: "",
  gstRate: "18",
  inventory: 0,
  lowStockAt: 10,
  images: "",
  material: "Borosilicate glass",
  dimensions: "",
  categoryId: "",
  featured: false,
  bestSeller: false,
  newArrival: false
};

export function ProductManager({
  initialProducts,
  categories
}: {
  initialProducts: AdminProduct[];
  categories: AdminCategory[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [message, setMessage] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const selectedValues = useMemo(() => {
    if (!selected) return emptyProduct;
    return {
      ...selected,
      images: selected.images.join("\n"),
      story: selected.story ?? "",
      mrp: selected.mrp ?? "",
      dimensions: selected.dimensions ?? ""
    };
  }, [selected]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      sku: String(form.get("sku")),
      description: String(form.get("description")),
      story: String(form.get("story") ?? ""),
      price: Number(form.get("price")),
      mrp: form.get("mrp") ? Number(form.get("mrp")) : undefined,
      gstRate: Number(form.get("gstRate") ?? 18),
      inventory: Number(form.get("inventory") ?? 0),
      lowStockAt: Number(form.get("lowStockAt") ?? 10),
      images: String(form.get("images")).split(/\n|,/).map((url) => url.trim()).filter(Boolean),
      material: String(form.get("material")),
      dimensions: String(form.get("dimensions") ?? ""),
      categoryId: String(form.get("categoryId")),
      featured: form.get("featured") === "on",
      bestSeller: form.get("bestSeller") === "on",
      newArrival: form.get("newArrival") === "on",
      status: "ACTIVE"
    };

    try {
      const payload = await apiFetch<{ data: { product: AdminProduct } }>(
        selected ? `/api/admin/products/${selected.id}` : "/api/admin/products",
        {
          method: selected ? "PATCH" : "POST",
          body: JSON.stringify(body)
        }
      );
      setProducts((current) =>
        selected
          ? current.map((product) => (product.id === selected.id ? payload.data.product : product))
          : [payload.data.product, ...current]
      );
      setSelected(null);
      setMessage(selected ? "Product updated." : "Product created.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product save failed");
    }
  }

  async function archive(product: AdminProduct) {
    await apiFetch(`/api/admin/products/${product.id}`, { method: "DELETE", body: JSON.stringify({}) });
    setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, status: "ARCHIVED" } : item)));
  }

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name")),
          slug: String(form.get("slug")),
          description: String(form.get("description") ?? "")
        })
      });
      setCategoryMessage("Category created. Refresh to select it.");
      event.currentTarget.reset();
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : "Category save failed");
    }
  }

  async function uploadCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    try {
      const payload = await apiFetch<{ data: { imported: number } }>("/api/admin/bulk-upload", {
        method: "POST",
        body
      });
      setMessage(`${payload.data.imported} products imported.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CSV upload failed");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[520px_1fr]">
      <div className="grid gap-6">
        <form onSubmit={submit} className="rounded-md border border-champagne bg-pearl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl text-ink">{selected ? "Edit Product" : "Add Product"}</h2>
            <Button type="button" variant="ghost" onClick={() => setSelected(null)}>New</Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" required defaultValue={selectedValues.name} />
            <Field name="slug" label="Slug" required defaultValue={selectedValues.slug} />
            <Field name="sku" label="SKU" required defaultValue={selectedValues.sku} />
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-smoke">Category</span>
              <select
                name="categoryId"
                required
                defaultValue={selectedValues.categoryId}
                className="luxury-focus h-11 w-full rounded-md border border-champagne bg-pearl px-3 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <Field name="price" label="Price" type="number" min="1" required defaultValue={selectedValues.price} />
            <Field name="mrp" label="MRP" type="number" defaultValue={selectedValues.mrp ?? ""} />
            <Field name="inventory" label="Inventory" type="number" defaultValue={selectedValues.inventory} />
            <Field name="lowStockAt" label="Low stock alert" type="number" defaultValue={selectedValues.lowStockAt} />
            <Field name="gstRate" label="GST rate" type="number" defaultValue={selectedValues.gstRate} />
            <Field name="material" label="Material" defaultValue={selectedValues.material} />
            <TextArea name="description" label="Description" className="sm:col-span-2" required defaultValue={selectedValues.description} />
            <TextArea name="story" label="Story" className="sm:col-span-2" defaultValue={selectedValues.story ?? ""} />
            <TextArea name="images" label="Images" className="sm:col-span-2" required defaultValue={selectedValues.images} />
            <Field name="dimensions" label="Dimensions" className="sm:col-span-2" defaultValue={selectedValues.dimensions ?? ""} />
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            {[
              ["featured", "Featured"],
              ["bestSeller", "Best seller"],
              ["newArrival", "New arrival"]
            ].map(([name, label]) => (
              <label key={name} className="inline-flex items-center gap-2">
                <input name={name} type="checkbox" defaultChecked={Boolean(selectedValues[name as keyof typeof selectedValues])} />
                {label}
              </label>
            ))}
          </div>
          {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>
              <Save size={18} /> Save product
            </Button>
            <label className="luxury-focus inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gold/50 bg-pearl px-5 text-sm font-semibold text-ink transition hover:bg-champagne/60">
              <FileUp size={18} /> CSV upload
              <input type="file" accept=".csv" className="sr-only" onChange={uploadCsv} />
            </label>
            <a href="/api/admin/upload-signature" className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-ink hover:bg-champagne/60">
              <UploadCloud size={18} /> Cloudinary
            </a>
          </div>
        </form>

        <form onSubmit={createCategory} className="rounded-md border border-champagne bg-white p-5 shadow-sm">
          <h2 className="font-display text-3xl text-ink">Category</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" required />
            <Field name="slug" label="Slug" required />
            <Field name="description" label="Description" className="sm:col-span-2" />
          </div>
          {categoryMessage ? <p className="mt-4 text-sm text-smoke">{categoryMessage}</p> : null}
          <Button variant="secondary" className="mt-5">Save category</Button>
        </form>
      </div>

      <section className="rounded-md border border-champagne bg-white p-5 shadow-sm">
        <h2 className="font-display text-3xl text-ink">Inventory</h2>
        <div className="mt-5 grid gap-3">
          {products.map((product) => (
            <div key={product.id} className="grid gap-3 rounded-md border border-champagne p-4 md:grid-cols-[72px_1fr_auto]">
              <img src={product.images[0]} alt={product.name} className="h-[72px] w-[72px] rounded-md object-cover" />
              <div>
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="text-sm text-smoke">{product.sku} | {product.category?.name ?? "Category"} | {formatMoney(product.price)}</p>
                <p className="mt-1 text-sm text-smoke">Stock {product.inventory} | Status {product.status}</p>
              </div>
              <div className="flex gap-2 md:justify-end">
                <Button type="button" variant="secondary" className="h-10 px-3" onClick={() => setSelected(product)}>
                  <Edit3 size={16} /> Edit
                </Button>
                <Button type="button" variant="ghost" className="h-10 px-3" onClick={() => archive(product)}>
                  <Archive size={16} /> Archive
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
