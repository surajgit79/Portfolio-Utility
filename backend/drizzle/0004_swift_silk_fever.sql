ALTER TYPE "public"."sector" RENAME TO "category";--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "training_records" ALTER COLUMN "teacher_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "training_records" ALTER COLUMN "training_event_id" SET DATA TYPE text;