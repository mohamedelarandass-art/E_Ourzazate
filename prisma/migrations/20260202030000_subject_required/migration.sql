-- AlterTable: Make ContactMessage.subject required (RC2 fix)
-- Previously String? (nullable), now String (required) to match
-- the Zod contactFormSchema which already requires subject.
ALTER TABLE "contact_messages" ALTER COLUMN "subject" SET NOT NULL;
