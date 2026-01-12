import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, addMinutes, parseISO, getDay } from 'date-fns';
import { generateTimeSlots, isSlotBusy, parseTimeString } from '@/lib/time-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // YYYY-MM-DD
    const eventTypeId = searchParams.get('eventTypeId');
    const timezone = searchParams.get('timezone') || 'UTC';

    if (!date || !eventTypeId) {
      return NextResponse.json(
        { error: 'Missing required parameters: date and eventTypeId' },
        { status: 400 }
      );
    }

    // Get event type
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: { user: true },
    });

    if (!eventType || !eventType.isActive) {
      return NextResponse.json(
        { error: 'Event type not found or inactive' },
        { status: 404 }
      );
    }

    const dateObj = parseISO(date);
    const dayOfWeek = getDay(dateObj);

    // Check for date overrides first
    const dateOverride = await prisma.dateOverride.findFirst({
      where: {
        userId: eventType.userId,
        date: startOfDay(dateObj),
      },
    });

    if (dateOverride && !dateOverride.isAvailable) {
      return NextResponse.json({ slots: [] }); // No slots available
    }

    // Get availability rules for this day
    let availabilityRules;
    if (dateOverride && dateOverride.startTime && dateOverride.endTime) {
      // Use override times
      availabilityRules = [{
        startTime: dateOverride.startTime,
        endTime: dateOverride.endTime,
      }];
    } else {
      // Use regular availability
      availabilityRules = await prisma.availability.findMany({
        where: {
          userId: eventType.userId,
          dayOfWeek: dayOfWeek,
        },
      });
    }

    if (availabilityRules.length === 0) {
      return NextResponse.json({ slots: [] }); // No availability set for this day
    }

    // Get existing bookings for this day
    const startOfDayDate = startOfDay(dateObj);
    const endOfDayDate = new Date(startOfDayDate);
    endOfDayDate.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: eventType.userId,
        status: 'confirmed',
        startTime: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
    });

    // Convert bookings to busy times
    const busyTimes = bookings.map(booking => ({
      start: booking.startTime,
      end: booking.endTime,
    }));

    // Generate available slots
    let allSlots: Date[] = [];
    
    for (const rule of availabilityRules) {
      const slots = generateTimeSlots(
        rule.startTime,
        rule.endTime,
        eventType.duration,
        dateObj,
        timezone
      );
      allSlots = [...allSlots, ...slots];
    }

    // Filter out busy slots
    const availableSlots = allSlots.filter(slot => {
      const slotEnd = addMinutes(slot, eventType.duration);
      return !isSlotBusy(slot, slotEnd, busyTimes);
    });

    // Filter out past slots (only for today)
    const now = new Date();
    const futureSlots = availableSlots.filter(slot => slot > now);

    return NextResponse.json({ 
      slots: futureSlots.map(slot => slot.toISOString()),
      timezone,
    });
  } catch (error) {
    console.error('Get slots error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}



