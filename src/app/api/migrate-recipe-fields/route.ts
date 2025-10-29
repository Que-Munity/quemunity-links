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

    // Add new columns to recipes table
    const migrations = [
      `ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "sauce" TEXT;`,
      `ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "seasoningRub" TEXT;`,
    ];

    for (const migration of migrations) {
      console.log(`Executing: ${migration}`);
      await client.query(migration);
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Added sauce and seasoningRub fields to recipes table successfully"
    });

  } catch (error) {
    console.error('Migration failed:', error);
    
    return NextResponse.json({
      error: "Migration failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}