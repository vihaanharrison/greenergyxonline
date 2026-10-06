import { useEffect, useState } from "react";
import { Loader2, BarChart3, Recycle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import ImpactMetrics from "@/components/community/ImpactMetrics";
import MaterialDistribution from "@/components/charts/MaterialDistribution";
import ActivityChart from "@/components/charts/ActivityChart";
import CumulativeChart from "@/components/charts/CumulativeChart";
import EmptyState from "@/components/common/EmptyState";
import { totalKg, formatWeight } from "@/lib/greenergy";

export default function Impact() {
  const { user } = useAuth();
  const [tab, setTab] = useState("community");
  const [allRecords, setAllRecords] = useState(null);
  const [myRecords, setMyRecords] = useState([]);
  const [participations, setParticipations] = useState([]);

  useEffect(() => {
    base44.entities.RecyclingRecord.filter({ visibility: "public" }, "-date", 500).then(setAllRecords).catch(() => setAllRecords([]));
    base44.entities.ChallengeParticipation.list("-created_date", 500).then(setParticipations).catch(() => {});
    if (user) base44.entities.RecyclingRecord.filter({ created_by_id: user.id }, "-date", 500).then(setMyRecords).catch(() => {});
  }, [user]);

  if (allRecords === null) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  const communityRecords = allRecords || [];
  const participants = new Set(communityRecords.map((r) => r.created_by_id)).size;
  const challengeCompletions = participations.filter((p) => p.status === "completed").length;

  return (
    <div className="mx-auto max-w-editorial px-6 py-10 md:py-14">
      <header className="mb-6 max-w-2xl">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">impact</p>
        <h1 className="mt-3 editorial-title text-foreground" style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}>real numbers, from real records.</h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">every figure below is calculated from recorded contributions. no estimates, no invented conversions. zero is shown proudly when there's no data.</p>
      </header>

      {user && (
        <div className="mb-8 inline-flex rounded-md border border-border overflow-hidden">
          {[["community", "community"], ["personal", "my impact"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={cn("px-4 py-2 text-[0.82rem] lowercase", tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
          ))}
        </div>
      )}

      {tab === "community" ? (
        <div className="space-y-6">
          <ImpactMetrics records={communityRecords} participants={participants} challengeCompletions={challengeCompletions} />
          {communityRecords.length === 0 ? (
            <EmptyState icon={Recycle} title="no community records yet" description="the community total is zero until someone records. that's honest, not empty." />
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">material breakdown</p><MaterialDistribution records={communityRecords} /></div>
                <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">activity · last 30 days</p><ActivityChart records={communityRecords} days={30} /></div>
              </div>
              <div className="rounded-md border border-border bg-surface-card p-6">
                <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">cumulative community recycling</p>
                <CumulativeChart records={communityRecords} />
                <p className="mt-3 text-[0.82rem] text-muted-foreground">total: <span className="tabular text-primary font-semibold">{formatWeight(totalKg(communityRecords))}</span> across {communityRecords.length} records.</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {myRecords.length === 0 ? (
            <EmptyState icon={BarChart3} title="no records yet" description="your impact starts at zero. record your first recycling activity." actionLabel="record recycling" actionTo="/new-record" />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-md overflow-hidden border border-border">
                {[["total recycled", formatWeight(totalKg(myRecords))], ["records", myRecords.length], ["this month", formatWeight(totalKg(myRecords.filter((r) => new Date(r.date) >= new Date(Date.now() - 30 * 864e5))))], ["items", myRecords.filter((r) => r.unit === "items").reduce((s, r) => s + (Number(r.quantity) || 0), 0)]].map(([l, v]) => (
                  <div key={l} className="bg-surface-card px-5 py-5">
                    <p className="font-display text-[1.75rem] leading-none tabular text-foreground lowercase">{v}</p>
                    <p className="mt-1.5 text-[0.7rem] uppercase tracking-wider text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">your materials</p><MaterialDistribution records={myRecords} /></div>
                <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">your activity · 14 days</p><ActivityChart records={myRecords} days={14} /></div>
              </div>
              <div className="rounded-md border border-border bg-surface-card p-6"><p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">your cumulative impact</p><CumulativeChart records={myRecords} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}