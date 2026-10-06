import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onClick, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface-card/40 px-6 py-14 text-center", className)}>
      {Icon && (
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
      )}
      <p className="editorial-title text-xl text-foreground">{title}</p>
      {description && <p className="mt-2 max-w-xs text-[0.85rem] leading-relaxed text-muted-foreground">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="press mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[0.82rem] font-semibold text-primary-foreground shadow-hard-sm">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onClick && !actionTo && (
        <button onClick={onClick} className="press mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[0.82rem] font-semibold text-primary-foreground shadow-hard-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}