DROP INDEX "teachers_emai_idx";--> statement-breakpoint
ALTER TABLE "career_records" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "error_reason" text;--> statement-breakpoint
CREATE INDEX "teachers_email_idx" ON "teachers" USING btree ("email");