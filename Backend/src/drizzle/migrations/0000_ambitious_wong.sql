CREATE TYPE "public"."risk_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('patient', 'support_partner', 'admin');--> statement-breakpoint
CREATE TABLE "chatRoom" (
	"roomId" serial PRIMARY KEY NOT NULL,
	"isPersistent" boolean DEFAULT true,
	"description" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily-checkins" (
	"checkinId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"checkinAt" timestamp DEFAULT now() NOT NULL,
	"cravings" integer NOT NULL,
	"control" integer NOT NULL,
	"self_efficacy" integer NOT NULL,
	"consequences" boolean NOT NULL,
	"coping_used" boolean NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "craving_range" CHECK ("daily-checkins"."cravings" BETWEEN 1 AND 10),
	CONSTRAINT "control_range" CHECK ("daily-checkins"."control" BETWEEN 1 AND 10),
	CONSTRAINT "self_efficacy_range" CHECK ("daily-checkins"."self_efficacy" BETWEEN 1 AND 10 )
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"chatsId" serial PRIMARY KEY NOT NULL,
	"roomId" integer,
	"userId" integer,
	"message" text NOT NULL,
	"sender" "role" NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "risk-Scores" (
	"riskScore" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"score" integer NOT NULL,
	"riskLevel" "risk_level" DEFAULT 'low',
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support-partners-actions" (
	"actionId" serial PRIMARY KEY NOT NULL,
	"partnerId" integer,
	"userId" integer,
	"success" boolean NOT NULL,
	"actionDescription" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support-partners" (
	"partnerId" serial PRIMARY KEY NOT NULL,
	"user" integer,
	"partnerName" text NOT NULL,
	"contactInfo" text NOT NULL,
	"relationship" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userid" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" varchar,
	"password" varchar NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"streak_days" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"address" text,
	"usertype" "role" DEFAULT 'patient',
	"createdat" timestamp DEFAULT now(),
	"updatedat" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "daily-checkins" ADD CONSTRAINT "daily-checkins_userId_users_userid_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_roomId_chatRoom_roomId_fk" FOREIGN KEY ("roomId") REFERENCES "public"."chatRoom"("roomId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_users_userid_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk-Scores" ADD CONSTRAINT "risk-Scores_userId_users_userid_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support-partners-actions" ADD CONSTRAINT "support-partners-actions_partnerId_support-partners_partnerId_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."support-partners"("partnerId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support-partners-actions" ADD CONSTRAINT "support-partners-actions_userId_users_userid_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support-partners" ADD CONSTRAINT "support-partners_user_users_userid_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;