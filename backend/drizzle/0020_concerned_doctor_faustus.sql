CREATE TYPE "public"."bulk_job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."certificate_status" AS ENUM('generated', 'pending', 'ready', 'failed');--> statement-breakpoint
CREATE TABLE "bulk_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"status" "bulk_job_status" DEFAULT 'pending' NOT NULL,
	"pdf_url" text,
	"total_count" integer DEFAULT 0 NOT NULL,
	"done_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "certificates" ADD COLUMN "status" "certificate_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "bulk_jobs" ADD CONSTRAINT "bulk_jobs_event_id_training_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."training_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bulk_jobs_event_id_idx" ON "bulk_jobs" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "bulk_jobs_status_idx" ON "bulk_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "certificates_status_idx" ON "certificates" USING btree ("status");