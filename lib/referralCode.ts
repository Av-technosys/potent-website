import { sql } from "drizzle-orm";
import { users } from "@/db/schema";
import type { db as dbType } from "@/db";

const ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random alphanumeric string of the specified length.
 */
function getRandomAlphanumeric(length = 5): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS[Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)];
  }
  return result;
}


export function generateReferralCode(name?: string | null): string {
  const cleanName = (name || "").replace(/[^a-zA-Z]/g, "").toUpperCase();

  let prefix = "USER";
  if (cleanName.length >= 4) {
    prefix = cleanName.slice(0, 4);
  } else if (cleanName.length >= 3) {
    prefix = cleanName.slice(0, 3);
  } else if (cleanName.length > 0) {
    prefix = (cleanName + "USER").slice(0, 4);
  }

  // 5-character alphanumeric string (e.g., 8X29K)
  const randomSuffix = getRandomAlphanumeric(5);

  return `${prefix}-${randomSuffix}`;
}

/**
 * Generates a unique referral code by verifying against the database case-insensitively.
 * If a collision occurs, it retries with a new random alphanumeric string.
 */
export async function generateUniqueReferralCode(
  database: typeof dbType,
  name?: string | null,
  maxRetries = 15,
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateReferralCode(name);
    const existing = await database
      .select({ id: users.id })
      .from(users)
      .where(sql`lower(${users.referralCode}) = lower(${code})`)
      .limit(1);

    if (existing.length === 0) {
      return code;
    }
  }

  // Fallback: If after retries still a collision, append an extra character
  const cleanName = (name || "").replace(/[^a-zA-Z]/g, "").toUpperCase();
  const prefix = cleanName.length >= 4 ? cleanName.slice(0, 4) : "USER";
  const randomSuffix6 = getRandomAlphanumeric(6);
  return `${prefix}-${randomSuffix6}`;
}
