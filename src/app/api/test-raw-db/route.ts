import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;
  
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Try raw PostgreSQL connection
    client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Try a simple query
    const result = await client.query('SELECT NOW() as current_time');
    
    await client.end();
    
    return NextResponse.json({
      message: 'Raw PostgreSQL connection successful',
      currentTime: result.rows[0].current_time,
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
      error: 'Raw PostgreSQL connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}