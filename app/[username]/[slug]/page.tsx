'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';

interface User {
  id: string;
  name: string;
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
  locationType?: string;
  locationUrl?: string | null;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const slug = params.slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventType();
  }, [username, slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      fetchAvailableSlots();
    }
  }, [selectedDate, eventType]);

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isPast = day < new Date() && !isSameDay(day, new Date());

        days.push(
          <button
            key={day.toString()}
            onClick={() => {
              if (!isPast && isCurrentMonth) {
                setSelectedDate(cloneDay);
                setSelectedSlot('');
                setShowForm(false);
              }
            }}
            disabled={isPast || !isCurrentMonth}
            className={`
              h-12 rounded-lg text-sm font-medium transition-all
              ${!isCurrentMonth ? 'text-gray-700 cursor-default' : ''}
              ${isPast && isCurrentMonth ? 'text-gray-600 cursor-not-allowed opacity-50' : ''}
              ${isSelected ? 'bg-white text-gray-900 shadow-md' : ''}
              ${!isSelected && !isPast && isCurrentMonth ? 'hover:bg-gray-800 text-gray-300' : ''}
              ${isToday && !isSelected ? 'text-blue-400 font-bold' : ''}
              ${!isCurrentMonth || isPast ? '' : 'cursor-pointer'}
            `}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2">{rows}</div>;
  };

  const fetchEventType = async () => {
    try {
      const response = await fetch(`/api/users/${username}/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load event');
      }

      setUser(data.user);
      setEventType(data.eventType);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(
        `/api/availability/slots?date=${dateStr}&eventTypeId=${eventType?.id}&timezone=${timezone}`
      );
      const data = await response.json();

      if (response.ok) {
        setAvailableSlots(data.slots);
      }
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId: eventType?.id,
          attendeeName: formData.name,
          attendeeEmail: formData.email,
          attendeeNotes: formData.notes,
          startTime: selectedSlot,
          timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to confirmation page
      router.push(`/booking/${data.booking.id}/confirmed`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !user || !eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-400">{error || 'This event does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="max-w-md mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-400">{user.name}</p>
              <h1 className="text-xl font-semibold">{eventType.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{eventType.duration}m</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Cal Video</span>
            </div>
          </div>
          {eventType.locationType && (
            <div className="mt-2 text-sm text-gray-400">
              📍 {timezone.replace(/_/g, ' ')}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Calendar Section */}
          <div className="bg-gray-900 rounded-xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            {renderCalendar()}
          </div>

          {/* Time Slots Section */}
          <div>
            {selectedDate && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    {format(selectedDate, 'EEE dd')}
                  </h3>
                  <div className="flex gap-2 bg-gray-900 rounded-lg p-1">
                    <button
                      onClick={() => setTimeFormat('12h')}
                      className={`px-3 py-1 text-xs rounded transition ${
                        timeFormat === '12h' ? 'bg-gray-800 text-white' : 'text-gray-400'
                      }`}
                    >
                      12h
                    </button>
                    <button
                      onClick={() => setTimeFormat('24h')}
                      className={`px-3 py-1 text-xs rounded transition ${
                        timeFormat === '24h' ? 'bg-gray-800 text-white' : 'text-gray-400'
                      }`}
                    >
                      24h
                    </button>
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="text-center py-8 text-gray-500">Loading times...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No times available</div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className={`w-full px-4 py-3 rounded-lg text-left transition flex items-center gap-2 ${
                          selectedSlot === slot
                            ? 'bg-white text-black'
                            : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${selectedSlot === slot ? 'bg-green-500' : 'bg-green-500'}`} />
                        <span className="font-medium">
                          {timeFormat === '12h' 
                            ? format(parseISO(slot), 'h:mm a')
                            : format(parseISO(slot), 'HH:mm')
                          }
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedDate && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Select a date to see available times</p>
              </div>
            )}

            {/* Booking Form */}
            {showForm && selectedSlot && (
              <div className="mt-6 bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Enter Details</h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 text-red-200 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700 text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700 text-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700 text-white resize-none"
                      placeholder="Any additional information..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        Powered by Cal.com
      </div>
    </div>
  );
}

