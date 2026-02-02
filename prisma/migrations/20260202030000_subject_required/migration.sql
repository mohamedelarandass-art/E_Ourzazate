-- AlterTable: Make ContactMessage.subject required (RC2 fix)
-- Previously String? (nullable), now String (required) to match
-- the Zod contactFormSchema which already requires subject.
--
-- TI1: Backfill any NULL subjects before applying NOT NULL constraint.
-- Without this step, the migration would fail if existing rows have
-- NULL subjects (e.g., staging data, early testing).
UPDATE "contact_messages" SET "subject" = 'Sans sujet' WHERE "subject" IS NULL;
ALTER TABLE "contact_messages" ALTER COLUMN "subject" SET NOT NULL;
