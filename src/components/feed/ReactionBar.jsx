import { useEffect, useState } from "react";
import { Heart, Leaf } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function ReactionBar({ targetType, targetId, ownerId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reactions, setReactions] = useState([]);
  const [mine, setMine] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const list = await base44.entities.Reaction.filter({ target_type: targetType, target_id: targetId }, "-created_date", 200);
    setReactions(list);
    setMine(user ? list.find((r) => r.created_by_id === user.id) || null : null);
  }
  useEffect(() => { load(); }, [targetType, targetId]);

  async function toggle() {
    if (!user) return;
    setBusy(true);
    try {
      if (mine) {
        await base44.entities.Reaction.delete(mine.id);
        setMine(null);
        setReactions((r) => r.filter((x) => x.id !== mine.id));
      } else {
        const created = await base44.entities.Reaction.create({ target_type: targetType, target_id: targetId, kind: "like" });
        setMine(created);
        setReactions((r) => [created, ...r]);
        if (ownerId && ownerId !== user.id) {
          try {
            await base44.entities.Notification.create({ user_id: ownerId, actor_name: "someone", type: "reaction", text: "reacted to your recycling activity", target_type: targetType, target_id: targetId, read: false });
          } catch (e) {}
        }
      }
    } catch (e) {
      toast({ title: "could not react", variant: "destructive" });
    } finally { setBusy(false); }
  }

  const count = reactions.length;
  const active = !!mine;

  return (
    <button
      onClick={toggle}
      disabled={!user || busy}
      className={cn(
        "press inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[0.78rem] transition-colors disabled:opacity-50",
        active ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"
      )}
    >
      {active ? <Heart className="h-3.5 w-3.5 fill-primary" /> : <Leaf className="h-3.5 w-3.5" />}
      <span className="tabular">{count}</span>
    </button>
  );
}