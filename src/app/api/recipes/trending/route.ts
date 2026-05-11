import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublished: true },
      include: {
        author: { select: { username: true, displayName: true, image: true } },
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { favorites: true, comments: true, reviews: true } },
      },
      orderBy: [
        { favorites: { _count: 'desc' } },
        { totalViews: 'desc' },
      ],
      take: 12,
    });

    const formatted = recipes.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      cookTime: r.cookTime,
      difficulty: r.difficulty,
      image: r.images[0]?.url ?? null,
      author: r.author.displayName ?? r.author.username,
      likes: r._count.favorites,
      comments: r._count.comments + r._count.reviews,
      views: r.totalViews,
    }));

    return NextResponse.json({ recipes: formatted });
  } catch (error) {
    console.error('Trending recipes error:', error);
    return NextResponse.json({ recipes: [] });
  }
}
