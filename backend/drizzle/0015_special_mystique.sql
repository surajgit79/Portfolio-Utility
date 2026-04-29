CREATE TYPE "public"."event_type" AS ENUM('Seminar', 'Conference', 'Panel Discussion', 'Podcast');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Others');--> statement-breakpoint
CREATE TYPE "public"."grade" AS ENUM('Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10');--> statement-breakpoint
CREATE TYPE "public"."program" AS ENUM('Activity-based Mathematics', 'Reading & Language', 'Pre-School Transformation');--> statement-breakpoint
CREATE TABLE "career_records" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"role" text NOT NULL,
	"organization" text NOT NULL,
	"grade" "grade",
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"still_working" integer DEFAULT 0 NOT NULL,
	"achievements" text,
	"ref_contact" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_records" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"event_type" "event_type" NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"organizer" text NOT NULL,
	"venue" text,
	"date" timestamp NOT NULL,
	"description" text,
	"reference_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"contact" text NOT NULL,
	"email" text NOT NULL,
	"gender" "gender" NOT NULL,
	"image_url" text,
	"dob" date NOT NULL,
	"qualification" text,
	"teaching_since" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "training_events" (
	"id" text PRIMARY KEY NOT NULL,
	"program" "program" NOT NULL,
	"module" text NOT NULL,
	"unit" text,
	"name" text NOT NULL,
	"mentors_name" text,
	"venue" text,
	"start_date" timestamp NOT NULL,
	"duration" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_records" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"training_event_id" text NOT NULL,
	"rating" integer NOT NULL,
	"certificate_number" text NOT NULL,
	"ref_photos" text,
	"feedback" text,
	"skills" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "training_records_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'teacher' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "career_records" ADD CONSTRAINT "career_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_records" ADD CONSTRAINT "event_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_training_event_id_training_events_id_fk" FOREIGN KEY ("training_event_id") REFERENCES "public"."training_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "career_records_teacher_id_idx" ON "career_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "career_records_still_working_idx" ON "career_records" USING btree ("still_working");--> statement-breakpoint
CREATE INDEX "event_records_teacher_id_idx" ON "event_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "teachers_user_id_idx" ON "teachers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teachers_emai_idx" ON "teachers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "teachers_name_idx" ON "teachers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "training_events_category_idx" ON "training_events" USING btree ("program");--> statement-breakpoint
CREATE INDEX "training_events_sector_idx" ON "training_events" USING btree ("module");--> statement-breakpoint
CREATE INDEX "training_events_phase_idx" ON "training_events" USING btree ("unit");--> statement-breakpoint
CREATE INDEX "training_events_start_date_idx" ON "training_events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "training_records_teacher_id_idx" ON "training_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "training_records_training_event_id_idx" ON "training_records" USING btree ("training_event_id");--> statement-breakpoint
CREATE INDEX "training_records_certificate_number_idx" ON "training_records" USING btree ("certificate_number");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");