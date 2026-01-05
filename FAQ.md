# ❓ Frequently Asked Questions (FAQ)

## General Questions

### What is this project?

This is a **Scheduling MVP** (Minimum Viable Product) - a full-featured booking and scheduling application similar to Calendly. It allows users to:
- Create bookable time slots
- Share a booking link
- Let others schedule meetings without email back-and-forth
- Sync with Google Calendar
- Send automatic email notifications

### Is this production-ready?

Yes! This MVP includes:
- ✅ Complete authentication system
- ✅ Full booking flow
- ✅ Email notifications
- ✅ Google Calendar integration
- ✅ Mobile-responsive design
- ✅ Secure by default

However, it's called an "MVP" because it focuses on core features. Advanced features like team scheduling, payments, and SMS are not included.

### What's included vs. what's not?

**✅ Included:**
- User signup/login
- Event type management
- Availability settings
- Public booking pages
- Time slot generation
- Booking management
- Email notifications
- Google Calendar sync
- Dashboard

**❌ Not Included (Future):**
- Team scheduling
- Payment processing
- SMS notifications
- Video call integration
- Recurring meetings
- Multiple calendar support
- Mobile app
- Webhooks/API access

---

## Setup & Installation

### Do I need to install PostgreSQL locally?

**No!** You have options:

1. **Local PostgreSQL** (traditional)
   - Install PostgreSQL on your machine
   - Good for development
   
2. **Cloud Database** (recommended)
   - Use Neon (free tier available)
   - No local installation needed
   - Production-ready from the start

### How do I get a NEXTAUTH_SECRET?

Generate a secure random string:

```bash
openssl rand -base64 32
```

Or use any random string generator (minimum 32 characters).

### Can I skip the email and calendar setup?

**Yes!** The app works without them:
- **Without email**: Notifications logged to console
- **Without calendar**: No sync, but booking still works

You can add them later.

### What Node.js version do I need?

Node.js 20 or higher. Check with:

```bash
node --version
```

---

## Features & Functionality

### How does timezone handling work?

The app is **fully timezone-aware**:
1. User sets their timezone (auto-detected)
2. Availability saved in user's timezone
3. Time slots shown in attendee's timezone
4. All times stored as UTC in database
5. Display converted for each user

### Can users book the same slot twice?

**No!** The app prevents double-booking:
1. Checks internal bookings
2. Checks Google Calendar (if connected)
3. Returns conflict error if slot taken
4. Real-time slot availability

### What happens if someone books while I'm busy?

If Google Calendar is connected:
- App reads your calendar in real-time
- Busy times are blocked automatically
- Attendees can't book conflicting slots

Without calendar:
- Only internal bookings prevent conflicts
- Manual calendar events won't block slots

### Can I have multiple event types?

**Yes!** Create unlimited event types:
- Different durations (15 min, 30 min, etc.)
- Different descriptions
- Different colors
- Each has its own booking link

### How do cancellations work?

**Host can cancel:**
- Go to Dashboard → View booking → Cancel
- Optionally provide reason
- Email sent to attendee
- Calendar event removed

**Attendee cancellation:**
- Not implemented in MVP (use external link)
- Future enhancement

---

## Email System

### Do I need to pay for email service?

**No!** Options:

1. **Development**: Emails logged to console (free)
2. **Resend Free Tier**: 100 emails/day (free)
3. **Resend Paid**: $20/month for 50,000 emails

### Why Resend and not SendGrid/Mailgun?

Resend is:
- Simpler to setup
- Better deliverability
- Free tier sufficient for MVP
- Modern API

But you can switch to any service by modifying `lib/email.ts`.

### How do I verify my domain for emails?

1. Sign up at https://resend.com
2. Go to Domains → Add Domain
3. Add DNS records (SPF, DKIM)
4. Verify in Resend dashboard
5. Use `noreply@yourdomain.com` as FROM_EMAIL

### What emails are sent?

1. **Booking Confirmation** → Attendee
   - Meeting details, time, add to calendar link
2. **Host Notification** → Event owner
   - New booking alert with attendee info
