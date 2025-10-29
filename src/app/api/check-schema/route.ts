import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
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

    // Check what columns exist in the User table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `);

    await client.end();

    return NextResponse.json({
      success: true,
      columns: result.rows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to check table structure:', error);
    
    return NextResponse.json({
      error: "Failed to check table structure",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}