import { base44 } from "@/api/base44Client";
import { ensureMyProfile, addXp } from "@/lib/profile";
import { calcRecordXp } from "@/lib/xp";
import { progressForChallenge, recomputeParticipation, getMyParticipations } from "@/lib/challenges";

// Full record-creation flow: persist record, award XP, advance challenges, audit.
export async function submitRecyclingRecord(user, data) {
  const profile = await ensureMyProfile(user);
  const xp = calcRecordXp({ ...data });

  // 1. Persist the recycling record.
  const record = await base44.entities.RecyclingRecord.create({
    ...data,
    contributor_name: profile.display_name || user.full_name || "member",
    xp_earned: xp
  });

  // 2. Award XP for the record.
  let updatedProfile = await addXp(profile, xp, `recycled ${data.quantity}${data.unit} ${data.material}`, "record", record.id);

  // 3. Advance eligible joined challenges.
  const myRecords = await base44.entities.RecyclingRecord.filter({ created_by_id: user.id }, "-date", 500);
  const participations = await getMyParticipations(user);
  const challengesCompleted = [];
  const challenges = await base44.entities.Challenge.list("-created_date", 100);
  const challengeMap = Object.fromEntries(challenges.map((c) => [c.id, c]));

  for (const p of participations) {
    const challenge = challengeMap[p.challenge_id];
    if (!challenge || p.status === "completed") continue;
    // Only challenges whose material (if any) matches, or non-material challenges.
    if (challenge.material && challenge.material !== data.material) continue;
    const result = await recomputeParticipation({
      user, profile: updatedProfile, challenge, participation: p, records: myRecords, addXp
    });
    if (result.awarded > 0) {
      updatedProfile = await base44.entities.Profile.get(updatedProfile.id);
      challengesCompleted.push({ challenge, xp: result.awarded });
    }
  }

  return { record, xpEarned: xp, challengesCompleted, profile: updatedProfile };
}