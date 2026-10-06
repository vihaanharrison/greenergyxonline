import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, PenLine, ArrowRight, Recycle, ImagePlus, X, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import FeedItem from "@/components/feed/FeedItem";
import UserAvatar from "@/components/UserAvatar";
import EmptyState from "@/components/common/EmptyState";
import { totalKg, formatWeight } from "@/lib/greenergy";

function useProfiles() {
  const [map, setMap] = useState({});
  useEffect(() => {
    base44.entities.Profile.list("-created_date", 100)
      .then((list) => setMap(Object.fromEntries(list.map((p) => [p.created_by_id, p]))))
      .catch(() => {});
  }, []);
  return map;
}

function PostComposer({ onPosted }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  async function handleFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try { const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: f }); setImageUrl(file_url); }
    catch { toast({ title: "upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  }
  async function post(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { toast({ title: "add a title and body", variant: "destructive" }); return; }
    setPosting(true);
    try {
      await base44.entities.CommunityPost.create({ title: title.trim(), body: body.trim(), image_url: imageUrl || undefined, author_name: user?.full_name || "member" });
      setTitle(""); setBody(""); setImageUrl(""); setOpen(false); onPosted?.();
      toast({ title: "post published" });
    } catch (err) { toast({ title: "could not publish", variant: "destructive" }); }
    finally { setPosting(false); }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="press flex w-full items-center gap-3 rounded-md border border-border bg-surface-card p-3 text-left shadow-hard-sm">
        <PenLine className="h-4 w-4 text-primary" />
        <span className="text-[0.85rem] text-muted-foreground">write a community post…</span>
      </button>
    );
  }
  return (
    <form onSubmit={post} className="rounded-md border border-border bg-surface-card p-4 shadow-hard-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[0.85rem] font-semibold lowercase text-foreground">new post</p>
        <button type="button" onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" className="mb-2 w-full rounded-md border border-border bg-background px-3 py-2 text-[0.9rem] focus-ring" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="share an idea, update or reflection…" className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-[0.88rem] focus-ring" />
      {imageUrl ? (
        <div className="relative mt-2 max-w-xs overflow-hidden rounded-md border border-border">
          <Image src={imageUrl} alt="post" className="h-32 w-full" fittingType="fill" />
          <button type="button" onClick={() => setImageUrl("")} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/85 text-background"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="press mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-[0.78rem] text-muted-foreground hover:text-foreground">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />} {uploading ? "uploading…" : "add image"}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="mt-3 flex justify-end">
        <Button type="submit" disabled={posting} className="press bg-primary text-primary-foreground shadow-hard-sm">{posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> publish</>}</Button>
      </div>
    </form>
  );
}

function SignInBanner() {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-md border border-border bg-surface-card p-4 shadow-hard-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-heading text-[0.95rem] font-semibold lowercase text-foreground">join the movement</p>
        <p className="text-[0.82rem] text-muted-foreground">record your recycling, earn XP, and climb the leaderboard.</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button asChild variant="outline" className="shadow-none border-border"><Link to="/login">sign in</Link></Button>
        <Button asChild className="press bg-primary text-primary-foreground shadow-hard-sm"><Link to="/register">join <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
    </div>
  );
}

function Feed() {
  const { user } = useAuth();
  const [records, setRecords] = useState(null);
  const [posts, setPosts] = useState([]);
  const profileMap = useProfiles();
  const [tick, setTick] = useState(0);

  function load() {
    base44.entities.RecyclingRecord.filter({ visibility: "public" }, "-date", 100).then(setRecords).catch(() => setRecords([]));
    base44.entities.CommunityPost.list("-created_date", 100).then(setPosts).catch(() => setPosts([]));
  }
  useEffect(() => { load(); }, [tick]);

  const items = useMemo(() => {
    const r = (records || []).map((x) => ({ type: "record", data: x, date: x.date || x.created_date, ts: new Date(x.date || x.created_date).getTime() }));
    const p = posts.map((x) => ({ type: "post", data: x, date: x.created_date, ts: new Date(x.created_date).getTime() }));
    return [...r, ...p].sort((a, b) => b.ts - a.ts);
  }, [records, posts]);

  const recs = records || [];
  const communityKg = totalKg(recs);

  return (
    <div className="mx-auto max-w-feed px-4 md:px-0 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="editorial-title text-3xl md:text-4xl text-foreground">community feed</h1>
        <p className="mt-1 text-[0.85rem] text-muted-foreground">
          every public recycling action, in real time.{" "}
          <span className="tabular font-semibold text-primary">{formatWeight(communityKg)}</span> recycled and counting.
        </p>
      </div>

      {user ? (
        <div className="mb-5 space-y-3">
          <div className="flex gap-3">
            <Link to="/profile"><UserAvatar user={user} name={user?.full_name} size="md" /></Link>
            <Link to="/new-record" className="press flex flex-1 items-center rounded-md border border-border bg-surface-card px-4 shadow-hard-sm">
              <span className="text-[0.9rem] text-muted-foreground">record what you recycled…</span>
              <Plus className="ml-auto h-4 w-4 text-primary" />
            </Link>
          </div>
          <PostComposer onPosted={() => setTick((t) => t + 1)} />
        </div>
      ) : (
        <SignInBanner />
      )}

      {records === null ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Recycle}
          title="no posts yet"
          description="the community starts with the first action. record your recycling to kick things off."
          actionLabel={user ? "record recycling" : "join greenergyX"}
          actionTo={user ? "/new-record" : "/register"}
        />
      ) : (
        <div className="space-y-5">
          {items.map((it) => (
            <FeedItem key={`${it.type}-${it.data.id}`} item={it} author={profileMap[it.data.created_by_id]} onDeleted={() => setTick((t) => t + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return <Feed />;
}