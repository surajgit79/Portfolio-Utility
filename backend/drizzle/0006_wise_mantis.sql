ALTER TABLE "career_records" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "career_records" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "career_records" ADD COLUMN "achievements" text;