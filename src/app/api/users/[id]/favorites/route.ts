import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]/favorites - Get user's favorite recipes
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // TODO: Add authentication check for private profiles
    
    const [favorites, totalCount] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: params.id },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
              images: {
                where: { isPrimary: true },
                take: 1,
              },
              ratings: true,
              _count: {
                select: {
                  reviews: true,
                  favorites: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.favorite.count({
        where: { userId: params.id },
      }),
    ]);
    
    // Calculate average ratings for each recipe
    const favoritesWithStats = favorites.map(favorite => {
      const recipe = favorite.recipe;
      const avgRating = recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length 
        : 0;
      
      return {
        ...favorite,
        recipe: {
          ...recipe,
          avgRating: Math.round(avgRating * 10) / 10,
          totalRatings: recipe.ratings.length,
          ratings: undefined,
        },
      };
    });
    
    return NextResponse.json({
      favorites: favoritesWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/favorites - Add recipe to favorites
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id || session.user.id !== params.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { recipeId } = await request.json();
    
    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }
    
    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    // Add to favorites (upsert to avoid duplicates)
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_recipeId: {
          userId: params.id,
          recipeId,
        },
      },
      create: {
        userId: params.id,
        recipeId,
      },
      update: {},
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
    
    return NextResponse.json(favorite, { status: 201 });
    
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]/favorites - Remove recipe from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id || session.user.id !== params.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    
    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId: params.id,
          recipeId,
        },
      },
    });
    
    return NextResponse.json({ message: 'Favorite removed successfully' });
    
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}