import { useEffect, useState } from "react";
import { Loader2, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import EmptyState from "@/components/common/EmptyState";
import { joinChallenge, getMyParticipations } from "@/lib/challenges";
import { ensureMyProfile } from "@/lib/profile";

export default function Challenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [myRecords, setMyRecords] = useState([]);
  const [counts, setCounts] = useState({});
  const [joining, setJoining] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    base44.entities.Challenge.filter({ status: "active" }, "-created_date", 50).then(setChallenges).catch(() => setChallenges([]));
    base44.entities.ChallengeParticipation.list("-created_date", 500).then(async (all) => {
      setParticipations(all);
      const c = {};
      all.forEach((p) => { c[p.challenge_id] = (c[p.challenge_id] || 0) + 1; });
      setCounts(c);
    }).catch(() => {});
    if (user) {
      getMyParticipations(user).then(setParticipations).catch(() => {});
      base44.entities.RecyclingRecord.filter({ created_by_id: user.id }, "-date", 500).then(setMyRecords).catch(() => {});
    }
  }, [user, tick]);

  async function onJoin(challenge) {
    if (!user) { toast({ title: "sign in to join", variant: "destructive" }); return; }
    setJoining(challenge.id);
    try { await ensureMyProfile(user); await joinChallenge(user, challenge); setTick((t) => t + 1); toast({ title: "joined challenge" }); }
    catch (e) { toast({ title: "could not join", variant: "destructive" }); }
    finally { setJoining(null); }
  }

  const list = challenges || [];
  const myPartMap = Object.fromEntries(participations.filter((p) => user && p.created_by_id === user.id).map((p) => [p.challenge_id, p]));

  if (challenges === null) return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="mx-auto max-w-editorial px-6 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">challenges</p>
        <h1 className="mt-3 editorial-title text-foreground" style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}>small targets, real progress.</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">join a challenge, record eligible recycling, and progress updates automatically from your real records. rewards are awarded once per completion.</p>
      </header>

      {list.length === 0 ? (
        <EmptyState icon={Target} title="no active challenges" description="check back soon — new challenges drop regularly." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              participation={myPartMap[c.id]}
              myRecords={myRecords}
              participantCount={counts[c.id] || 0}
              onJoin={onJoin}
              joining={joining === c.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}