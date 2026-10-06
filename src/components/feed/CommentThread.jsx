import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/UserAvatar";
import { timeAgo } from "@/lib/greenergy";

export default function CommentThread({ targetType, targetId, ownerId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const list = await base44.entities.Comment.filter({ target_type: targetType, target_id: targetId }, "created_date", 100);
      setComments(list);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (open) load(); }, [open, targetId]);

  async function post(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const created = await base44.entities.Comment.create({
        target_type: targetType, target_id: targetId, body: body.trim(),
        author_name: user?.full_name || "member", author_id: user.id
      });
      setComments((c) => [...c, created]);
      setBody("");
      if (ownerId && ownerId !== user.id) {
        try { await base44.entities.Notification.create({ user_id: ownerId, actor_name: user?.full_name || "someone", type: "comment", text: "commented on your activity", target_type: targetType, target_id: targetId, read: false }); } catch (e) {}
      }
    } catch (e) { toast({ title: "could not post comment", variant: "destructive" }); }
    finally { setPosting(false); }
  }

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="press inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[0.78rem] text-muted-foreground hover:text-foreground">
        <MessageSquare className="h-3.5 w-3.5" /> <span className="tabular">{comments.length}</span>
      </button>
      {open && (
        <div className="mt-3 border-l-2 border-border pl-3">
          {loading && <p className="text-[0.78rem] text-muted-foreground">loading…</p>}
          {!loading && comments.length === 0 && <p className="text-[0.78rem] text-muted-foreground">no comments yet.</p>}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <UserAvatar name={c.author_name} size="sm" />
                <div className="min-w-0">
                  <p className="text-[0.78rem]">
                    <span className="font-semibold text-foreground lowercase">{c.author_name}</span>
                    <span className="ml-1.5 text-muted-foreground text-[0.7rem]">{timeAgo(c.created_date)}</span>
                  </p>
                  <p className="text-[0.82rem] text-foreground/90 leading-snug break-words">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
          {user && (
            <form onSubmit={post} className="mt-3 flex items-center gap-2">
              <input
                ref={inputRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="add a comment…"
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-[0.82rem] placeholder:text-muted-foreground/60 focus-ring"
              />
              <button type="submit" disabled={posting || !body.trim()} className="press inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}