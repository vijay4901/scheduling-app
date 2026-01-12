import { format, parse, addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

export function formatTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'HH:mm');
}

export function formatDateTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "EEE, MMM d 'at' h:mm a");
}

export function parseTimeString(timeStr: string, date: Date, timezone: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const zonedDate = toZonedTime(date, timezone);
  zonedDate.setHours(hours, minutes, 0, 0);
  return fromZonedTime(zonedDate, timezone);
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  date: Date,
  timezone: string
): Date[] {
  const slots: Date[] = [];
  const start = parseTimeString(startTime, date, timezone);
  const end = parseTimeString(endTime, date, timezone);

  let current = start;
  while (current < end) {
    const slotEnd = addMinutes(current, duration);
    if (slotEnd <= end) {
      slots.push(current);
    }
    current = addMinutes(current, duration);
  }

  return slots;
}

export function isSlotBusy(
  slotStart: Date,
  slotEnd: Date,
  busyTimes: { start: Date; end: Date }[]
): boolean {
  return busyTimes.some(busy =>
    isWithinInterval(slotStart, { start: busy.start, end: busy.end }) ||
    isWithinInterval(slotEnd, { start: busy.start, end: busy.end }) ||
    (slotStart <= busy.start && slotEnd >= busy.end)
  );
}

export function convertToUTC(date: Date, timezone: string): Date {
  return fromZonedTime(date, timezone);
}

export function convertFromUTC(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone);
}



