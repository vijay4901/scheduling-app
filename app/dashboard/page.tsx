'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  timezone: string;
}

interface EventType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
  isActive: boolean;
}

interface Booking {
  id: string;
  attendeeName: string;
  attendeeEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingUrl?: string;
  eventType: {
    name: string;
    duration: number;
    locationType?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      // Fetch event types
      const eventTypesRes = await fetch('/api/event-types', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eventTypesRes.ok) {
        const data = await eventTypesRes.json();
        setEventTypes(data.eventTypes);
      }

      // Fetch bookings
      const bookingsRes = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const copyBookingLink = (slug: string) => {
    const link = `${window.location.origin}/${user?.username}/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Booking link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Event Types</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{eventTypes.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Upcoming Bookings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {bookings.filter(b => new Date(b.startTime) > new Date()).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Your Booking Page</h3>
            <Link
              href={`/${user?.username}`}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
            >
              /{user?.username}
            </Link>
          </div>
        </div>

        {/* Event Types */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Event Types</h2>
            <Link
              href="/dashboard/event-types/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Create Event Type
            </Link>
          </div>
          <div className="p-6">
            {eventTypes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No event types yet. Create your first one to start receiving bookings!
              </p>
            ) : (
              <div className="space-y-4">
                {eventTypes.map(eventType => (
                  <div
                    key={eventType.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded mt-1"
                          style={{ backgroundColor: eventType.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{eventType.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{eventType.duration} minutes</p>
                          {eventType.description && (
                            <p className="text-sm text-gray-500 mt-1">{eventType.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyBookingLink(eventType.slug)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Copy Link
                        </button>
                        <Link
                          href={`/dashboard/event-types/${eventType.id}`}
                          className="text-sm text-gray-600 hover:text-gray-700"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          </div>
          <div className="p-6">
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map(booking => {
                    const startTime = new Date(booking.startTime);
                    const isUpcoming = startTime > new Date();
                    
                    return (
                      <div
                        key={booking.id}
                        className={`border rounded-lg p-4 ${
                          booking.status === 'cancelled'
                            ? 'border-red-200 bg-red-50'
                            : isUpcoming
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {booking.eventType.name}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  booking.status === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : isUpcoming
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {booking.status === 'cancelled'
                                  ? 'Cancelled'
                                  : isUpcoming
                                  ? 'Upcoming'
                                  : 'Past'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>Attendee:</strong> {booking.attendeeName} ({booking.attendeeEmail})
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Time:</strong>{' '}
                              {startTime.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              at{' '}
                              {startTime.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Duration:</strong> {booking.eventType.duration} minutes
                            </p>
                            {booking.meetingUrl && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                  <strong>Meeting Link:</strong>
                                </p>
                                <a
                                  href={booking.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                                >
                                  {booking.meetingUrl}
                                </a>
                              </div>
                            )}
                          </div>
                          {isUpcoming && booking.status === 'confirmed' && (
                            <Link
                              href={`/booking/${booking.id}/cancel`}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Cancel
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Settings Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/availability"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">⏰ Availability</h3>
            <p className="text-sm text-gray-600">Set your weekly working hours</p>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900 mb-2">📅 Calendar Integration</h3>
            <p className="text-sm text-gray-600">Connect your Google Calendar</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

