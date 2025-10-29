import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipeId, rating, comment } = body;

    if (!recipeId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already rated this recipe
    const existingRating = await prisma.rating.findFirst({
      where: {
        recipeId,
        userId: user.id,
      },
    });

    let result;
    if (existingRating) {
      // Update existing rating
      result = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          value: rating,
        },
      });

      // Update or create review
      if (comment) {
        await prisma.review.upsert({
          where: { userId_recipeId: { userId: user.id, recipeId } },
          update: { content: comment, rating },
          create: {
            content: comment,
            rating,
            userId: user.id,
            recipeId,
          },
        });
      }
    } else {
      // Create new rating
      result = await prisma.rating.create({
        data: {
          value: rating,
          recipeId,
          userId: user.id,
        },
      });

      // Create review if comment provided
      if (comment) {
        await prisma.review.create({
          data: {
            content: comment,
            rating,
            userId: user.id,
            recipeId,
          },
        });
      }
    }

    return NextResponse.json({ success: true, rating: result });
  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID required" }, { status: 400 });
    }

    // Get ratings with user info
    const ratings = await prisma.rating.findMany({
      where: { recipeId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get reviews separately
    const reviews = await prisma.review.findMany({
      where: { recipeId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data for frontend
    const reviewsData = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    }));

    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

    return NextResponse.json({
      reviews: reviewsData,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get ratings error:", error);
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}