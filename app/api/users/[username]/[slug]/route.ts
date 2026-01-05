import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  try {
    const { username, slug } = await params;
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        name: true,
        username: true,
        timezone: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const eventType = await prisma.eventType.findFirst({
      where: {
        userId: user.id,
        slug: slug,
        isActive: true,
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, eventType });
  } catch (error) {
    console.error('Get event type error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event type' },
      { status: 500 }
    );
  }
}


