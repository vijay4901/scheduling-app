import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware';

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
    const { reason } = body;
    const { id } = await params;

    // Check if booking belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status: 'cancelled',
        cancellationReason: reason,
      },
      include: {
        eventType: true,
      },
    });

    // TODO: Send cancellation email
    // TODO: Delete Google Calendar event

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}