3. **Cancellation** → Both parties
   - Cancellation notice with reason

---

## Google Calendar Integration

### Is Google Calendar required?

**No**, but highly recommended because it:
- Prevents double-booking
- Auto-creates calendar events
- Sends calendar invites
- Keeps everything synced

### How do I get Google OAuth credentials?

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/calendar/callback`
6. Copy Client ID and Secret to `.env`

**Full guide:** See SETUP.md

### Can I use Outlook/Apple Calendar?

Not in the MVP. Only Google Calendar is supported.

Future versions could add:
- Microsoft Outlook
- Apple Calendar
- CalDAV

### What permissions does the app need?

The app requests:
- **Read calendar**: Check for conflicts
- **Manage events**: Create/update/delete bookings

It does NOT:
- Read email
- Access other Google services
- Share your calendar publicly

### Can I disconnect my calendar?

Yes, but you'll need to implement the disconnect endpoint. The database structure supports it (`calendar_connections` table).

---

## Deployment

### Where should I deploy this?

**Recommended:** Vercel + Neon
- Easy deployment
- Free tier available
- Auto-scaling
- Good performance

**Alternatives:**
- Railway (all-in-one)
- DigitalOcean App Platform
- AWS/GCP (advanced)

See DEPLOYMENT.md for guides.

### How much does it cost to run?

**Free Tier (Testing):**
- Vercel: Free
- Neon: Free (3 projects)
- Resend: Free (100 emails/day)
- **Total: $0/month**

**Small Business (~1000 users):**
- Vercel Pro: $20
- Neon: $25
- Resend: $20
- **Total: $65/month**

### Do I need a custom domain?

**No!** Start with:
- Vercel subdomain: `your-app.vercel.app`
- Free SSL included

Add custom domain later if needed.

### How do I update after deployment?

1. Make changes locally
2. Commit to Git
3. Push to GitHub
4. Vercel auto-deploys

**For database changes:**
```bash
npx prisma migrate deploy
```

---

## Security

### Is this secure?

**Yes!** Security features:
- Password hashing (bcrypt)
- JWT authentication
- SQL injection prevention (Prisma ORM)
- Input validation (Zod)
- HTTPS (Vercel provides)
- Environment variables protected

### Should I change anything for production?

**Yes!** Before going live:

1. Generate new NEXTAUTH_SECRET
2. Use production database
3. Enable HTTPS (automatic on Vercel)
4. Add rate limiting (future enhancement)
5. Setup error monitoring
6. Review environment variables

### How are passwords stored?

Passwords are:
1. Hashed with bcrypt (10 rounds)
2. Never stored in plain text
3. Never logged or displayed
4. One-way hashing (can't be reversed)

### Can I add two-factor authentication?

Not included in MVP, but you can add it by:
1. Installing `speakeasy` or `otplib`
2. Adding 2FA fields to User model
3. Updating login flow
4. Sending OTP via email/SMS

---

## Customization

### Can I change the design?

**Yes!** All styling uses Tailwind CSS:
- Colors in `tailwind.config.ts`
- Components in `app/` directory
- Global styles in `app/globals.css`

### Can I add more languages?

Not built-in, but you can add i18n:
1. Install `next-intl`
2. Create translation files
3. Wrap components with translation provider

### Can I modify the booking flow?

**Yes!** Key files:
- Public booking page: `app/[username]/[slug]/page.tsx`
- Time slot generation: `lib/time-utils.ts`
- Booking API: `app/api/bookings/route.ts`

### Can I add video call links?

Not built-in, but you can integrate:
- **Zoom**: Use Zoom API to create meetings
- **Google Meet**: Add Meet link in calendar event
- **Custom**: Store video URL in booking record

---

## Performance

### How many users can it handle?

**Out of the box:**
- ~1,000 users
- ~100 bookings/day
- Good performance with default setup

**With optimization:**
- 10,000+ users
- Add Redis caching
- Database connection pooling
- CDN for static assets

### Is it fast?

**Yes!** Performance targets:
- Page load: < 2 seconds
- API response: < 500ms
- Slot generation: < 1 second

Achieved through:
- Next.js optimization
- Efficient database queries
- Client-side caching

### Can I add caching?

**Yes!** Add Redis caching for:
- Available time slots
- User profiles
- Event types
- Calendar data

Use Upstash Redis (serverless).

---

## Troubleshooting

### The app won't start

**Check:**
1. Dependencies installed? `npm install`
2. .env file created?
3. Database running?
4. Port 3000 available?

**Fix:**
```bash
rm -rf node_modules
npm install
npm run dev
```

### Bookings aren't appearing

**Check:**
1. Database connected?
2. Prisma Client generated? `npx prisma generate`
3. Console for errors?
4. Check database with `npx prisma studio`

### Time slots not showing

**Check:**
1. Availability set for that day?
2. Date is in the future?
3. Correct timezone?
4. Event type is active?

### Emails not sending

**Check:**
1. RESEND_API_KEY in .env?
2. Valid API key?
3. Check terminal for "Email sent" log
4. Check Resend dashboard for errors

### Calendar sync not working

**Check:**
1. Google credentials in .env?
2. Redirect URI matches exactly?
3. Calendar API enabled?
4. OAuth consent screen configured?

---

## Development

### How do I add new features?

1. Update database schema (prisma/schema.prisma)
2. Run migration: `npx prisma migrate dev`
3. Add API routes (app/api/)
4. Add frontend pages (app/)
5. Test thoroughly

### Can I contribute?

**Yes!** See CONTRIBUTING.md for guidelines.

**Wanted features:**
- Video call integration
- SMS notifications
- Team scheduling
- Payment processing
- Advanced analytics

### How do I run tests?

Tests not included in MVP, but you can add:
1. **Unit tests**: Jest + React Testing Library
2. **Integration tests**: Supertest for API
3. **E2E tests**: Playwright or Cypress

### What's the tech stack again?

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React

**Backend:**
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL
- JWT Auth

**Services:**
- Resend (email)
- Google Calendar API

---

## Business Questions

### Can I use this commercially?

**Yes!** MIT License allows:
- Commercial use
- Modification
- Distribution
- Private use

No restrictions!

### Can I white-label this?

**Yes!** You can:
- Remove branding
- Add your logo
- Custom domain
- Modify all UI

### Can I charge users?

**Yes!** Add payment features:
- Stripe for subscriptions
- Tiered pricing
- Custom billing

### Can I offer this as SaaS?

**Yes!** This MVP is a great starting point for SaaS:
1. Add tenant/organization model
2. Implement billing
3. Add admin panel
4. Scale infrastructure

---

## Support & Resources

### Where can I get help?

1. **Documentation**:
   - README.md - Overview
   - SETUP.md - Installation
   - API.md - Endpoints
   - DEPLOYMENT.md - Going live

2. **Code**:
   - Comments in source files
   - Clean, readable structure
   - Type definitions

3. **Community**:
   - GitHub Issues
   - Stack Overflow
   - Next.js Discord

### Where can I learn more?

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### What if I find a bug?

1. Check if it's in CHECKLIST.md
2. Review code and fix locally
3. Document the fix
4. Consider contributing back

### Can you build custom features for me?

This is open-source software provided as-is. For custom development, you'll need to:
1. Hire a developer
2. Modify code yourself
3. Fork and extend

---

## Quick Reference

### Important Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production

# Database
npm run db:studio        # Visual editor
npm run db:migrate       # Run migrations
npm run db:push          # Push schema
npm run db:reset         # Reset (⚠️ deletes data)

# Setup
./setup.sh               # Quick setup script
```

### Important Files

```
.env                     # Configuration
prisma/schema.prisma     # Database schema
app/api/                 # Backend logic
app/[username]/          # Public pages
app/dashboard/           # Protected pages
lib/                     # Utilities
```

### Important URLs

```
/                        # Landing page
/signup                  # Sign up
/login                   # Login
/dashboard               # Dashboard
/[username]              # Public profile
/[username]/[slug]       # Booking page
```

---

**Still have questions? Check the documentation or review the code!**

**Happy coding! 🚀**


