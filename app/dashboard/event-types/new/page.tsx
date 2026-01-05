'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/auth';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];
const LOCATION_OPTIONS = [
  { value: 'google_meet', label: 'Google Meet', icon: '📹' },
  { value: 'zoom', label: 'Zoom', icon: '💻' },
  { value: 'phone', label: 'Phone Call', icon: '📞' },
  { value: 'in_person', label: 'In Person', icon: '📍' },
  { value: 'custom', label: 'Custom Link', icon: '🔗' },
];

export default function NewEventTypePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    duration: 30,
    color: '#3B82F6',
    locationType: 'google_meet',
    locationUrl: '',
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    if (autoSlug) {
      setFormData({ ...formData, name, slug: generateSlug(name) });
    }
  };

  const handleSlugChange = (slug: string) => {
    setAutoSlug(false);
    setFormData({ ...formData, slug: slug.toLowerCase() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/event-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event type');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Create Event Type</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30 Minute Meeting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">
                  yourapp.com/username/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30-min-meeting"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of what this meeting is about..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DURATION_OPTIONS.map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration })}
                    className={`p-3 rounded-md border-2 transition ${
                      formData.duration === duration
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-2 transition ${
                      formData.color === color
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LOCATION_OPTIONS.map(location => (
                  <button
                    key={location.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: location.value })}
                    className={`p-3 rounded-md border-2 transition text-left ${
                      formData.locationType === location.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg mr-2">{location.icon}</span>
                    {location.label}
                  </button>
                ))}
              </div>
            </div>

            {(formData.locationType === 'zoom' || formData.locationType === 'custom') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.locationType === 'zoom' ? 'Zoom Link (Optional)' : 'Custom Meeting Link'}
                </label>
                <input
                  type="url"
                  value={formData.locationUrl}
                  onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    formData.locationType === 'zoom'
                      ? 'https://zoom.us/j/1234567890 (leave empty to auto-generate)'
                      : 'https://your-meeting-link.com'
                  }
                  required={formData.locationType === 'custom'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.locationType === 'zoom'
                    ? 'Provide your personal Zoom link or leave empty to generate a meeting ID'
                    : 'Enter the URL where the meeting will take place'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Event Type'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

