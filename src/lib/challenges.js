import { base44 } from "@/api/base44Client";
import { toKg } from "@/lib/greenergy";

// Pure: compute a user's current progress on a challenge from their records.
export function progressForChallenge(challenge, records = []) {
  if (!challenge) return { value: 0, target: 0, pct: 0, complete: false };
  const target = Number(challenge.target_quantity) || 0;
  let eligible = records.slice();
  if (challenge.material) eligible = eligible.filter((r) => r.material === challenge.material);

  if (challenge.cadence === "week") {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    eligible = eligible.filter((r) => new Date(r.date || r.created_date) >= start);
  }

  let value = 0;
  if (challenge.unit === "days") {
    const days = new Set(eligible.map((r) => new Date(r.date || r.created_date).toDateString()));
    value = days.size;
  } else if (challenge.unit === "items") {
    value = eligible.filter((r) => r.unit === "items").reduce((s, r) => s + (Number(r.quantity) || 0), 0);
  } else {
    value = eligible.reduce((s, r) => s + toKg(r), 0);
  }

  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return { value, target, pct, complete: value >= target && target > 0 };
}

// Join a challenge (idempotent).
export async function joinChallenge(user, challenge) {
  const existing = await base44.entities.ChallengeParticipation.filter({
    created_by_id: user.id,
    challenge_id: challenge.id
  }, "-created_date", 1);
  if (existing[0]) return existing[0];
  return base44.entities.ChallengeParticipation.create({
    challenge_id: challenge.id,
    status: "joined",
    progress: 0
  });
}

// Recompute a participation after a new record; award reward once on completion.
export async function recomputeParticipation({ user, profile, challenge, participation, records, addXp }) {
  const prog = progressForChallenge(challenge, records);
  const updates = { progress: prog.value };
  let awarded = 0;
  if (prog.complete && participation.status !== "completed") {
    updates.status = "completed";
    updates.completed_date = new Date().toISOString();
    awarded = Number(challenge.reward_xp) || 0;
    if (awarded > 0) {
      await addXp(profile, awarded, `challenge: ${challenge.title}`, "challenge", challenge.id);
    }
    try {
      await base44.entities.Notification.create({
        user_id: user.id,
        actor_name: "greenergyX",
        type: "challenge",
        text: `you completed "${challenge.title}" · +${awarded} XP`,
        target_type: "challenge",
        target_id: challenge.id,
        read: false
      });
    } catch (e) {}
  }
  await base44.entities.ChallengeParticipation.update(participation.id, updates);
  return { awarded, complete: prog.complete };
}

export async function getMyParticipations(user) {
  if (!user) return [];
  return base44.entities.ChallengeParticipation.filter({ created_by_id: user.id }, "-created_date", 100);
}

export async function countParticipants(challengeId) {
  const list = await base44.entities.ChallengeParticipation.filter({ challenge_id: challengeId }, "-created_date", 500);
  return list.length;
}