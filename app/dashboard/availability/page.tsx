'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface TimeRange {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export default function AvailabilityPage() {
  const router = useRouter();
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [availability, setAvailability] = useState<TimeRange[]>(
    DAYS.map((_, index) => ({
      dayOfWeek: index,
      startTime: '09:00',
      endTime: '17:00',
      enabled: index >= 1 && index <= 5, // Mon-Fri by default
    }))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggleDay = (index: number) => {
    const newAvailability = [...availability];
    newAvailability[index].enabled = !newAvailability[index].enabled;
    setAvailability(newAvailability);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const enabledAvailability = availability
        .filter(a => a.enabled)
        .map(a => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          timezone,
        }));

      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ availability: enabledAvailability }),
      });

      if (!response.ok) {
        throw new Error('Failed to save availability');
      }

      setMessage('Availability saved successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      setMessage('Failed to save availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Set Your Availability</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <input
              type="text"
              value={timezone}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          <div className="space-y-4">
            {availability.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={() => handleToggleDay(index)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {DAYS[index]}
                    </span>
                  </label>
                </div>

                {day.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            ))}
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-md ${
              message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}



