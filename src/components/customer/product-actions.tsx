"use client";

import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addCartItem } from "@/lib/client-api";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductActions({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    slug: product.slug
  };

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <Button type="button" onClick={() => addCartItem(cartItem)}>
        <ShoppingBag size={18} /> Add to cart
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          localStorage.setItem("kanchkart_cart", JSON.stringify([{ ...cartItem, quantity: 1 }]));
          window.dispatchEvent(new CustomEvent("kanchkart-cart"));
          router.push("/checkout");
        }}
      >
        <CreditCard size={18} /> Buy now
      </Button>
    </div>
  );
}
