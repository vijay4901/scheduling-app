import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventTypeSchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const eventType = await prisma.eventType.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ eventType });
  } catch (error) {
    console.error('Get event type error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event type' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = eventTypeSchema.parse(body);
    const { id } = await params;

    // Check if event type belongs to user
    const existingEventType = await prisma.eventType.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!existingEventType) {
      return NextResponse.json(
        { error: 'Event type not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with another event type
    if (validatedData.slug !== existingEventType.slug) {
      const conflictingEventType = await prisma.eventType.findFirst({
        where: {
          userId: user.userId,
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (conflictingEventType) {
        return NextResponse.json(
          { error: 'An event type with this URL slug already exists' },
          { status: 400 }
        );
      }
    }

    const eventType = await prisma.eventType.update({
      where: { id: id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        duration: validatedData.duration,
        color: validatedData.color,
        locationType: validatedData.locationType || 'google_meet',
        locationUrl: validatedData.locationUrl || null,
      },
    });

    return NextResponse.json({ eventType });
  } catch (error: any) {
    console.error('Update event type error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update event type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Check if event type belongs to user
    const eventType = await prisma.eventType.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type not found' },
        { status: 404 }
      );
    }

    await prisma.eventType.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    console.error('Delete event type error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event type' },
      { status: 500 }
    );
  }
}

