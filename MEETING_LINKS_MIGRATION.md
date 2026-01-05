# Meeting Links Feature - Database Migration Instructions

## Overview
This migration adds meeting link functionality (Google Meet, Zoom, etc.) to the booking system.

## Database Changes

### New Columns in `event_types` table:
- `location_type` (TEXT, default: 'google_meet') - Type of meeting location
  - Options: 'google_meet', 'zoom', 'phone', 'in_person', 'custom'
- `location_url` (TEXT, nullable) - Custom meeting URL (for Zoom or custom links)

### New Column in `bookings` table:
- `meeting_url` (TEXT, nullable) - Generated meeting link for the booking

## Running the Migration

### Option 1: Using Prisma Migrate (Recommended)
If you have a DATABASE_URL configured in your .env file:

```bash
npx prisma migrate deploy
```

### Option 2: Manual SQL Migration
If you need to apply the migration manually, run this SQL:

```sql
-- Add location type and URL to event types
ALTER TABLE "event_types" ADD COLUMN IF NOT EXISTS "location_type" TEXT NOT NULL DEFAULT 'google_meet';
ALTER TABLE "event_types" ADD COLUMN IF NOT EXISTS "location_url" TEXT;

-- Add meeting URL to bookings
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "meeting_url" TEXT;
```

### Option 3: Reset and Recreate (Development Only)
If you're in development and can reset your database:

```bash
npx prisma migrate reset
npx prisma migrate dev
```

## Regenerate Prisma Client

After running the migration, regenerate the Prisma client:

```bash
npx prisma generate
```

## Features Added

1. **Event Type Configuration**
   - Choose meeting location type (Google Meet, Zoom, Phone, In Person, Custom)
   - Optional custom URL for Zoom or custom meeting platforms
   - Location type displayed on booking pages

2. **Automatic Meeting Link Generation**
   - When a booking is created, a meeting link is automatically generated
   - Google Meet: Generates meet.google.com links
   - Zoom: Can use custom Zoom link or generate meeting ID
   - Custom: Uses provided custom URL

3. **Meeting Link Display**
   - Dashboard shows meeting links for all bookings
   - Confirmation page displays meeting link after booking
   - Links are clickable and open in new tab

## Files Modified

- `prisma/schema.prisma` - Updated database schema
- `lib/validations.ts` - Added location validation
- `lib/meeting-links.ts` - New utility for generating meeting links
- `app/api/event-types/route.ts` - Handle location fields on creation
- `app/api/event-types/[id]/route.ts` - Handle location fields on update
- `app/api/bookings/route.ts` - Generate meeting links on booking creation
- `app/api/bookings/[id]/route.ts` - New endpoint to fetch single booking
- `app/dashboard/event-types/new/page.tsx` - Added location selection UI
- `app/dashboard/page.tsx` - Display meeting links in bookings list
- `app/booking/[id]/confirmed/page.tsx` - Show meeting link on confirmation
- `app/[username]/[slug]/page.tsx` - Display location type on booking page

## Notes

- The meeting link generation is currently using placeholder links
- For production, integrate with actual Google Meet API and Zoom API
- Google Meet links are automatically created when adding events to Google Calendar
- Zoom links require Zoom OAuth and API integration for real meeting creation


