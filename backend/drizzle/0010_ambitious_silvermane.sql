ALTER TABLE "training_records" ADD COLUMN "feedback" text;--> statement-breakpoint
ALTER TABLE "training_records" ADD COLUMN "skills" text[] DEFAULT '{}';