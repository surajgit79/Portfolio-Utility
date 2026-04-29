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
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"program" "program" NOT NULL,
	"module" text NOT NULL,
	"unit" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"skill_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"training_record_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "category" TO "program";--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "sector" TO "module";--> statement-breakpoint
ALTER TABLE "training_events" RENAME COLUMN "phase" TO "unit";--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "program" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "training_events" ALTER COLUMN "program" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."program";--> statement-breakpoint
CREATE TYPE "public"."program" AS ENUM('Activity-based Mathematics', 'Reading & Language', 'Pre-School Transformation');--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "program" SET DATA TYPE "public"."program" USING "program"::"public"."program";--> statement-breakpoint
ALTER TABLE "training_events" ALTER COLUMN "program" SET DATA TYPE "public"."program" USING "program"::"public"."program";--> statement-breakpoint
DROP INDEX "training_events_category_idx";--> statement-breakpoint
DROP INDEX "training_events_sector_idx";--> statement-breakpoint
DROP INDEX "training_events_phase_idx";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_skills" ADD CONSTRAINT "teacher_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_skills" ADD CONSTRAINT "teacher_skills_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_skills" ADD CONSTRAINT "teacher_skills_training_record_id_training_records_id_fk" FOREIGN KEY ("training_record_id") REFERENCES "public"."training_records"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "skills_program_idx" ON "skills" USING btree ("program");--> statement-breakpoint
CREATE INDEX "skills_module_idx" ON "skills" USING btree ("module");--> statement-breakpoint
CREATE INDEX "skills_unit_idx" ON "skills" USING btree ("unit");--> statement-breakpoint
CREATE INDEX "teacher_id_idx" ON "teacher_skills" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "skill_id_idx" ON "teacher_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_skills_unique" ON "teacher_skills" USING btree ("teacher_id","skill_id");--> statement-breakpoint
CREATE INDEX "training_events_category_idx" ON "training_events" USING btree ("program");--> statement-breakpoint
CREATE INDEX "training_events_sector_idx" ON "training_events" USING btree ("module");--> statement-breakpoint
CREATE INDEX "training_events_phase_idx" ON "training_events" USING btree ("unit");