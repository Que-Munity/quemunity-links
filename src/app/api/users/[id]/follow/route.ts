import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/users/[id]/follow - Follow a user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userIdToFollow = params.id;
    const currentUserId = session.user.id;

    // Can't follow yourself
    if (userIdToFollow === currentUserId) {
      return NextResponse.json(
        { message: 'You cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if user to follow exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userIdToFollow }
    });

    if (!userToFollow) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userIdToFollow
        }
      }
    });

    if (existingFollow) {
      return NextResponse.json(
        { message: 'Already following this user' },
        { status: 400 }
      );
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: userIdToFollow
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user'
    });

  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]/follow - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userIdToUnfollow = params.id;
    const currentUserId = session.user.id;

    // Delete follow relationship
    const deleted = await prisma.follow.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: userIdToUnfollow
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: 'You are not following this user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user'
    });

  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/follow - Check if following user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    }

    const userIdToCheck = params.id;
    const currentUserId = session.user.id;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userIdToCheck
        }
      }
    });

    return NextResponse.json({
      isFollowing: !!follow
    });

  } catch (error) {
    console.error('Check follow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
