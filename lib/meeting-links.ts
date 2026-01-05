/**
 * Utility functions for generating meeting links
 */

interface MeetingLinkParams {
  bookingId: string;
  eventName: string;
  startTime: Date;
  duration: number;
  attendeeName: string;
  hostName: string;
}

/**
 * Generate a Google Meet link
 * Note: In production, you would integrate with Google Calendar API to create actual Meet links
 * For now, we'll generate a placeholder link
 */
export function generateGoogleMeetLink(params: MeetingLinkParams): string {
  // In production, this would be created via Google Calendar API when creating the event
  // The Google Calendar API automatically generates a Meet link when you create an event
  // For now, return a placeholder that indicates where the real link would be
  const meetCode = generateMeetCode(params.bookingId);
  return `https://meet.google.com/${meetCode}`;
}

/**
 * Generate a Zoom meeting link
 * Note: In production, you would integrate with Zoom API to create actual meetings
 */
export function generateZoomLink(params: MeetingLinkParams): string {
  // In production, this would use Zoom API to create a meeting
  // For now, return a placeholder
  const meetingId = generateZoomMeetingId(params.bookingId);
  return `https://zoom.us/j/${meetingId}`;
}

/**
 * Generate meeting link based on location type
 */
export function generateMeetingLink(
  locationType: string,
  locationUrl: string | null,
  params: MeetingLinkParams
): string | null {
  switch (locationType) {
    case 'google_meet':
      return generateGoogleMeetLink(params);
    
    case 'zoom':
      // If a custom Zoom URL is provided, use it
      if (locationUrl) {
        return locationUrl;
      }
      return generateZoomLink(params);
    
    case 'custom':
      // Use the provided custom URL
      return locationUrl;
    
    case 'phone':
    case 'in_person':
      // These don't need meeting URLs
      return null;
    
    default:
      return null;
  }
}

/**
 * Generate a Meet-style code from booking ID
 */
function generateMeetCode(bookingId: string): string {
  // Generate a 10-character code in xxx-xxxx-xxx format
  const hash = simpleHash(bookingId);
  const code = hash.substring(0, 10);
  return `${code.substring(0, 3)}-${code.substring(3, 7)}-${code.substring(7, 10)}`;
}

/**
 * Generate a Zoom-style meeting ID from booking ID
 */
function generateZoomMeetingId(bookingId: string): string {
  // Generate an 11-digit meeting ID
  const hash = simpleHash(bookingId);
  let meetingId = '';
  for (let i = 0; i < hash.length && meetingId.length < 11; i++) {
    const char = hash[i];
    if (/[0-9]/.test(char)) {
      meetingId += char;
    } else {
      meetingId += char.charCodeAt(0) % 10;
    }
  }
  return meetingId.padEnd(11, '0');
}

/**
 * Simple hash function for generating consistent IDs
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).padEnd(10, '0');
}

/**
 * Get location display text
 */
export function getLocationDisplay(
  locationType: string,
  locationUrl: string | null,
  meetingUrl: string | null
): string {
  switch (locationType) {
    case 'google_meet':
      return 'Google Meet';
    case 'zoom':
      return 'Zoom';
    case 'phone':
      return 'Phone Call';
    case 'in_person':
      return 'In Person';
    case 'custom':
      return 'Custom Location';
    default:
      return 'Online Meeting';
  }
}

/**
 * Get location icon emoji
 */
export function getLocationIcon(locationType: string): string {
  switch (locationType) {
    case 'google_meet':
      return '📹';
    case 'zoom':
      return '💻';
    case 'phone':
      return '📞';
    case 'in_person':
      return '📍';
    case 'custom':
      return '🔗';
    default:
      return '🌐';
  }
}


