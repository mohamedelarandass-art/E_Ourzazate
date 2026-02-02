-- AlterTable: Add optional productId to ContactMessage (TI3 fix)
-- Stores the product reference when a visitor's inquiry is about
-- a specific product. Not a foreign key — the product may be
-- deleted after the message is sent.
ALTER TABLE "contact_messages" ADD COLUMN "productId" TEXT;
