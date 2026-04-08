CREATE TYPE "public"."sector" AS ENUM('Activity-based Mathematics', 'Pre-School', 'Reading');--> statement-breakpoint
CREATE TABLE "training_events" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "sector" NOT NULL,
	"sector" text NOT NULL,
	"phase" text,
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
	"teacher_id" uuid NOT NULL,
	"training_event_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"certificate_number" text NOT NULL,
	"ref_photos" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "training_records_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_training_event_id_training_events_id_fk" FOREIGN KEY ("training_event_id") REFERENCES "public"."training_events"("id") ON DELETE cascade ON UPDATE no action;