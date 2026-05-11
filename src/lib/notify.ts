import { prisma } from '@/lib/prisma';

interface NotifyParams {
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'reply' | 'save' | 'competition';
  message: string;
  link?: string;
  actorName?: string;
  actorImage?: string;
}

export async function createNotification(params: NotifyParams) {
  try {
    await prisma.notification.create({ data: params });
  } catch {
    // Non-critical — never throw from notification creation
  }
}
