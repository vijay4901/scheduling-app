# ✅ Development Checklist

Use this checklist to track your progress building and deploying the Scheduling MVP.

## Phase 1: Initial Setup

### Environment Setup
- [ ] Node.js 20+ installed
- [ ] PostgreSQL installed (or Neon account created)
- [ ] Code editor ready (VS Code recommended)
- [ ] Git initialized

### Project Installation
- [ ] Run `npm install`
- [ ] Create `.env` file with required variables
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Configure DATABASE_URL

### Database Setup
- [ ] Create database: `createdb scheduling_mvp`
- [ ] Run migrations: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Verify with Prisma Studio: `npx prisma studio`

### First Run
- [ ] Start dev server: `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] No console errors
- [ ] Landing page loads correctly

---

## Phase 2: Feature Testing

### Authentication
- [ ] Sign up with new account
- [ ] Receive JWT token
- [ ] Login with credentials
- [ ] Logout works
- [ ] Token persists in localStorage
- [ ] Protected routes redirect to login

### Event Type Management
- [ ] Create first event type
- [ ] Edit event type
- [ ] Change duration and color
- [ ] Auto-generate slug from name
- [ ] Delete event type
- [ ] View list of event types

### Availability Settings
- [ ] Set weekly working hours
- [ ] Enable/disable specific days
- [ ] Adjust time ranges
- [ ] Timezone auto-detected
- [ ] Save availability settings
- [ ] Settings persist on reload

### Public Booking Page
- [ ] Access booking page: `localhost:3000/YOUR_USERNAME`
- [ ] See user profile and event types
- [ ] Click on event type
- [ ] Calendar date picker works
- [ ] View available time slots
- [ ] Slots refresh when date changes
- [ ] Mobile responsive design

### Booking Creation
- [ ] Select date and time slot
- [ ] Fill in attendee details
- [ ] Submit booking form
- [ ] See confirmation page
- [ ] Booking appears in dashboard
- [ ] No double-booking (same slot unavailable)
- [ ] Timezone displayed correctly

### Dashboard
- [ ] View stats (event types, bookings)
- [ ] See upcoming bookings list
- [ ] Access event type management
- [ ] Navigate to availability settings
- [ ] Navigate to calendar settings
- [ ] Copy booking link works

### Booking Management
- [ ] View booking details
- [ ] Cancel booking with reason
- [ ] Booking status updates
- [ ] Cancellation reflects in calendar

---

## Phase 3: Integrations (Optional)

### Email Notifications
- [ ] Sign up for Resend account
- [ ] Get API key from https://resend.com
- [ ] Add `RESEND_API_KEY` to `.env`
- [ ] Add `FROM_EMAIL` to `.env`
- [ ] Create test booking
- [ ] Attendee receives confirmation email
- [ ] Host receives notification email
- [ ] Test cancellation email
- [ ] Emails have correct formatting
- [ ] Links in emails work

### Google Calendar Integration
- [ ] Create Google Cloud project
- [ ] Enable Google Calendar API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URI: `http://localhost:3000/api/calendar/callback`
- [ ] Add credentials to `.env`
- [ ] Click "Connect Calendar" in dashboard
- [ ] Complete OAuth flow
- [ ] Connection status shows "Connected"
- [ ] Create test booking
- [ ] Event appears in Google Calendar
- [ ] Cancel booking
- [ ] Event removed from Google Calendar
- [ ] Existing calendar events block slots

---

## Phase 4: Quality Assurance

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Mobile Responsiveness
- [ ] Landing page responsive
- [ ] Signup/login forms mobile-friendly
- [ ] Dashboard works on mobile
- [ ] Booking page optimized for mobile
- [ ] Date picker usable on mobile
- [ ] Time slots easy to tap
- [ ] Forms submit correctly on mobile

### Edge Cases
- [ ] Booking at midnight (timezone boundary)
- [ ] Booking today vs future dates
- [ ] Past time slots not shown
- [ ] No availability = no slots shown
- [ ] Long event names display correctly
- [ ] Special characters in names/emails
- [ ] Very long attendee notes
- [ ] Rapid clicking doesn't create duplicates

### Error Handling
- [ ] Invalid email format rejected
- [ ] Weak password rejected
- [ ] Duplicate username prevented
- [ ] Invalid time slot booking fails gracefully
- [ ] Network errors show user-friendly messages
- [ ] Database connection errors handled
- [ ] Token expiration handled

### Performance
- [ ] Pages load in < 2 seconds
- [ ] No unnecessary re-renders
- [ ] Smooth animations
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Database queries efficient

---

## Phase 5: Pre-Deployment

### Code Quality
- [ ] No console.log in production code
- [ ] No TODO comments unresolved
- [ ] Code formatted consistently
- [ ] No ESLint errors: `npm run lint`
- [ ] TypeScript errors resolved: `npm run build`
- [ ] Unused imports removed

### Security Review
- [ ] .env file in .gitignore
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens secure
- [ ] Input validation on all endpoints
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevention
- [ ] CSRF tokens (if needed)

