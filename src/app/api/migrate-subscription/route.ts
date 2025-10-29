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

    // Add subscription fields to users table
    const migrations = [
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT DEFAULT 'free';`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscriptionTier" TEXT DEFAULT 'free';`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscriptionEnds" TIMESTAMP(3);`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "adFree" BOOLEAN DEFAULT false;`,
    ];

    for (const migration of migrations) {
      console.log(`Executing: ${migration}`);
      await client.query(migration);
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Added subscription fields to users table successfully"
    });

  } catch (error) {
    console.error('Migration failed:', error);
    
    return NextResponse.json({
      error: "Migration failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}