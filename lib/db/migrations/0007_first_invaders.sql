CREATE TABLE IF NOT EXISTS "stock_quotes_historic" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stock_quotes_historic_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ticker" text NOT NULL,
	"price" numeric NOT NULL,
	"volume" bigint NOT NULL,
	"changes_percentage" numeric,
	"quoted_at" timestamp DEFAULT now() NOT NULL
);
