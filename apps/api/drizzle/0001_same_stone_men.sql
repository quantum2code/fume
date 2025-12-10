CREATE TABLE "app" (
	"id" serial PRIMARY KEY NOT NULL,
	"steam_appid" integer NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"required_age" integer,
	"hero_image" varchar NOT NULL,
	"website" varchar,
	"controller_support" varchar,
	"legal_notice" text,
	"description_short" varchar NOT NULL,
	"description_detailed" text,
	"languages_supported" jsonb,
	"metacritic_data" jsonb,
	"release_date_info" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_achievement" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon_url" text,
	"global_percent" numeric
);
--> statement-breakpoint
CREATE TABLE "app_category_link" (
	"app_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "app_category_link_app_id_category_id_pk" PRIMARY KEY("app_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "app_company_link" (
	"app_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "app_company_link_app_id_company_id_role_pk" PRIMARY KEY("app_id","company_id","role")
);
--> statement-breakpoint
CREATE TABLE "app_content_link" (
	"parent_app_id" integer NOT NULL,
	"child_app_id" integer NOT NULL,
	"type" varchar NOT NULL,
	CONSTRAINT "app_content_link_parent_app_id_child_app_id_type_pk" PRIMARY KEY("parent_app_id","child_app_id","type")
);
--> statement-breakpoint
CREATE TABLE "app_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"path_thumbnail" text,
	"path_full" text
);
--> statement-breakpoint
CREATE TABLE "app_movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"name" varchar,
	"thumbnail" text,
	"url_480p" text,
	"url_max" text
);
--> statement-breakpoint
CREATE TABLE "app_price" (
	"app_id" integer PRIMARY KEY NOT NULL,
	"currency_code" varchar NOT NULL,
	"price_initial" integer NOT NULL,
	"price_final" integer NOT NULL,
	"discount_percent" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_requirement" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"platform" varchar NOT NULL,
	"spec_type" varchar NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievement_status" (
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL,
	"unlocked_at" timestamp,
	CONSTRAINT "user_achievement_status_user_id_achievement_id_pk" PRIMARY KEY("user_id","achievement_id")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "app_achievement" ADD CONSTRAINT "app_achievement_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_category_link" ADD CONSTRAINT "app_category_link_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_category_link" ADD CONSTRAINT "app_category_link_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_company_link" ADD CONSTRAINT "app_company_link_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_company_link" ADD CONSTRAINT "app_company_link_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_content_link" ADD CONSTRAINT "app_content_link_parent_app_id_app_id_fk" FOREIGN KEY ("parent_app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_content_link" ADD CONSTRAINT "app_content_link_child_app_id_app_id_fk" FOREIGN KEY ("child_app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_images" ADD CONSTRAINT "app_images_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_movies" ADD CONSTRAINT "app_movies_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_price" ADD CONSTRAINT "app_price_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_requirement" ADD CONSTRAINT "app_requirement_app_id_app_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."app"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievement_status" ADD CONSTRAINT "user_achievement_status_achievement_id_app_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."app_achievement"("id") ON DELETE no action ON UPDATE no action;