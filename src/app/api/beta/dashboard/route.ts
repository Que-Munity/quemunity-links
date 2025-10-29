import { NextResponse } from 'next/server';

// Simple in-memory storage for invite codes (in a real app, use a database)
const validInviteCodes = new Set<string>();

// Function to add a valid invite code (called from signup)
export function addValidInviteCode(code: string, testerInfo: any) {
  validInviteCodes.add(code);
  // In a real app, you'd store testerInfo with the code
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inviteCode = searchParams.get('code');

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      );
    }

    // For now, accept any invite code that looks valid (has reasonable length)
    // In production, you'd validate against stored codes
    if (!inviteCode || inviteCode.length < 10) {
      return NextResponse.json(
        { error: 'Invalid invite code format' },
        { status: 404 }
      );
    }

    // Mock tester data for valid codes
    const tester = {
      id: inviteCode.substring(0, 8),
      firstName: 'Beta',
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });