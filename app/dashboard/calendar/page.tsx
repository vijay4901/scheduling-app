'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkConnection();

    // Check for OAuth callback messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      setMessage('Google Calendar connected successfully!');
    } else if (error) {
      setMessage(`Failed to connect: ${error}`);
    }
  }, [searchParams]);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // In a real app, we'd check if calendar is connected via API
      // For now, just check if there's a success param
      setConnected(!!searchParams.get('success'));
    } catch (error) {
      console.error('Failed to check connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Redirect to OAuth flow
    window.location.href = '/api/calendar/connect';
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
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Calendar Integration</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {connected ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Google Calendar Connected</h2>
                  <p className="text-sm text-gray-600">Your calendar is synced and ready to use</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What's synced:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Check for conflicts before accepting bookings</li>
                  <li>✓ Automatically create events for new bookings</li>
                  <li>✓ Send calendar invites to attendees</li>
                  <li>✓ Update or delete events when bookings change</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Connect Your Google Calendar
              </h2>
              
              <p className="text-gray-600 mb-6">
                Sync your calendar to prevent double-booking and automatically create events for your meetings.
              </p>

              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                    <p className="text-sm text-gray-600">
                      We only read availability and create events. Your calendar data stays private.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
                    <p className="text-sm text-gray-600">
                      Instantly checks for conflicts when someone tries to book with you.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Automatic Events</h3>
                    <p className="text-sm text-gray-600">
                      New bookings are automatically added to your calendar with all details.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConnect}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect Google Calendar
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                By connecting, you agree to grant us access to read and manage your calendar events
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}


