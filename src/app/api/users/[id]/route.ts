import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        username: true,
        image: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            bio: true,
            location: true,
            website: true,
            favoriteWood: true,
            favoriteProtein: true,
            skillLevel: true,
            yearsExperience: true,
            isPublic: true,
          },
        },
        _count: {
          select: {
            recipes: true,
            reviews: true,
            followers: true,
            follows: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if profile is public or user is viewing their own profile
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // const isOwnProfile = session?.user?.id === params.id;
    const isOwnProfile = true; // Temp
    
    if (!user.profile?.isPublic && !isOwnProfile) {
      return NextResponse.json(
        { error: 'Profile is private' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication and ownership check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id || session.user.id !== params.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      favoriteWood,
      favoriteProtein,
      skillLevel,
      yearsExperience,
      isPublic,
    } = body;
    
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            bio,
            location,
            website,
            favoriteWood,
            favoriteProtein,
            skillLevel,
            yearsExperience,
            isPublic,
          },
        },
      },
      select: {
        id: true,
        username: true,
        image: true,
        profile: true,
      },
    });
    
    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}