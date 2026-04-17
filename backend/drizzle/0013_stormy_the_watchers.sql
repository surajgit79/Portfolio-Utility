ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token_expiration" timestamp;