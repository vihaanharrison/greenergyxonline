import { MapPin, Trash2, Pencil } from "lucide-react";
import { Image } from "@/components/ui/image";
import { materialColor, materialLabel, formatQty, formatDate, relativeDate } from "@/lib/greenergy";
import { cn } from "@/lib/utils";

export default function RecordCard({ record, canManage = false, onEdit, onDelete, showContributor = true }) {
  if (!record) return null;
  return (
    <article className="group flex gap-4 rounded-md border border-border bg-surface-card p-4 transition-colors hover:border-foreground/20">
      {record.image_url && (
        <div className="hidden sm:block w-20 shrink-0 overflow-hidden rounded-md border border-border">
          <Image src={record.image_url} alt={materialLabel(record.material)} className="h-20 w-full object-cover" fittingType="fill" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {showContributor && (
              <p className="truncate text-[0.8rem] text-muted-foreground">
                {record.contributor_name || "A GreenergyX member"}
              </p>
            )}
            <p className="mt-0.5 flex items-center gap-2 text-[0.95rem] font-medium text-foreground">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: materialColor(record.material) }} />
              {materialLabel(record.material)}
              <span className="tabular text-muted-foreground font-normal">· {formatQty(record)}</span>
            </p>
          </div>
          <time className="shrink-0 text-[0.75rem] text-muted-foreground tabular">{relativeDate(record.date) || formatDate(record.date)}</time>
        </div>
        {record.location && (
          <p className="mt-1.5 flex items-center gap-1 text-[0.78rem] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {record.location}
          </p>
        )}
        {record.notes && <p className="mt-1.5 text-[0.85rem] leading-relaxed text-foreground/80 line-clamp-2">{record.notes}</p>}
        {record.image_url && (
          <div className="mt-2 sm:hidden w-16 overflow-hidden rounded border border-border">
            <Image src={record.image_url} alt={materialLabel(record.material)} className="h-16 w-full object-cover" fittingType="fill" />
          </div>
        )}
        {canManage && (
          <div className="mt-2.5 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button onClick={() => onEdit?.(record)} className="flex items-center gap-1 text-[0.75rem] text-muted-foreground hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button onClick={() => onDelete?.(record)} className="flex items-center gap-1 text-[0.75rem] text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}