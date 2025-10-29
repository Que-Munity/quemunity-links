import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with creator info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        recipes: {
          include: {
            views: true,
            ratings: true,
          },
        },
      },
    });

    if (!user || user.subscriptionTier !== 'pro') {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 });
    }

    // Calculate stats
    const totalViews = user.totalViews || 0;
    const premiumViews = user.recipes.reduce((sum, recipe) => {
      return sum + recipe.views.filter(view => view.isPremiumUser).length;
    }, 0);

    const totalEarnings = user.totalEarnings || 0;
    
    // Calculate current month earnings (placeholder - would need to track by month)
    const currentMonthEarnings = 0; // This would be calculated from recent payouts

    const recipesCount = user.recipes.filter(recipe => recipe.isPublished).length;
    
    const averageRating = user.recipes.length > 0 
      ? user.recipes.reduce((sum, recipe) => {
          const recipeRating = recipe.ratings.length > 0
            ? recipe.ratings.reduce((rSum, rating) => rSum + rating.value, 0) / recipe.ratings.length
            : 0;
          return sum + recipeRating;
        }, 0) / user.recipes.length
      : 0;

    // Next payout date (1st of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextPayoutDate = nextMonth.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    // Recent activity (last 10 recipe views that generated earnings)
    const recentActivity = user.recipes
      .slice(0, 5)
      .map(recipe => ({
        recipeTitle: recipe.title,
        views: recipe.views.length,
        earnings: recipe.views.filter(view => view.isPremiumUser).length * 0.03, // Example rate
        date: recipe.createdAt.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
      }));

    const stats = {
      totalViews,
      premiumViews,
      totalEarnings,
      currentMonthEarnings,
      tier: user.creatorTier,
      recipesCount,
      averageRating,
      nextPayoutDate,
    };

    return NextResponse.json({ 
      stats, 
      recentActivity 
    });

  } catch (error) {
    console.error('Creator stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch creator stats' 
    }, { status: 500 });
  }
}