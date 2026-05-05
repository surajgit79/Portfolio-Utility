CREATE TABLE "certificate_modules" (
	"id" text PRIMARY KEY NOT NULL,
	"certificate_id" text NOT NULL,
	"training_record_id" text NOT NULL,
	"module" text NOT NULL,
	"unit" text,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"program" "program" NOT NULL,
	"certificate_number" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
ALTER TABLE "certificate_modules" ADD CONSTRAINT "certificate_modules_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate_modules" ADD CONSTRAINT "certificate_modules_training_record_id_training_records_id_fk" FOREIGN KEY ("training_record_id") REFERENCES "public"."training_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "certificate_modules_certificate_id_idx" ON "certificate_modules" USING btree ("certificate_id");--> statement-breakpoint
CREATE UNIQUE INDEX "certificate_modules_unique" ON "certificate_modules" USING btree ("certificate_id","module","unit");--> statement-breakpoint
CREATE INDEX "certificates_teacher_id_idx" ON "certificates" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "certificates_program_idx" ON "certificates" USING btree ("program");--> statement-breakpoint
CREATE UNIQUE INDEX "certificates_teacher_program_unique" ON "certificates" USING btree ("teacher_id","program");