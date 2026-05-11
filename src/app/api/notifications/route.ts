import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { id } = body;

  if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id as string },
      data: { read: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: session.user.id as string, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
