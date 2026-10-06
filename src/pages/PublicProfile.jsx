import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, UserPlus, UserCheck, Recycle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import TierBadge from "@/components/TierBadge";
import XPBar from "@/components/XPBar";
import FeedItem from "@/components/feed/FeedItem";
import EmptyState from "@/components/common/EmptyState";
import { getProfileByUserId } from "@/lib/profile";
import { formatDate } from "@/lib/greenergy";

export default function PublicProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(undefined);
  const [records, setRecords] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    getProfileByUserId(userId).then(setProfile).catch(() => setProfile(null));
    base44.entities.RecyclingRecord.filter({ created_by_id: userId, visibility: "public" }, "-date", 50).then(setRecords).catch(() => {});
    base44.entities.CommunityPost.filter({ created_by_id: userId }, "-created_date", 50).then(setPosts).catch(() => {});
    base44.entities.Follow.filter({ following_id: userId }, "-created_date", 500).then((f) => { setFollowers(f.length); if (user) setIsFollowing(!!f.find((x) => x.created_by_id === user.id)); }).catch(() => {});
    base44.entities.Follow.filter({ created_by_id: userId }, "-created_date", 500).then((f) => setFollowing(f.length)).catch(() => {});
  }, [userId, user, tick]);

  async function toggleFollow() {
    if (!user) { toast({ title: "sign in to follow", variant: "destructive" }); return; }
    setBusy(true);
    try {
      if (isFollowing) {
        const list = await base44.entities.Follow.filter({ created_by_id: user.id, following_id: userId }, "-created_date", 1);
        if (list[0]) await base44.entities.Follow.delete(list[0].id);
        setIsFollowing(false); setFollowers((f) => Math.max(0, f - 1));
      } else {
        await base44.entities.Follow.create({ following_id: userId });
        setIsFollowing(true); setFollowers((f) => f + 1);
        try { await base44.entities.Notification.create({ user_id: userId, actor_name: user?.full_name || "someone", type: "follow", text: "started following you", read: false }); } catch (e) {}
      }
    } catch (e) { toast({ title: "could not follow", variant: "destructive" }); }
    finally { setBusy(false); }
  }

  if (profile === undefined) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  if (profile === null) return <EmptyState icon={UserPlus} title="profile not found" description="this person hasn't set up a profile yet." />;

  const items = [
    ...records.map((x) => ({ type: "record", data: x, ts: new Date(x.date || x.created_date).getTime() })),
    ...posts.map((x) => ({ type: "post", data: x, ts: new Date(x.created_date).getTime() }))
  ].sort((a, b) => b.ts - a.ts);
  const isMe = user && user.id === userId;

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-8 md:py-12">
      <div className="rounded-md border border-border bg-surface-card p-6 shadow-hard-sm">
        <div className="flex items-start gap-4">
          <UserAvatar profile={profile} name={profile.display_name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><h1 className="font-heading text-2xl font-bold lowercase text-foreground truncate">{profile.display_name}</h1><TierBadge tier={profile.tier} xp={profile.xp} /></div>
            <p className="text-[0.82rem] text-muted-foreground lowercase">@{profile.username || "member"}</p>
            {profile.bio && <p className="mt-2 text-[0.88rem] leading-relaxed text-foreground/85">{profile.bio}</p>}
            {profile.location && <p className="mt-1 text-[0.78rem] text-muted-foreground">{profile.location}</p>}
          </div>
          {!isMe && (
            <button onClick={toggleFollow} disabled={busy} className={cn("press inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-[0.82rem] font-semibold shadow-hard-sm", isFollowing ? "border border-border bg-surface-card text-muted-foreground" : "bg-primary text-primary-foreground")}>
              {isFollowing ? <><UserCheck className="h-4 w-4" /> following</> : <><UserPlus className="h-4 w-4" /> follow</>}
            </button>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px bg-border rounded-md overflow-hidden border border-border">
          {[["xp", profile.xp || 0], ["followers", followers], ["following", following]].map(([l, v]) => (
            <div key={l} className="bg-surface-card px-2 py-3 text-center"><p className="font-display text-[1.25rem] leading-none tabular text-foreground">{v}</p><p className="mt-1 text-[0.62rem] uppercase tracking-wider text-muted-foreground">{l}</p></div>
          ))}
        </div>
        <div className="mt-5"><XPBar xp={profile.xp} /></div>
      </div>

      <h2 className="mt-8 mb-4 font-heading text-[0.95rem] font-semibold lowercase text-foreground">activity</h2>
      {items.length === 0 ? (
        <EmptyState icon={Recycle} title="no public activity" description="this member hasn't shared any public actions yet." />
      ) : (
        <div className="space-y-4">{items.map((it) => <FeedItem key={`${it.type}-${it.data.id}`} item={it} author={profile} onDeleted={() => setTick((t) => t + 1)} />)}</div>
      )}
    </div>
  );
}