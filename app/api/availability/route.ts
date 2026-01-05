import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { availabilitySchema } from '@/lib/validations';
import { getUserFromRequest } from '@/lib/middleware';
import { z } from 'zod';

type AvailabilityRule = z.infer<typeof availabilitySchema>;

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const availability = await prisma.availability.findMany({
      where: { userId: user.userId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
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
    
    // Expect an array of availability rules
    if (!Array.isArray(body.availability)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array of availability rules.' },
        { status: 400 }
      );
    }

    // Validate each availability rule
    const validatedRules = body.availability.map((rule: any) => 
      availabilitySchema.parse(rule)
    );

    // Delete existing availability rules
    await prisma.availability.deleteMany({
      where: { userId: user.userId },
    });

    // Create new availability rules
    const availability = await prisma.availability.createMany({
      data: validatedRules.map((rule: AvailabilityRule) => ({
        userId: user.userId,
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
        timezone: rule.timezone,
      })),
    });

    // Fetch and return the created rules
    const createdRules = await prisma.availability.findMany({
      where: { userId: user.userId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({ availability: createdRules });
  } catch (error: any) {
    console.error('Set availability error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to set availability' },
      { status: 500 }
    );
  }
}


