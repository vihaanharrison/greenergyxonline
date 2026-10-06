import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Trophy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import TierBadge from "@/components/TierBadge";
import EmptyState from "@/components/common/EmptyState";

const PERIODS = [
  { key: "all", label: "all time" },
  { key: "month", label: "this month" },
  { key: "week", label: "this week" }
];

function periodStart(key) {
  const now = new Date();
  if (key === "week") { const d = new Date(now); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d; }
  if (key === "month") { const d = new Date(now); d.setDate(d.getDate() - 29); d.setHours(0, 0, 0, 0); return d; }
  return null;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("all");
  const [profiles, setProfiles] = useState(null);
  const [tx, setTx] = useState([]);

  useEffect(() => {
    base44.entities.Profile.list("-xp", 100).then(setProfiles).catch(() => setProfiles([]));
    base44.entities.XPTransaction.list("-created_date", 500).then(setTx).catch(() => setTx([]));
  }, []);

  if (profiles === null) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  let ranked;
  if (period === "all") {
    ranked = profiles.map((p) => ({ profile: p, xp: p.xp || 0 })).sort((a, b) => b.xp - a.xp);
  } else {
    const start = periodStart(period).getTime();
    const sums = {};
    tx.forEach((t) => {
      if (new Date(t.created_date).getTime() >= start) sums[t.created_by_id] = (sums[t.created_by_id] || 0) + (t.amount || 0);
    });
    ranked = profiles
      .map((p) => ({ profile: p, xp: sums[p.created_by_id] || 0 }))
      .filter((r) => r.xp > 0)
      .sort((a, b) => b.xp - a.xp);
  }

  const myRank = user ? ranked.findIndex((r) => r.profile.created_by_id === user.id) : -1;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:py-14">
      <header className="mb-6">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">leaderboard</p>
        <h1 className="mt-3 editorial-title text-foreground" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>who's recording.</h1>
        <p className="mt-2 text-[0.88rem] text-muted-foreground">ranked by XP. positive participation, not competition.</p>
      </header>

      <div className="mb-6 inline-flex rounded-md border border-border overflow-hidden">
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={cn("px-4 py-2 text-[0.82rem] lowercase transition-colors", period === p.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            {p.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <EmptyState icon={Trophy} title="no XP earned yet" description="be the first to record recycling and top the board." actionLabel="record recycling" actionTo="/new-record" />
      ) : (
        <ol className="space-y-2">
          {ranked.map((r, i) => {
            const me = user && r.profile.created_by_id === user.id;
            const medal = i === 0 ? "text-primary" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-muted-foreground/70" : "text-muted-foreground/40";
            return (
              <li key={r.profile.id} className={cn("flex items-center gap-3 rounded-md border bg-surface-card px-4 py-3", me ? "border-primary shadow-hard-sm" : "border-border")}>
                <span className={cn("w-6 text-center font-display text-lg tabular", medal)}>{i + 1}</span>
                <Link to={`/u/${r.profile.created_by_id}`}><UserAvatar profile={r.profile} name={r.profile.display_name} size="sm" /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/u/${r.profile.created_by_id}`} className="block truncate font-heading text-[0.9rem] font-semibold lowercase text-foreground hover:text-primary">
                    {r.profile.display_name || "member"}
                  </Link>
                  <TierBadge tier={r.profile.tier} />
                </div>
                <span className="tabular text-[0.9rem] font-semibold text-primary">{(r.xp || 0).toLocaleString()} xp</span>
              </li>
            );
          })}
        </ol>
      )}

      {myRank >= 0 && myRank >= 10 && (
        <div className="mt-4 rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-center text-[0.85rem] text-primary">
          you're ranked #{myRank + 1}. keep recording to climb.
        </div>
      )}
    </div>
  );
}