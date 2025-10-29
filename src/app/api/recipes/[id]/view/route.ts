import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { recipeId } = await req.json();
    const session = await getServerSession(authOptions);
    
    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 });
    }

    // Get user's IP for anonymous tracking
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check if user is premium
    const isPremiumUser = session?.user?.subscriptionTier === 'premium' || 
                         session?.user?.subscriptionTier === 'pro';

    // Create view record
    const view = await prisma.recipeView.create({
      data: {
        recipeId,
        userId: session?.user?.id || null,
        isPremiumUser,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || null,
      },
    });

    // Update recipe view counts
    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        totalViews: {
          increment: 1,
        },
        premiumViews: isPremiumUser ? {
          increment: 1,
        } : undefined,
      },
    });

    // If this is a premium view, calculate earnings for the author
    if (isPremiumUser) {
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: { author: true },
      });

      if (recipe && recipe.author.creatorTier !== 'NONE') {
        // Calculate payment rate based on creator tier
        const rates = {
          BRONZE: 0.02,
          SILVER: 0.03,
          GOLD: 0.04,
          DIAMOND: 0.05,
        };

        const rate = rates[recipe.author.creatorTier as keyof typeof rates] || 0.02;
        const earning = rate;

        // Update author's total earnings
        await prisma.user.update({
          where: { id: recipe.authorId },
          data: {
            totalEarnings: {
              increment: earning,
            },
            totalViews: {
              increment: 1,
            },
          },
        });

        // Update creator tier if thresholds are met
        const author = await prisma.user.findUnique({
          where: { id: recipe.authorId },
        });

        if (author) {
          let newTier = author.creatorTier;
          
          if (author.totalViews >= 50000 && author.creatorTier !== 'DIAMOND') {
            newTier = 'DIAMOND';
          } else if (author.totalViews >= 10000 && author.creatorTier === 'GOLD') {
            newTier = 'GOLD';
          } else if (author.totalViews >= 1000 && author.creatorTier === 'SILVER') {
            newTier = 'SILVER';
          } else if (author.totalViews >= 1 && author.creatorTier === 'NONE') {
            newTier = 'BRONZE';
          }

          if (newTier !== author.creatorTier) {
            await prisma.user.update({
              where: { id: recipe.authorId },
              data: { creatorTier: newTier },
            });
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      isPremiumView: isPremiumUser,
    });

  } catch (error) {
    console.error('Recipe view tracking error:', error);
    return NextResponse.json({ 
      error: 'Failed to track view' 
    }, { status: 500 });
  }
}