CREATE TABLE IF NOT EXISTS "razorpay_webhook_event" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" varchar NOT NULL,
  "event_name" varchar NOT NULL,
  "payment_id" varchar,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "razorpay_webhook_event_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payment_gateway_payment_id_unique"
ON "payment" ("gateway_payment_id")
WHERE "gateway_payment_id" IS NOT NULL;
