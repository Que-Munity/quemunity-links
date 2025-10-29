-- Add columns for display name, phone, and birthday to users
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS birthday TIMESTAMP;

-- Make display_name unique to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'users_display_name_unique'
  ) THEN
    CREATE UNIQUE INDEX users_display_name_unique ON users (display_name);
  END IF;
END$$;
