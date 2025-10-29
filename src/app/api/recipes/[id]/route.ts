import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/recipes/[id] - Get single recipe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true
          }
        },
        ingredients: {
          include: {
            ingredient: true
          }
        },
        instructions: {
          orderBy: { stepNumber: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        },
        ratings: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = recipe.ratings.length > 0
      ? recipe.ratings.reduce((sum: number, rating: any) => sum + rating.value, 0) / recipe.ratings.length
      : 0;

    return NextResponse.json({
      ...recipe,
      avgRating,
      totalRatings: recipe.ratings.length
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/recipes/[id] - Delete recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.recipe.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Recipe deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
