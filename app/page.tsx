import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Scheduling Made Simple
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Let anyone book time with you through a simple link, without the back-and-forth emails.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Share your link and let others pick a time that works for both of you.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold mb-2">Calendar Sync</h3>
            <p className="text-gray-600">
              Automatically sync with Google Calendar to prevent double-booking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="text-lg font-semibold mb-2">Smart Notifications</h3>
            <p className="text-gray-600">
              Get instant email confirmations and reminders for all your meetings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



