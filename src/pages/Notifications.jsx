import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Heart, MessageSquare, UserPlus, Target, Leaf } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import EmptyState from "@/components/common/EmptyState";
import { timeAgo } from "@/lib/greenergy";
import { cn } from "@/lib/utils";

const ICON = { comment: MessageSquare, reaction: Heart, follow: UserPlus, challenge: Target, level: Leaf, system: Bell };

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) return;
    base44.entities.Notification.filter({ user_id: user.id }, "-created_date", 50).then(setItems).catch(() => setItems([]));
  }, [user, tick]);

  async function markAll() {
    if (!items) return;
    const unread = items.filter((n) => !n.read);
    await Promise.all(unread.map((n) => base44.entities.Notification.update(n.id, { read: true }).catch(() => {})));
    setTick((t) => t + 1);
    toast({ title: "all caught up" });
  }

  if (!items) return <div className="flex justify-center py-20"><Bell className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-8 md:py-12">
      <header className="mb-6 flex items-center justify-between">
        <div><p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">notifications</p><h1 className="mt-2 editorial-title text-3xl text-foreground">what you missed.</h1></div>
        {items.some((n) => !n.read) && <button onClick={markAll} className="press inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[0.78rem] text-muted-foreground hover:text-foreground"><CheckCheck className="h-3.5 w-3.5" /> mark all read</button>}
      </header>

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="no notifications" description="reactions, comments and follows will show up here." />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const Icon = ICON[n.type] || Bell;
            return (
              <li key={n.id} className={cn("flex items-center gap-3 rounded-md border bg-surface-card px-4 py-3", n.read ? "border-border" : "border-primary/40 bg-primary/5")}>
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/40 text-primary"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-[0.86rem] text-foreground/90 lowercase">{n.text}</p><p className="text-[0.7rem] text-muted-foreground">{timeAgo(n.created_date)}</p></div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8 text-center"><Link to="/" className="text-[0.82rem] lowercase text-muted-foreground hover:text-foreground">back to feed</Link></div>
    </div>
  );
}