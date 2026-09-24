/* eslint-disable @typescript-eslint/no-explicit-any */
import { pageSize as defaultPageSize } from "@/const/globalconst";
import { db } from "@/db";
import { SQL, sql } from "drizzle-orm";
interface PaginateOptions<T> {
  table: T;
  page?: number;
  pageSize?: any;
  where?: SQL | undefined;
  orderBy?: SQL | SQL[];
}

export async function paginate<T>({
  table,
  page = 1,
  pageSize = defaultPageSize,
  where,
  orderBy,
}: PaginateOptions<T>) {
  const offset = (page - 1) * pageSize;

  // data query
  const dataQuery = db
    .select()
    .from(table as any)
    .limit(pageSize)
    .offset(offset);

  if (where) dataQuery.where(where);
  if (orderBy) dataQuery.orderBy(orderBy as any);

  const data = await dataQuery;

  // count query
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(table as any);

  if (where) countQuery.where(where);

  const [{ count }] = await countQuery;

  const total = Number(count);
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      total,
      totalPages,
      page,
      pageSize,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
