import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;
  
  try {
    // Try with SSL mode require
    const dbUrlWithSSL = "postgresql://postgres:gyaGUEAX9sFJnliG@db.wwolcpyqzidmfjpmcwkq.supabase.co:5432/postgres?sslmode=require";
    
    client = new Client({
      connectionString: dbUrlWithSSL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Try to check if our tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'recipe')
    `);
    
    await client.end();
    
    return NextResponse.json({
      message: 'Database connection successful with SSL!',
      tables: result.rows,
      tableCount: result.rows.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (client) {
      try {
        await client.end();
      } catch (endError) {
        // Ignore cleanup errors
      }
    }

    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}