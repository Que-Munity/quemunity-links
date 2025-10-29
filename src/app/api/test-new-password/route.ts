import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;
  
  try {
    // Try with new password
    const newDbUrl = "postgresql://postgres:m9F4VRYSkmwOohWF@db.wwolcpyqzidmfjpmcwkq.supabase.co:5432/postgres?sslmode=require";
    
    client = new Client({
      connectionString: newDbUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Check if our tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    await client.end();
    
    return NextResponse.json({
      message: 'SUCCESS! Database connection working with new password!',
      allTables: result.rows,
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
      error: 'Database connection still failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}