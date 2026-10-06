import { base44 } from "@/api/base44Client";
import { tierForXp } from "@/lib/xp";

// Profile = public, owner-editable record that holds xp + identity.
// Avoids built-in User RLS restrictions for leaderboards / public profiles.

const cache = new Map(); // userId -> Profile

export async function getMyProfile(user) {
  if (!user) return null;
  if (cache.has(user.id)) return cache.get(user.id);
  const list = await base44.entities.Profile.filter({ created_by_id: user.id }, "-created_date", 1);
  const profile = list[0] || null;
  if (profile) cache.set(user.id, profile);
  return profile;
}

export async function ensureMyProfile(user) {
  if (!user) return null;
  const existing = await getMyProfile(user);
  if (existing) return existing;
  const created = await base44.entities.Profile.create({
    display_name: user.full_name || user.email?.split("@")[0] || "member",
    username: (user.email?.split("@")[0] || "member").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20),
    bio: "",
    xp: 0,
    streak: 0
  });
  cache.set(user.id, created);
  return created;
}

export async function getProfileByUserId(userId) {
  const list = await base44.entities.Profile.filter({ created_by_id: userId }, "-created_date", 1);
  return list[0] || null;
}

export async function getProfileByUsername(username) {
  const list = await base44.entities.Profile.filter({ username }, "-created_date", 1);
  return list[0] || null;
}

// Award XP: update profile total + tier, and write an auditable transaction.
export async function addXp(profile, amount, reason, sourceType, sourceId) {
  if (!profile || !amount) return profile;
  const newXp = (profile.xp || 0) + amount;
  const tier = tierForXp(newXp).name;
  const updated = await base44.entities.Profile.update(profile.id, { xp: newXp, tier });
  cache.set(updated.created_by_id, updated);
  try {
    await base44.entities.XPTransaction.create({
      amount,
      reason,
      source_type: sourceType,
      source_id: sourceId || null
    });
  } catch (e) { /* audit best-effort */ }
  return updated;
}

export function clearProfileCache(userId) {
  if (userId) cache.delete(userId); else cache.clear();
}