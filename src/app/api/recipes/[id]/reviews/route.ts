import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/recipes/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { title, content, rating, wouldMakeAgain, modifications } = body;
    
    // Validation
    if (!content || !rating) {
      return NextResponse.json(
        { error: 'Content and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
    });
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    const userId = 'temp-user-id'; // TODO: Get from session
    
    // Create or update review and rating
    const [review] = await prisma.$transaction([
      // Upsert review
      prisma.review.upsert({
        where: {
          userId_recipeId: {
            userId,
            recipeId: params.id,
          },
        },
        create: {
          userId,
          recipeId: params.id,
          title,
          content,
          rating,
          wouldMakeAgain,
          modifications,
        },
        update: {
          title,
          content,
          rating,
          wouldMakeAgain,
          modifications,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      }),
      
      // Upsert rating
      prisma.rating.upsert({
        where: {
          userId_recipeId: {
            userId,
            recipeId: params.id,
          },
        },
        create: {
          userId,
          recipeId: params.id,
          value: rating,
        },
        update: {
          value: rating,
        },
      }),
    ]);
    
    return NextResponse.json(review, { status: 201 });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// GET /api/recipes/[id]/reviews - Get reviews for a recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: {
          recipeId: params.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  skillLevel: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { recipeId: params.id },
      }),
    ]);
    
    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}