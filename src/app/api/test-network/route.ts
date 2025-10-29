import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Try a simple fetch to test basic connectivity
    const response = await fetch('https://db.wwolcpyqzidmfjpmcwkq.supabase.co', {
      method: 'HEAD',
      headers: {
        'User-Agent': 'QueMunity-Test'
      }
    });

    return NextResponse.json({
      message: 'Network test completed',
      supabaseReachable: response.ok,
      status: response.status,
      dbUrlExists: !!dbUrl,
      dbUrlPreview: dbUrl.substring(0, 30) + '...',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Network test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}