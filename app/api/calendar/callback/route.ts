import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokensFromCode } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // userId
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/calendar?error=${error}`
      );
    }

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing authorization code or state' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain tokens');
    }

    // Save calendar connection
    await prisma.calendarConnection.upsert({
      where: {
        userId_provider: {
          userId: state,
          provider: 'google',
        } as any,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      create: {
        userId: state,
        provider: 'google',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token!,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        isPrimary: true,
      },
    });

    // Redirect back to dashboard
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/calendar?success=true`
    );
  } catch (error) {
    console.error('Calendar callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/calendar?error=connection_failed`
    );
  }
}



