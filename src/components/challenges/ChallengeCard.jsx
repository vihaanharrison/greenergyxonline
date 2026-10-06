import { Link } from "react-router-dom";
import { Check, Target, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChallengeProgress from "@/components/challenges/ChallengeProgress";
import { progressForChallenge } from "@/lib/challenges";
import { materialLabel } from "@/lib/greenergy";
import { cn } from "@/lib/utils";

function timeframe(challenge) {
  if (challenge.unit === "days") return `${challenge.target_quantity}-day streak`;
  if (challenge.cadence === "week") return "this week";
  return "all time";
}

export default function ChallengeCard({ challenge, participation, myRecords, participantCount, onJoin, joining }) {
  const joined = !!participation;
  const prog = joined ? progressForChallenge(challenge, myRecords || []) : null;
  const complete = participation?.status === "completed";

  return (
    <div className={cn("flex flex-col rounded-md border bg-surface-card p-5 shadow-hard-sm", complete ? "border-primary/60" : "border-border")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/40 text-primary">
              <Target className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <h3 className="font-heading text-[1.05rem] font-semibold lowercase text-foreground">{challenge.title.toLowerCase()}</h3>
          </div>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">{challenge.description}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-primary/50 bg-primary/15 px-2 py-1 text-[0.72rem] font-semibold text-primary">
          <Zap className="h-3 w-3 fill-primary" /> {challenge.reward_xp} xp
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] text-muted-foreground">
        <span className="lowercase">{timeframe(challenge)}</span>
        {challenge.material && <span className="lowercase">· {materialLabel(challenge.material)}</span>}
        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {participantCount || 0}</span>
      </div>

      {joined && prog && (
        <div className="mt-4">
          <ChallengeProgress {...prog} unit={challenge.unit} />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        {complete ? (
          <span className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-primary">
            <Check className="h-4 w-4" /> completed
          </span>
        ) : joined ? (
          <span className="text-[0.78rem] text-muted-foreground">in progress · keep recording</span>
        ) : (
          <Button onClick={() => onJoin(challenge)} disabled={joining} className="press w-full bg-primary text-primary-foreground shadow-hard-sm">
            {joining ? "joining…" : (<>join challenge <ArrowRight className="h-4 w-4" /></>)}
          </Button>
        )}
      </div>
    </div>
  );
}