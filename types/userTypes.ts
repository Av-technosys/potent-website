import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, address } from "@/db/schema";
import { z } from "zod";

// User Type
export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users)
export const userAddressInsertSchema = createInsertSchema(address);
export const userAddressSelectSchema = createSelectSchema(address);