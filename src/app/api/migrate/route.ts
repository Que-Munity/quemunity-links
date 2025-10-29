import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({
        error: "No DATABASE_URL environment variable found"
      });
    }

    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // Drop existing tables if they exist and recreate with proper schema
    const migrations = [
      `DROP TABLE IF EXISTS "User" CASCADE;`,
      `DROP TABLE IF EXISTS "Account" CASCADE;`, 
      `DROP TABLE IF EXISTS "Session" CASCADE;`,
      
      `CREATE TABLE "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "firstName" TEXT,
        "lastName" TEXT,
        "bio" TEXT,
        "location" TEXT,
        "smokerType" TEXT,
        "experienceLevel" TEXT DEFAULT 'beginner',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );`,
      
      `CREATE UNIQUE INDEX "users_email_key" ON "users"("email");`,
      `CREATE UNIQUE INDEX "users_username_key" ON "users"("username");`,
      
      `CREATE TABLE "accounts" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      );`,
      
      `CREATE TABLE "sessions" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      );`,
      
      `CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");`,
      `CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");`
    ];

    for (const migration of migrations) {
      await client.query(migration);
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully"
    });

  } catch (error) {
    console.error('Migration failed:', error);
    
    return NextResponse.json({
      error: "Migration failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}