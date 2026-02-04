-- Phase 3A: Full-Text Search + Analytics Events
-- Migration: 20260205000000_add_fulltext_search_and_analytics
--
-- This migration adds:
--   1. PostgreSQL unaccent extension for accent-insensitive French search
--   2. Custom french_unaccent text search configuration
--   3. tsvector column + GIN index on products for full-text search
--   4. Trigger to auto-compute search_vector on product INSERT/UPDATE
--   5. Trigger to propagate category name changes to product search vectors
--   6. analytics_events table for anonymous interaction tracking

-- ──────────────────────────────────────────────
-- Part 1: Unaccent Extension
-- ──────────────────────────────────────────────

-- Enable unaccent for accent-insensitive French search
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ──────────────────────────────────────────────
-- Part 2: Custom French Text Search Config
-- ──────────────────────────────────────────────

-- Custom text search config: French stemming + accent removal
-- Wrapped in DO block because CREATE TEXT SEARCH CONFIGURATION has no IF NOT EXISTS syntax
DO $$ BEGIN
  CREATE TEXT SEARCH CONFIGURATION french_unaccent (COPY = french);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TEXT SEARCH CONFIGURATION french_unaccent
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, french_stem;

-- ──────────────────────────────────────────────
-- Part 3: Add search_vector Column to Products
-- ──────────────────────────────────────────────

-- Add tsvector column for full-text search
ALTER TABLE "products" ADD COLUMN "search_vector" tsvector;

-- ──────────────────────────────────────────────
-- Part 4: GIN Index
-- ──────────────────────────────────────────────

-- GIN index for fast full-text search
CREATE INDEX "products_search_vector_idx" ON "products" USING GIN ("search_vector");

-- ──────────────────────────────────────────────
-- Part 5: Trigger Function for Product search_vector
-- ──────────────────────────────────────────────

-- Trigger function: recompute search_vector on product INSERT/UPDATE
-- Weights: A = product name, B = category name, C = description
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
DECLARE
  category_name TEXT;
BEGIN
  SELECT name INTO category_name FROM "categories" WHERE id = NEW."categoryId";

  NEW."search_vector" :=
    setweight(to_tsvector('french_unaccent', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('french_unaccent', COALESCE(category_name, '')), 'B') ||
    setweight(to_tsvector('french_unaccent', COALESCE(NEW.description, '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────
-- Part 6: Attach Product Trigger
-- ──────────────────────────────────────────────

-- Fire trigger on INSERT or UPDATE of searchable fields
DROP TRIGGER IF EXISTS products_search_vector_trigger ON "products";
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE OF "name", "description", "categoryId"
  ON "products"
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- ──────────────────────────────────────────────
-- Part 7: Backfill Existing Products
-- ──────────────────────────────────────────────

-- Backfill: trigger fires on UPDATE, so touch all existing rows
-- The WHERE TRUE ensures all rows are updated even with no actual data change
UPDATE "products" SET name = name WHERE TRUE;

-- ──────────────────────────────────────────────
-- Part 8: Category Name Change Propagation
-- ──────────────────────────────────────────────

-- When a category name changes, recompute search_vector for all its products
CREATE OR REPLACE FUNCTION categories_name_update_products() RETURNS trigger AS $$
BEGIN
  IF OLD.name IS DISTINCT FROM NEW.name THEN
    UPDATE "products" SET name = name WHERE "categoryId" = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_name_change_trigger ON "categories";
CREATE TRIGGER categories_name_change_trigger
  AFTER UPDATE OF "name" ON "categories"
  FOR EACH ROW
  EXECUTE FUNCTION categories_name_update_products();

-- ──────────────────────────────────────────────
-- Part 9: Analytics Events Table
-- ──────────────────────────────────────────────

-- Analytics events table for tracking anonymous user interactions
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "productId" TEXT,
    "categoryId" TEXT,
    "query" TEXT,
    "resultCount" INTEGER,
    "metadata" JSONB,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- Indexes for analytics queries
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");
CREATE INDEX "analytics_events_productId_idx" ON "analytics_events"("productId");
CREATE INDEX "analytics_events_query_idx" ON "analytics_events"("query");
