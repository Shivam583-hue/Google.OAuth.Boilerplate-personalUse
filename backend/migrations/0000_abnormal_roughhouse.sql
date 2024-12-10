CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"google_id" text NOT NULL,
	"email" text,
	"name" text NOT NULL,
	"profile_picture" text,
	"created_at" timestamp DEFAULT now()
);
