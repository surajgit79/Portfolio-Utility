CREATE TYPE "public"."event_type" AS ENUM('Seminar', 'Conference', 'Panel Discussion', 'Podcast');--> statement-breakpoint
CREATE TABLE "career_records" (
	"id" text,
	"teacher_id" text NOT NULL,
	"role" text NOT NULL,
	"organization" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"still_working" integer DEFAULT 0 NOT NULL,
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
ALTER TABLE "career_records" ADD CONSTRAINT "career_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_records" ADD CONSTRAINT "event_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;