ALTER TYPE "public"."category" RENAME TO "program";--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "category" TO "program";--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "sector" TO "module";--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "phase" TO "unit";--> statement-breakpoint
ALTER TABLE "training_events" ALTER COLUMN "program" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."program";--> statement-breakpoint
CREATE TYPE "public"."program" AS ENUM('Activity-based Mathematics', 'Reading & Language', 'Pre-School');--> statement-breakpoint
ALTER TABLE "training_events" ALTER COLUMN "program" SET DATA TYPE "public"."program" USING "program"::"public"."program";--> statement-breakpoint
DROP INDEX "training_events_category_idx";--> statement-breakpoint
DROP INDEX "training_events_sector_idx";--> statement-breakpoint
DROP INDEX "training_events_phase_idx";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "training_events_category_idx" ON "training_events" USING btree ("program");--> statement-breakpoint
CREATE INDEX "training_events_sector_idx" ON "training_events" USING btree ("module");--> statement-breakpoint
CREATE INDEX "training_events_phase_idx" ON "training_events" USING btree ("unit");