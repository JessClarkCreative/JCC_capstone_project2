-- First, add the username column as nullable
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- Update existing users with a default username based on their email
UPDATE "users" SET "username" = CONCAT('user_', id::text) WHERE "username" IS NULL;

-- Now make the username column required and unique
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

-- Add the unique constraint
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");