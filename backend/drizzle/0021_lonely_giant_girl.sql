ALTER TABLE "certificates" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "certificates" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."certificate_status";--> statement-breakpoint
CREATE TYPE "public"."certificate_status" AS ENUM('generating', 'pending', 'ready', 'failed');--> statement-breakpoint
ALTER TABLE "certificates" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."certificate_status";--> statement-breakpoint
ALTER TABLE "certificates" ALTER COLUMN "status" SET DATA TYPE "public"."certificate_status" USING "status"::"public"."certificate_status";