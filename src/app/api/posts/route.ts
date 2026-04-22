import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/posts - list all forum posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (filter === 'questions') where.type = 'QUESTION';
    else if (filter === 'discussions') where.type = 'DISCUSSION';
    else if (filter !== 'all') where.category = filter;

    const orderBy: Record<string, string> =
      sortBy === 'popular' ? { votes: 'desc' }
      : sortBy === 'oldest' ? { createdAt: 'asc' }
      : { createdAt: 'desc' };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, username: true, image: true } },
          _count: { select: { comments: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const formatted = posts.map(p => ({
      ...p,
      replies: p._count.comments,
      answers: p._count.comments,
    }));

    return NextResponse.json({ posts: formatted, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - create a forum post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, problem, details, category, tags, type, urgency } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        problem: problem?.trim() || null,
        details: details?.trim() || null,
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        type: type === 'QUESTION' ? 'QUESTION' : 'DISCUSSION',
        urgency: urgency ? urgency.toUpperCase() : null,
        authorId: session.user.id as string,
      },
      include: {
        author: { select: { id: true, username: true, image: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
