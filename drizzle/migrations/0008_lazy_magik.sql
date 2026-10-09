CREATE TABLE IF NOT EXISTS "razorpay_webhook_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"event_name" varchar NOT NULL,
	"payment_id" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "razorpay_webhook_event_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referral_code" varchar(50);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" USING btree ("referral_code");--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_referral_code_unique') THEN
    ALTER TABLE "users" ADD CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code");
  END IF;
END $$;