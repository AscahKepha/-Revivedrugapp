ALTER TABLE "daily-checkins" DROP CONSTRAINT "self_efficacy_range";--> statement-breakpoint
ALTER TABLE "support-partners" DROP CONSTRAINT "support-partners_user_users_userid_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "partner_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_partner_id_support-partners_partnerId_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."support-partners"("partnerId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily-checkins" ADD CONSTRAINT "self_efficacy_range" CHECK ("daily-checkins"."self_efficacy" BETWEEN 1 AND 10);