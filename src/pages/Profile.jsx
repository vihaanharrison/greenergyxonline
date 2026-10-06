import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Settings, Recycle, BarChart3, Award, Zap, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import TierBadge, { TierGlyph } from "@/components/TierBadge";
import XPBar from "@/components/XPBar";
import FeedItem from "@/components/feed/FeedItem";
import EmptyState from "@/components/common/EmptyState";
import MaterialDistribution from "@/components/charts/MaterialDistribution";
import CumulativeChart from "@/components/charts/CumulativeChart";
import ActivityChart from "@/components/charts/ActivityChart";
import { ensureMyProfile } from "@/lib/profile";
import { totalKg, formatWeight, formatDate } from "@/lib/greenergy";

const TABS = [["activity", "activity"], ["impact", "impact"], ["achievements", "achievements"]];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [posts, setPosts] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [tx, setTx] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [tab, setTab] = useState("activity");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) return;
    ensureMyProfile(user).then(setProfile);
    base44.entities.RecyclingRecord.filter({ created_by_id: user.id }, "-date", 200).then(setRecords).catch(() => {});
    base44.entities.CommunityPost.filter({ created_by_id: user.id }, "-created_date", 50).then(setPosts).catch(() => {});
    base44.entities.ChallengeParticipation.filter({ created_by_id: user.id }, "-created_date", 100).then(setParticipations).catch(() => {});
    base44.entities.XPTransaction.filter({ created_by_id: user.id }, "-created_date", 50).then(setTx).catch(() => {});
    base44.entities.Follow.filter({ following_id: user.id }, "-created_date", 500).then((f) => setFollowers(f.length)).catch(() => {});
    base44.entities.Follow.filter({ created_by_id: user.id }, "-created_date", 500).then((f) => setFollowing(f.length)).catch(() => {});
  }, [user, tick]);

  const items = useMemo(() => {
    const r = records.filter((x) => x.visibility === "public").map((x) => ({ type: "record", data: x, ts: new Date(x.date || x.created_date).getTime() }));
    const p = posts.map((x) => ({ type: "post", data: x, ts: new Date(x.created_date).getTime() }));
    return [...r, ...p].sort((a, b) => b.ts - a.ts);
  }, [records, posts]);

  if (!profile) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  const completed = participations.filter((p) => p.status === "completed");

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-8 md:py-12">
      {/* header */}
      <div className="rounded-md border border-border bg-surface-card p-6 shadow-hard-sm">
        <div className="flex items-start gap-4">
          <UserAvatar profile={profile} name={profile.display_name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold lowercase text-foreground truncate">{profile.display_name}</h1>
              <TierBadge tier={profile.tier} xp={profile.xp} />
            </div>
            <p className="text-[0.82rem] text-muted-foreground lowercase">@{profile.username || "member"}</p>
            {profile.bio && <p className="mt-2 text-[0.88rem] leading-relaxed text-foreground/85">{profile.bio}</p>}
            {profile.location && <p className="mt-1 text-[0.78rem] text-muted-foreground">{profile.location}</p>}
          </div>
          <Link to="/settings" className="press flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"><Settings className="h-4 w-4" /></Link>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-px bg-border rounded-md overflow-hidden border border-border">
          {[["xp", profile.xp || 0], ["records", records.length], ["followers", followers], ["following", following]].map(([l, v]) => (
            <div key={l} className="bg-surface-card px-2 py-3 text-center">
              <p className="font-display text-[1.25rem] leading-none tabular text-foreground">{v}</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-wider text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <XPBar xp={profile.xp} />
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 mb-5 flex gap-1 border-b border-border">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cn("relative px-4 py-2.5 text-[0.85rem] lowercase", tab === k ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {l}{tab === k && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {tab === "activity" && (
        items.length === 0 ? (
          <EmptyState icon={Recycle} title="no activity yet" description="your recorded actions will show up here." actionLabel="record recycling" actionTo="/new-record" />
        ) : (
          <div className="space-y-4">{items.map((it) => <FeedItem key={`${it.type}-${it.data.id}`} item={it} author={profile} onDeleted={() => setTick((t) => t + 1)} />)}</div>
        )
      )}

      {tab === "impact" && (
        records.length === 0 ? (
          <EmptyState icon={BarChart3} title="no impact data yet" description="record recycling to see your breakdown and timeline." actionLabel="record recycling" actionTo="/new-record" />
        ) : (
          <div className="space-y-5">
            <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">total recycled</p><p className="font-display text-3xl tabular text-primary">{formatWeight(totalKg(records))}</p></div>
            <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">materials</p><MaterialDistribution records={records} /></div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">activity · 14 days</p><ActivityChart records={records} days={14} /></div>
              <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">cumulative</p><CumulativeChart records={records} /></div>
            </div>
          </div>
        )
      )}

      {tab === "achievements" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-[0.95rem] font-semibold lowercase text-foreground mb-3">tier</h2>
            <div className="rounded-md border border-border bg-surface-card p-5">
              <div className="flex items-center justify-between">
                <div><TierBadge tier={profile.tier} xp={profile.xp} /><p className="mt-2 text-[0.82rem] text-muted-foreground lowercase">joined {formatDate(user?.created_date)}</p></div>
                <TierGlyph tier={profile.tier} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-[0.95rem] font-semibold lowercase text-foreground mb-3">challenges completed · {completed.length}</h2>
            {completed.length === 0 ? <p className="text-[0.85rem] text-muted-foreground">no challenges completed yet. browse active challenges for another target.</p> : (
              <ul className="space-y-2">
                {completed.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-[0.85rem] text-primary">
                    <Target className="h-4 w-4" /> challenge #{p.challenge_id.slice(-6)} · completed {formatDate(p.completed_date)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-heading text-[0.95rem] font-semibold lowercase text-foreground mb-3">XP history</h2>
            {tx.length === 0 ? <p className="text-[0.85rem] text-muted-foreground">no XP earned yet.</p> : (
              <ul className="space-y-1.5">
                {tx.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-md border border-border bg-surface-card px-4 py-2.5">
                    <span className="text-[0.82rem] text-foreground/85 lowercase">{t.reason}</span>
                    <span className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-primary"><Zap className="h-3 w-3 fill-primary" /> +{t.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}