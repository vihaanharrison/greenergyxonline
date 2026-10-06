import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const soldOut = product.status === "sold_out";
  return (
    <Link
      to="/shop"
      className={cn("press group block overflow-hidden rounded-md border border-border bg-surface-card shadow-hard-sm", soldOut && "opacity-70")}
    >
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-border bg-secondary">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} className="h-full w-full" fittingType="fill" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-[0.8rem]">no image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-[0.95rem] font-semibold lowercase text-foreground">{product.name}</h3>
          <span className="tabular shrink-0 text-[0.85rem] font-semibold text-primary">
            {product.currency || "AED"} {(Number(product.price) || 0).toFixed(2)}
          </span>
        </div>
        {product.description && <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted-foreground line-clamp-2">{product.description}</p>}
        <span className={cn("mt-3 inline-block text-[0.68rem] uppercase tracking-wider", soldOut ? "text-destructive" : "text-positive")}>
          {soldOut ? "sold out" : "available"}
        </span>
      </div>
    </Link>
  );
}