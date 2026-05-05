ALTER TABLE "training_records" DROP CONSTRAINT "training_records_certificate_number_unique";--> statement-breakpoint
DROP INDEX "training_records_certificate_number_idx";--> statement-breakpoint
ALTER TABLE "training_records" DROP COLUMN "certificate_number";