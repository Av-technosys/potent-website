import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users, address, product, productMedia, productVariant } from "@/db/schema";
import { z } from "zod";


export const insertProductSechma = createInsertSchema(product, {
    name: z.string("Name is required").min(3),
    description: z.string("Description is required").min(10),
});
export const insertProductMediaSchema = createInsertSchema(productMedia);
export const insertProductVarientSchema = createInsertSchema(productVariant);



export type productType = z.infer<typeof insertProductSechma>;
export type productAttributeType = {
    id?: string;
    productId?: string | null;
    attribute?: string | null;
    value?: string | null;
};
export type productMediaType = z.infer<typeof insertProductMediaSchema>;
export type productVarientType = z.infer<typeof insertProductVarientSchema>;
