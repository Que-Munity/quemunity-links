import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({
        error: "No DATABASE_URL environment variable found",
        timestamp: new Date().toISOString()
      });
    }

    console.log('Testing Transaction Pooler connection...');
    console.log('Connection string format:', connectionString.replace(/:[^:@]*@/, ':****@'));

    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('Connected to database via Transaction Pooler');

    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    
    await client.end();

    return NextResponse.json({
      success: true,
      message: "Transaction Pooler connection successful!",
      data: result.rows[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Transaction Pooler connection failed:', error);
    
    return NextResponse.json({
      error: "Transaction Pooler connection failed",
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}