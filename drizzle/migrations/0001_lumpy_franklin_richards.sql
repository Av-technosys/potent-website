ALTER TABLE "products" ADD COLUMN "priority" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "size";