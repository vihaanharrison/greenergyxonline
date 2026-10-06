import { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/shop/ProductCard";
import EmptyState from "@/components/common/EmptyState";

export default function Shop() {
  const [products, setProducts] = useState(null);
  useEffect(() => { base44.entities.Product.list().then(setProducts).catch(() => setProducts([])); }, []);

  return (
    <div className="mx-auto max-w-editorial px-6 py-10 md:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">shop</p>
        <h1 className="mt-3 editorial-title text-foreground" style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}>small steps, sustainable goods.</h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">a small set of sustainability-minded products. this is a concept showcase — greenergyX does not process payments or fulfil orders.</p>
      </header>

      {products === null ? <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        : products.length === 0 ? <EmptyState icon={ShoppingBag} title="no products yet" description="sustainability products will appear here when available." />
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}