/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from "slugify";
import { sql } from "drizzle-orm";

export async function generateUniqueSlug(
  executor: any,        // db OR tx
  value: string,
  column: any
) {
  const base = slugify(value || "item", {
    lower: true,
    strict: true,
    trim: true,
  });

  const table = column.table;

  const rows = await executor
    .select({ slug: column })
    .from(table)
    .where(sql`${column} ~ ${`^${base}(-[0-9]+)?$`}`);

  if (rows.length === 0) return base;

  let max = 0;

  for (const row of rows) {
    const slug = row.slug as string;

    if (slug === base) {
      max = Math.max(max, 1);
      continue;
    }

    const match = slug.match(/-(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }

  return `${base}-${max + 1}`;
}
