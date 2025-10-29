import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });
}