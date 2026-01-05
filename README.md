# Scheduling MVP - Calendly Clone

A full-featured scheduling application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. This MVP allows users to create bookable time slots and let others schedule meetings without the back-and-forth emails.

## 🚀 Features

### ✅ Completed Features

- **User Authentication**
  - Email/password signup and login
  - JWT-based authentication
  - Secure password hashing with bcrypt

- **Event Type Management**
  - Create, edit, and delete event types
  - Customizable duration (15-120 minutes)
  - Event descriptions and colors
  - URL-friendly slugs

- **Availability Settings**
  - Define weekly working hours
  - Timezone-aware scheduling
  - Day-specific availability

- **Public Booking Pages**
  - Clean, minimal booking interface
  - Calendar date picker
  - Available time slot display
  - Mobile-responsive design

- **Booking Management**
  - Create and confirm bookings
  - View upcoming bookings
  - Cancel bookings with reason
  - Conflict prevention

- **Email Notifications**
  - Booking confirmation emails
  - Host notification emails
  - Cancellation notifications
  - Email templates with Resend

- **Google Calendar Integration**
  - OAuth2 authentication
  - Read calendar for availability
  - Auto-create calendar events
  - Sync booking details

- **Dashboard**
  - Overview with quick stats
  - Event type management
  - Booking list
  - Settings access

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Email**: Resend API
- **Calendar**: Google Calendar API
- **Date Handling**: date-fns, date-fns-tz

## 📦 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google Cloud Console project (for Calendar API)
- Resend account (for emails)

### Setup Steps

1. **Install dependencies**

```bash
npm install
```

2. **Setup environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scheduling_mvp"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Email service (Resend)
RESEND_API_KEY="re_your_api_key"
FROM_EMAIL="noreply@yourdomain.com"

# Google Calendar API
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App configuration
APP_URL="http://localhost:3000"
```

3. **Setup PostgreSQL Database**

```bash
# Create database
createdb scheduling_mvp

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

4. **Setup Google Calendar API**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/calendar/callback`
   - Copy Client ID and Client Secret to `.env`

5. **Setup Resend for Emails**

   - Sign up at [Resend](https://resend.com/)
   - Get your API key
   - Add to `.env` file

6. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
.
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── bookings/     # Booking management
│   │   ├── event-types/  # Event type CRUD
│   │   ├── availability/ # Availability & slots
│   │   ├── calendar/     # Google Calendar OAuth
│   │   └── users/        # Public user profiles
│   ├── dashboard/        # Protected dashboard pages
│   ├── [username]/       # Public booking pages
│   ├── booking/          # Booking confirmation/cancel
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── page.tsx          # Landing page
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth utilities
│   ├── validations.ts    # Zod schemas
│   ├── time-utils.ts     # Date/time helpers
│   ├── email.ts          # Email templates
│   ├── google-calendar.ts # Google Calendar API
│   └── middleware.ts     # Auth middleware
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Event Types
- `GET /api/event-types` - List event types
- `POST /api/event-types` - Create event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type

### Availability
- `GET /api/availability` - Get availability rules
- `POST /api/availability` - Set availability
- `GET /api/availability/slots` - Get available slots

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Calendar
- `GET /api/calendar/connect` - Initiate Google OAuth
- `GET /api/calendar/callback` - OAuth callback

## 🎨 User Flows

### 1. Host Setup Flow
1. Sign up → Email & Password
2. Create username (yourapp.com/username)
3. Set availability (weekly hours)
4. Create event types (30-min call, etc.)
5. Connect Google Calendar (optional)
6. Share booking link

### 2. Attendee Booking Flow
1. Visit booking link (yourapp.com/john/30-min)
2. Select date
3. Choose time slot
4. Enter name, email, notes
5. Confirm booking
6. Receive email confirmation

### 3. Host Management
1. View upcoming bookings in dashboard
2. Cancel/manage bookings
3. Update event types
4. Adjust availability

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts
- **event_types** - Bookable event types
- **availability** - Weekly availability rules
- **date_overrides** - Special dates (holidays, etc.)
- **bookings** - Scheduled meetings
- **calendar_connections** - Google Calendar OAuth tokens

See `prisma/schema.prisma` for full schema.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention via Prisma
- Input validation with Zod
- Environment variable protection
- HTTPS recommended for production

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update these values:

```env
DATABASE_URL="postgresql://..."  # Use Neon, Supabase, or Railway
NEXTAUTH_SECRET="strong-random-secret"
NEXTAUTH_URL="https://yourdomain.com"
APP_URL="https://yourdomain.com"
```

### Database Hosting Options

- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL + extras
- [Railway](https://railway.app) - Full hosting

## 📧 Email Configuration

The app uses Resend for transactional emails. Email templates include:

- Booking confirmation (to attendee)
- Booking notification (to host)
- Cancellation notification
- Meeting reminders (TODO)

If `RESEND_API_KEY` is not set, emails will be logged to console instead.

## 📅 Google Calendar Integration

Features:
- Check availability to prevent double-booking
- Auto-create calendar events with details
- Send calendar invites to attendees
- Update events on reschedule
- Delete events on cancellation

Setup requires OAuth 2.0 credentials from Google Cloud Console.

## 🐛 Known Limitations (MVP)

- No recurring meetings
- No team scheduling
- No payment integration
- No custom domains
- No SMS notifications
- Single calendar support only
- No webhook support
- No video call integration (Zoom, Meet)

## 🔮 Future Enhancements

- [ ] Recurring availability exceptions
- [ ] Buffer time between meetings
- [ ] Multiple calendar support
- [ ] Video call integration (Zoom, Google Meet)
- [ ] SMS reminders
- [ ] Team scheduling / round-robin
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Custom branding
- [ ] API access
- [ ] Webhooks
- [ ] Mobile app

## 🤝 Contributing

This is an MVP project. Feel free to fork and extend!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

Built following best practices from:
- [Cal.com](https://github.com/calcom/cal.com)
- [Calendly](https://calendly.com)
- Next.js documentation
- Prisma documentation

## 📞 Support

For issues or questions:
1. Check the code comments
2. Review the API documentation above
3. Test with the provided setup instructions

## ⚡ Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio          # Visual database editor
npx prisma migrate dev     # Create new migration
npx prisma generate        # Regenerate Prisma Client
npx prisma db push         # Push schema without migration
```

---

**Built with ❤️ using Next.js and TypeScript**