### Documentation
- [ ] README.md complete
- [ ] SETUP.md clear
- [ ] API.md accurate
- [ ] DEPLOYMENT.md tested
- [ ] Comments in complex code
- [ ] Environment variables documented

### Git Repository
- [ ] Initial commit made
- [ ] .gitignore configured
- [ ] Sensitive files not committed
- [ ] Clean commit history
- [ ] Pushed to GitHub/GitLab

---

## Phase 6: Deployment

### Production Database
- [ ] Neon/Supabase account created
- [ ] Production database created
- [ ] Connection string obtained
- [ ] Connection tested locally
- [ ] Migrations run on production DB

### Environment Variables (Production)
- [ ] DATABASE_URL updated
- [ ] New NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL set to production domain
- [ ] APP_URL set to production domain
- [ ] RESEND_API_KEY added
- [ ] FROM_EMAIL configured with verified domain
- [ ] GOOGLE_CLIENT_ID added
- [ ] GOOGLE_CLIENT_SECRET added

### Vercel Deployment
- [ ] GitHub repo connected to Vercel
- [ ] Environment variables added in Vercel
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Domain assigned

### Post-Deployment Testing
- [ ] Production site loads
- [ ] Sign up works in production
- [ ] Login works in production
- [ ] Create event type in production
- [ ] Set availability in production
- [ ] Test complete booking flow
- [ ] Emails send in production
- [ ] Calendar sync works in production

### Google OAuth Production
- [ ] Add production redirect URI to Google Console
- [ ] Format: `https://yourdomain.com/api/calendar/callback`
- [ ] Add production domain to authorized domains
- [ ] Test OAuth flow in production

### Domain Configuration (Optional)
- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Environment variables updated with new domain
- [ ] Google OAuth updated with new domain

---

## Phase 7: Monitoring & Maintenance

### Error Monitoring
- [ ] Sentry configured (optional)
- [ ] Error logging working
- [ ] Alerts configured
- [ ] Error dashboard accessible

### Uptime Monitoring
- [ ] UptimeRobot or similar configured
- [ ] Health check endpoint created
- [ ] Alert notifications setup

### Analytics (Optional)
- [ ] Google Analytics configured
- [ ] Tracking key events (signups, bookings)
- [ ] Conversion funnel setup

### Backups
- [ ] Database backup strategy confirmed
- [ ] Test restore procedure
- [ ] Backup schedule set

### Performance Monitoring
- [ ] Vercel Analytics enabled
- [ ] Core Web Vitals tracked
- [ ] API response times monitored
- [ ] Database query performance reviewed

---

## Phase 8: Growth & Scaling

### User Feedback
- [ ] Feedback mechanism added
- [ ] User testing conducted
- [ ] Bug reports collected
- [ ] Feature requests prioritized

### Optimization
- [ ] Slow queries optimized
- [ ] Caching implemented where needed
- [ ] Images optimized
- [ ] Bundle size analyzed

### Feature Roadmap
- [ ] Next features prioritized
- [ ] User demand assessed
- [ ] Technical feasibility evaluated
- [ ] Development timeline created

---

## Quick Status Check

Mark your current phase:

- [ ] Phase 1: Initial Setup ✅
- [ ] Phase 2: Feature Testing 🧪
- [ ] Phase 3: Integrations 🔌
- [ ] Phase 4: Quality Assurance 🔍
- [ ] Phase 5: Pre-Deployment 📋
- [ ] Phase 6: Deployment 🚀
- [ ] Phase 7: Monitoring 📊
- [ ] Phase 8: Growth 📈

---

## Common Issues Checklist

If something's not working:

### Database Issues
- [ ] PostgreSQL running?
- [ ] DATABASE_URL correct?
- [ ] Migrations run?
- [ ] Prisma Client generated?

### Authentication Issues
- [ ] NEXTAUTH_SECRET set?
- [ ] Token in localStorage?
- [ ] NEXTAUTH_URL correct?
- [ ] JWT not expired?

### Booking Issues
- [ ] Availability set?
- [ ] Event type active?
- [ ] Correct timezone?
- [ ] Slots generated?

### Email Issues
- [ ] RESEND_API_KEY valid?
- [ ] FROM_EMAIL verified?
- [ ] Check spam folder?
- [ ] Check Resend dashboard?

### Calendar Issues
- [ ] OAuth credentials correct?
- [ ] Redirect URI matches?
- [ ] Calendar API enabled?
- [ ] Token refresh working?

---

## Success Criteria

Your MVP is production-ready when:

- ✅ All Phase 1-5 items checked
- ✅ No critical bugs
- ✅ Complete booking flow works
- ✅ Emails sending
- ✅ Calendar syncing
- ✅ Mobile responsive
- ✅ Documentation complete
- ✅ Deployed and accessible

---

**Print this checklist and mark items as you complete them!**

**Good luck with your scheduling MVP! 🚀**



