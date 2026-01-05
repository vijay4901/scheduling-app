import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/middleware';
import { addMinutes, parseISO } from 'date-fns';
import { generateMeetingLink } from '@/lib/meeting-links';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = { userId: user.userId };
    if (status) {
      whereClause.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        eventType: {
          select: {
            name: true,
            duration: true,
            color: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Get event type
    const eventType = await prisma.eventType.findUnique({
      where: { id: validatedData.eventTypeId },
      include: { user: true },
    });

    if (!eventType || !eventType.isActive) {
      return NextResponse.json(
        { error: 'Event type not found or inactive' },
        { status: 404 }
      );
    }

    const startTime = parseISO(validatedData.startTime);
    const endTime = addMinutes(startTime, eventType.duration);

    // Generate meeting link based on event type location
    const meetingUrl = generateMeetingLink(
      eventType.locationType || 'google_meet',
      eventType.locationUrl || null,
      {
        bookingId: '', // Will be set after creation
        eventName: eventType.name,
        startTime,
        duration: eventType.duration,
        attendeeName: validatedData.attendeeName,
        hostName: eventType.user.name,
      }
    );

    // Check if slot is still available
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        userId: eventType.userId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        eventTypeId: validatedData.eventTypeId,
        userId: eventType.userId,
        attendeeName: validatedData.attendeeName,
        attendeeEmail: validatedData.attendeeEmail,
        attendeeNotes: validatedData.attendeeNotes,
        startTime,
        endTime,
        timezone: validatedData.timezone,
        status: 'confirmed',
        meetingUrl,
      },
      include: {
        eventType: true,
        user: true,
      },
    });

    // TODO: Send email notifications
    // TODO: Create Google Calendar event

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

