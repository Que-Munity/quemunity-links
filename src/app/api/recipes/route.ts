import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
// import { authOptions } from '@/lib/auth';

// GET /api/recipes - Get all recipes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const cookingMethod = searchParams.get('cookingMethod') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build where clause
    const where: any = {
      isPublished: true,
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }
    
    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }
    
    if (cookingMethod) {
      where.cookingMethod = cookingMethod.toUpperCase();
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get recipes with related data
    const [recipes, totalCount] = await Promise.all([
      prisma.recipe.findMany({
        where,
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
          reviews: {
            select: { id: true },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              reviews: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);
    
    // Calculate average ratings
    const recipesWithStats = recipes.map(recipe => {
      const avgRating = recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length 
        : 0;
      
      return {
        ...recipe,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: recipe.ratings.length,
        totalReviews: recipe._count.reviews,
        totalFavorites: recipe._count.favorites,
        ratings: undefined, // Remove raw ratings from response
      };
    });
    
    return NextResponse.json({
      recipes: recipesWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    // Check authentication - TODO: Implement with simple auth
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    // }

    // For now, skip auth check - TODO: implement proper auth
    // Find the user by email
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    // });

    // Temporary: use first user for testing
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    
    const {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cookingMethod,
      smokingWood,
      smokerTemp,
      internalTemp,
      sauce,
      seasoningRub,
      ingredients,
      instructions,
      tags,
      nutrition,
    } = body;
    
    // Create recipe with related data
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        prepTime,
        cookTime,
        totalTime: prepTime + cookTime,
        servings,
        difficulty: difficulty.toUpperCase(),
        cookingMethod: cookingMethod.toUpperCase(),
        smokingWood,
        smokerTemp,
        internalTemp,
        sauce,
        seasoningRub,
        authorId: user.id,
        isPublished: true,
        isDraft: false,
        
        // Create ingredients
        ingredients: {
          create: ingredients?.map((ingredient: any, index: number) => ({
            amount: ingredient.amount,
            unit: ingredient.unit,
            preparation: ingredient.preparation,
            optional: ingredient.optional || false,
            section: ingredient.section,
            order: index,
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.name },
                create: {
                  name: ingredient.name,
                  category: ingredient.category || 'OTHER',
                },
              },
            },
          })),
        },
        
        // Create instructions
        instructions: {
          create: instructions?.map((instruction: any, index: number) => ({
            stepNumber: index + 1,
            title: instruction.title,
            description: instruction.description,
            temperature: instruction.temperature,
            time: instruction.time,
          })),
        },
        
        // Create nutrition if provided
        ...(nutrition && {
          nutrition: {
            create: nutrition,
          },
        }),
        
        // Create tags
        ...(tags && {
          tags: {
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: {
          orderBy: { stepNumber: 'asc' },
        },
        nutrition: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    return NextResponse.json(recipe, { status: 201 });
    
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}