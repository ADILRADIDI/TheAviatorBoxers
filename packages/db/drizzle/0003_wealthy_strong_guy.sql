ALTER TABLE "products" ADD COLUMN "color_name" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sizes" jsonb DEFAULT '["S","M","L","XL","XXL"]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;