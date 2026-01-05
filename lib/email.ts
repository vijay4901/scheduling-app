import { format } from 'date-fns';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

interface BookingConfirmationData {
  attendeeName: string;
  attendeeEmail: string;
  hostName: string;
  eventName: string;
  startTime: Date;
  duration: number;
  timezone: string;
  notes?: string;
  bookingId: string;
}

interface HostNotificationData {
  hostName: string;
  hostEmail: string;
  attendeeName: string;
  attendeeEmail: string;
  eventName: string;
  startTime: Date;
  duration: number;
  timezone: string;
  notes?: string;
  bookingId: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const formattedDate = format(data.startTime, "EEEE, MMMM d 'at' h:mm a");
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Meeting Confirmed with ${data.hostName}</h2>
      
      <p>Hi ${data.attendeeName},</p>
      
      <p>Your meeting with ${data.hostName} is confirmed!</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📅 ${data.eventName}</strong></p>
        <p style="margin: 5px 0;">🕐 ${formattedDate} (${data.timezone})</p>
        <p style="margin: 5px 0;">⏱️ ${data.duration} minutes</p>
      </div>
      
      ${data.notes ? `
        <div style="margin: 20px 0;">
          <p><strong>Your notes:</strong></p>
          <p style="color: #6b7280;">${data.notes}</p>
        </div>
      ` : ''}
      
      <p>Need to reschedule or cancel?</p>
      <a href="${APP_URL}/booking/${data.bookingId}/cancel" 
         style="display: inline-block; background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px 10px 0;">
        Cancel Booking
      </a>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Looking forward to meeting you!<br/>
        ${data.hostName}
      </p>
    </div>
  `;

  return sendEmail({
    to: data.attendeeEmail,
    subject: `Meeting confirmed with ${data.hostName}`,
    html,
  });
}

export async function sendHostNotification(data: HostNotificationData) {
  const formattedDate = format(data.startTime, "EEEE, MMMM d 'at' h:mm a");
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Booking: ${data.eventName}</h2>
      
      <p>Hi ${data.hostName},</p>
      
      <p>You have a new booking!</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>👤 ${data.attendeeName}</strong></p>
        <p style="margin: 5px 0;">📧 ${data.attendeeEmail}</p>
        <p style="margin: 5px 0;">📅 ${data.eventName}</p>
        <p style="margin: 5px 0;">🕐 ${formattedDate} (${data.timezone})</p>
        <p style="margin: 5px 0;">⏱️ ${data.duration} minutes</p>
      </div>
      
      ${data.notes ? `
        <div style="margin: 20px 0;">
          <p><strong>Attendee's notes:</strong></p>
          <p style="color: #6b7280;">${data.notes}</p>
        </div>
      ` : ''}
      
      <a href="${APP_URL}/dashboard" 
         style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
        View in Dashboard
      </a>
    </div>
  `;

  return sendEmail({
    to: data.hostEmail,
    subject: `New booking: ${data.eventName} with ${data.attendeeName}`,
    html,
  });
}

export async function sendCancellationEmail(
  to: string,
  recipientName: string,
  eventName: string,
  startTime: Date,
  reason?: string
) {
  const formattedDate = format(startTime, "EEEE, MMMM d 'at' h:mm a");
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Meeting Cancelled</h2>
      
      <p>Hi ${recipientName},</p>
      
      <p>The following meeting has been cancelled:</p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 5px 0;"><strong>📅 ${eventName}</strong></p>
        <p style="margin: 5px 0;">🕐 ${formattedDate}</p>
      </div>
      
      ${reason ? `
        <div style="margin: 20px 0;">
          <p><strong>Reason:</strong></p>
          <p style="color: #6b7280;">${reason}</p>
        </div>
      ` : ''}
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        If you have any questions, please reach out directly.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Meeting cancelled: ${eventName}`,
    html,
  });
}

async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email would be sent:', params.subject);
    return { success: true, message: 'Email skipped (API key not configured)' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}


