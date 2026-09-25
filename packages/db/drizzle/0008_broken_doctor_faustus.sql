ALTER TABLE "orders" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
UPDATE "orders" SET "idempotency_key" = 'legacy-' || "id"::text WHERE "idempotency_key" IS NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "idempotency_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_idempotency_key_unique" UNIQUE("idempotency_key");