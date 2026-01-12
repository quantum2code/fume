ALTER TABLE "app" ALTER COLUMN "languages_supported" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "type" DROP NOT NULL;