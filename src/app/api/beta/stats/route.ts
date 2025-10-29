import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });
}