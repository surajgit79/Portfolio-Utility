CREATE INDEX "career_records_teacher_id_idx" ON "career_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "career_records_still_working_idx" ON "career_records" USING btree ("still_working");--> statement-breakpoint
CREATE INDEX "event_records_teacher_id_idx" ON "event_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teachers_user_id_idx" ON "teachers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teachers_emai_idx" ON "teachers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "teachers_name_idx" ON "teachers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "training_events_category_idx" ON "training_events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "training_events_sector_idx" ON "training_events" USING btree ("sector");--> statement-breakpoint
CREATE INDEX "training_events_phase_idx" ON "training_events" USING btree ("phase");--> statement-breakpoint
CREATE INDEX "training_events_start_date_idx" ON "training_events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "training_records_teacher_id_idx" ON "training_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "training_records_training_event_id_idx" ON "training_records" USING btree ("training_event_id");--> statement-breakpoint
CREATE INDEX "training_records_certificate_number_idx" ON "training_records" USING btree ("certificate_number");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");