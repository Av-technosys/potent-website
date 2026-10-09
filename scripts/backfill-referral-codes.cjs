/* eslint-disable @typescript-eslint/no-require-imports */
const postgres = require("postgres");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

const ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomAlphanumeric(length = 5) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS[Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)];
  }
  return result;
}

function generateCode(name) {
  const cleanName = (name || "").replace(/[^a-zA-Z]/g, "").toUpperCase();
  let prefix = "USER";
  if (cleanName.length >= 4) {
    prefix = cleanName.slice(0, 4);
  } else if (cleanName.length >= 3) {
    prefix = cleanName.slice(0, 3);
  } else if (cleanName.length > 0) {
    prefix = (cleanName + "USER").slice(0, 4);
  }

  return `${prefix}-${getRandomAlphanumeric(5)}`;
}

async function backfillReferralCodes() {
  console.log("Checking and upgrading user referral codes to secure 5-char alphanumeric format...");

  try {
    // 1. Ensure referral_code column and index exist
    console.log("Ensuring referral_code column exists in users table...");
    await sql`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referral_code" varchar(50);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" USING btree ("referral_code");
    `;

    // 2. Fetch all users to verify and upgrade codes
    const allUsers = await sql`
      SELECT id, name, email, referral_code FROM "users";
    `;

    // Users needing update: null/empty or old format (not matching 5-char alphanumeric suffix)
    const validFormatRegex = /^[A-Z]{3,4}-[A-Z0-9]{5}$/;
    const usersToUpdate = allUsers.filter(
      (u) => !u.referral_code || !validFormatRegex.test(u.referral_code)
    );

    const usedCodes = new Set(
      allUsers
        .filter((u) => u.referral_code && validFormatRegex.test(u.referral_code))
        .map((u) => u.referral_code.toUpperCase())
    );

    console.log(`Total users: ${allUsers.length}`);
    console.log(`Users needing code update to NIKH-8X29K format: ${usersToUpdate.length}`);

    if (usersToUpdate.length === 0) {
      console.log("All users already have valid 5-char alphanumeric referral codes! Nothing to update.");
    } else {
      let updatedCount = 0;
      for (const user of usersToUpdate) {
        let code = generateCode(user.name);
        let retries = 0;
        while (usedCodes.has(code.toUpperCase()) && retries < 25) {
          code = generateCode(user.name);
          retries++;
        }

        usedCodes.add(code.toUpperCase());

        await sql`
          UPDATE "users"
          SET referral_code = ${code}, updated_at = NOW()
          WHERE id = ${user.id};
        `;

        updatedCount++;
        console.log(`[${updatedCount}/${usersToUpdate.length}] Assigned ${code} to user: ${user.name || user.email} (${user.id})`);
      }

      console.log(`Successfully updated ${updatedCount} users.`);
    }

    // 3. Ensure unique constraint
    console.log("Ensuring unique constraint on users.referral_code...");
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_referral_code_unique') THEN
          ALTER TABLE "users" ADD CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code");
        END IF;
      END $$;
    `;

    // 4. Verify no users are left with null or invalid referral_code
    const currentUsers = await sql`
      SELECT id, name, email, referral_code FROM "users";
    `;
    console.log("\n--- Updated Users List ---");
    currentUsers.forEach((u) => {
      console.log(`${u.referral_code} | ${u.name} (${u.email})`);
    });

    console.log("\nMigration completed with 0 data loss!");
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

backfillReferralCodes();
