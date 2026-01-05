'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  username: string;
  timezone: string;
  avatarUrl: string | null;
}

interface EventType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  color: string;
}

export default function UserBookingPage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load profile');
      }

      setUser(data.user);
      setEventTypes(data.eventTypes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This user does not exist.'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* User Profile */}
        <div className="text-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-600">Book a meeting with me</p>
        </div>

        {/* Event Types */}
        {eventTypes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No event types available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventTypes.map(eventType => (
              <Link
                key={eventType.id}
                href={`/${username}/${eventType.slug}`}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-1 h-16 rounded"
                    style={{ backgroundColor: eventType.color }}
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {eventType.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      ⏱️ {eventType.duration} minutes
                    </p>
                    {eventType.description && (
                      <p className="text-gray-600 text-sm">{eventType.description}</p>
                    )}
                  </div>
                  <div className="text-blue-600">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


