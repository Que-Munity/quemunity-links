import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });
}