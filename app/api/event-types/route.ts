import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventTypeSchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/middleware';
import { generateSlug } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventTypes = await prisma.eventType.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ eventTypes });
  } catch (error) {
    console.error('Get event types error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = generateSlug(body.name);
    }

    const validatedData = eventTypeSchema.parse(body);

    // Check if slug already exists for this user
    const existingEventType = await prisma.eventType.findUnique({
      where: {
        userId_slug: {
          userId: user.userId,
          slug: validatedData.slug,
        },
      },
    });

    if (existingEventType) {
      return NextResponse.json(
        { error: 'An event type with this URL slug already exists' },
        { status: 400 }
      );
    }

    const eventType = await prisma.eventType.create({
      data: {
        userId: user.userId,
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        duration: validatedData.duration,
        color: validatedData.color,
        locationType: validatedData.locationType || 'google_meet',
        locationUrl: validatedData.locationUrl || null,
      },
    });

    return NextResponse.json({ eventType }, { status: 201 });
  } catch (error: any) {
    console.error('Create event type error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create event type' },
      { status: 500 }
    );
  }
}

