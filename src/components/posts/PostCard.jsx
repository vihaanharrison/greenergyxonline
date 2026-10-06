import { Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatDate, relativeDate } from "@/lib/greenergy";

export default function PostCard({ post, canManage = false, onDelete }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-surface-card">
      {post.image_url && (
        <div className="aspect-[16/9] overflow-hidden border-b border-border">
          <Image src={post.image_url} alt={post.title} className="h-full w-full object-cover" fittingType="fill" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.78rem] text-muted-foreground">{post.author_name || "A GreenergyX member"}</p>
          <time className="text-[0.75rem] text-muted-foreground tabular">{relativeDate(post.created_date) || formatDate(post.created_date)}</time>
        </div>
        <h3 className="mt-1.5 font-display text-xl text-foreground leading-snug">{post.title}</h3>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-foreground/80 whitespace-pre-line line-clamp-4">{post.body}</p>
        {canManage && (
          <div className="mt-4 flex">
            <button onClick={() => onDelete?.(post)} className="flex items-center gap-1 text-[0.75rem] text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}