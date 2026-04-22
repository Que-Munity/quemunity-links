import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/posts/[id]/vote  body: { direction: 'up' | 'down' }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { direction } = await request.json();
    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ error: 'direction must be up or down' }, { status: 400 });
    }

    const userId = session.user.id as string;
    const value = direction === 'up' ? 1 : -1;

    const existing = await prisma.postVote.findUnique({
      where: { postId_userId: { postId: id, userId } },
    });

    let voteDelta = 0;

    if (existing) {
      if (existing.value === value) {
        await prisma.postVote.delete({ where: { postId_userId: { postId: id, userId } } });
        voteDelta = -value;
      } else {
        await prisma.postVote.update({
          where: { postId_userId: { postId: id, userId } },
          data: { value },
        });
        voteDelta = value * 2;
      }
    } else {
      await prisma.postVote.create({ data: { postId: id, userId, value } });
      voteDelta = value;
    }

    const post = await prisma.post.update({
      where: { id },
      data: { votes: { increment: voteDelta } },
      select: { votes: true },
    });

    return NextResponse.json({ votes: post.votes, userVote: existing?.value === value ? null : value });
  } catch (error) {
    console.error('Error voting on post:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}

// GET /api/posts/[id]/vote - get user's current vote
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ userVote: null });
    }

    const vote = await prisma.postVote.findUnique({
      where: { postId_userId: { postId: id, userId: session.user.id as string } },
    });

    return NextResponse.json({ userVote: vote?.value ?? null });
  } catch (error) {
    return NextResponse.json({ userVote: null });
  }
}
