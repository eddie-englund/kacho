CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"service" varchar(64) NOT NULL,
	"service_url" text NOT NULL,
	"service_img_url" text,
	"title" varchar(128) NOT NULL,
	"cost" double precision NOT NULL,
	"currency" varchar(10) NOT NULL,
	"billing_interval" varchar(16) NOT NULL,
	"active" boolean NOT NULL
);
