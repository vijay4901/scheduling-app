'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

interface Booking {
  id: string;
  attendeeName: string;
  attendeeEmail: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  meetingUrl?: string;
  eventType: {
    name: string;
    duration: number;
    locationType?: string;
  };
  user: {
    name: string;
  };
}

export default function BookingConfirmedPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the booking details
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data.booking);
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Meeting Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-6">
          You're all set! A confirmation email has been sent to your inbox with the meeting details.
        </p>

        {booking?.meetingUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-900 mb-2">
              🎉 Your meeting link is ready!
            </p>
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline text-sm break-all font-medium"
            >
              {booking.meetingUrl}
            </a>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">📧 Check your email for:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Meeting details and time</li>
            {booking?.meetingUrl && <li>• Meeting link</li>}
            <li>• Calendar invite</li>
            <li>• Reschedule/cancel link</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

