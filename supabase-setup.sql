-- Run this SQL in your Supabase SQL Editor to create the required tables

-- First, let's drop the problematic recipe table if it exists
DROP TABLE IF EXISTS recipe CASCADE;

-- Create User table (lowercase for PostgreSQL) - this should already exist
-- CREATE TABLE IF NOT EXISTS users (
--   id TEXT PRIMARY KEY NOT NULL,
--   email TEXT UNIQUE NOT NULL,
--   username TEXT UNIQUE NOT NULL,
--   password TEXT NOT NULL,
--   "firstName" TEXT,
--   "lastName" TEXT,
--   bio TEXT,
--   location TEXT,
--   "smokerType" TEXT,
--   "experienceLevel" TEXT DEFAULT 'beginner',
--   "joinedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   "lastActive" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Create indexes for better performance (if users table exists)
-- CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
-- CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

-- Create Recipe table with correct foreign key reference
CREATE TABLE IF NOT EXISTS recipe (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  "cookTime" INTEGER,
  "prepTime" INTEGER,
  servings INTEGER,
  difficulty TEXT DEFAULT 'medium',
  category TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("authorId") REFERENCES users(id)
);

-- Insert some sample data to test
-- INSERT INTO "User" ("id", "email", "username", "password", "firstName", "lastName") 
-- VALUES ('test-id-123', 'test@example.com', 'testuser', '$2a$12$hashedpassword', 'Test', 'User');

-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('users', 'recipe');