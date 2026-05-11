import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { favoriteMeats, cookerType, skillLevel, bbqStyle } = await request.json();

  await prisma.user.update({
    where: { id: session.user.id as string },
    data: {
      favoriteMeats: favoriteMeats ?? [],
      cookerType: cookerType ?? null,
      skillLevel: skillLevel ?? null,
      bbqStyle: bbqStyle ?? null,
      onboardingDone: true,
    },
  });

  return NextResponse.json({ success: true });
}
