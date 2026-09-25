CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"value" integer NOT NULL,
	"min_cart_cents" integer DEFAULT 0 NOT NULL,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"pack_only" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"neighborhood" text,
	"notes" text,
	"items" jsonb NOT NULL,
	"subtotal_cents" integer NOT NULL,
	"shipping_fee_cents" integer NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"total_cents" integer NOT NULL,
	"payment_method" text DEFAULT 'cod' NOT NULL,
	"coupon_code" text,
	"status" text DEFAULT 'nouvelle' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"title_fr" text NOT NULL,
	"title_darija" text,
	"subtitle_fr" text,
	"subtitle_darija" text,
	"badge_fr" text,
	"badge_darija" text,
	"image_url" text,
	"background_color" text DEFAULT '#00285E' NOT NULL,
	"text_color" text DEFAULT '#FFFFFF' NOT NULL,
	"accent_color" text DEFAULT '#C7D400' NOT NULL,
	"coupon_code" text,
	"cta_label_fr" text,
	"cta_label_darija" text,
	"cta_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "promotions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"name" text NOT NULL,
	"city" text,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" text NOT NULL,
	"region" text,
	"fee_cents" integer DEFAULT 3500 NOT NULL,
	"free_threshold_cents" integer,
	"delivery_time" text DEFAULT '24-48h' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "shipping_zones_city_unique" UNIQUE("city")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;