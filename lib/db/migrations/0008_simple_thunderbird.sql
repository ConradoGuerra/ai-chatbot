ALTER TABLE "stock_quotes_historic" ALTER COLUMN "quoted_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stock_quotes_historic" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;
