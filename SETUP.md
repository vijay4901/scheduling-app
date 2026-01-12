# 🚀 Quick Setup Guide

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL 15+ installed and running
- [ ] A code editor (VS Code recommended)
- [ ] Git installed

## Step-by-Step Setup (10 minutes)

### 1. Install Dependencies (2 min)

```bash
npm install
```

### 2. Setup PostgreSQL Database (2 min)

**Option A: Local PostgreSQL**
```bash
# Create database
createdb scheduling_mvp

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://localhost:5432/scheduling_mvp"
```

**Option B: Use Neon (Free Cloud Database)**
1. Go to https://neon.tech
2. Sign up (free)
3. Create a database
4. Copy connection string to `.env`

### 3. Create Environment File (2 min)

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://localhost:5432/scheduling_mvp"

# Authentication (generate a random secret)
NEXTAUTH_SECRET="replace-with-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for now, emails will be logged to console)
RESEND_API_KEY=""
FROM_EMAIL="noreply@yourdomain.com"

# Google Calendar (optional for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# App URL
APP_URL="http://localhost:3000"
```

**Generate a secure secret:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use any random string generator
```

### 4. Setup Database Schema (1 min)

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 5. Start the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Testing the App (5 min)

### Create Your First Booking Flow

1. **Sign Up**
   - Go to http://localhost:3000/signup
   - Create account with:
     - Name: John Doe
     - Email: john@example.com
     - Username: john (this becomes your booking URL)
     - Password: password123

2. **Set Availability**
   - Click "Availability" in dashboard
   - Enable Monday-Friday, 9:00 AM - 5:00 PM
   - Click "Save Availability"

3. **Create Event Type**
   - Click "Create Event Type"
   - Name: "30 Minute Meeting"
   - Duration: 30 minutes
   - Click "Create"

4. **Test Booking**
   - Open new incognito window
   - Go to http://localhost:3000/john
   - Click "30 Minute Meeting"
   - Select a date and time
   - Fill in attendee details
   - Submit booking

5. **View Booking**
   - Go back to dashboard
   - See your new booking!

## Optional: Setup Email (5 min)

To enable email notifications:

1. **Sign up for Resend**
   - Go to https://resend.com
   - Sign up (free tier: 100 emails/day)
   - Get API key

2. **Add to .env**
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   FROM_EMAIL="onboarding@resend.dev"  # or your verified domain
   ```

3. **Restart dev server**
   ```bash
   npm run dev
   ```

Now emails will be sent for bookings!

## Optional: Setup Google Calendar (10 min)

To enable calendar sync:

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Create new project (or select existing)

2. **Enable Google Calendar API**
   - Go to "APIs & Services" → "Library"
   - Search "Google Calendar API"
   - Click "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Name: Scheduling MVP
   - Authorized redirect URIs:
     - `http://localhost:3000/api/calendar/callback`

4. **Copy Credentials to .env**
   ```env
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

5. **Test Calendar Integration**
   - Restart dev server
   - Go to Dashboard → "Calendar Integration"
   - Click "Connect Google Calendar"
   - Authorize access

## Common Issues & Solutions

### Issue: "Database connection error"
**Solution:** 
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Test connection: `psql postgresql://localhost:5432/scheduling_mvp`

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Prisma Client not found"
**Solution:**
```bash
npx prisma generate
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Database Management

### View Database in Prisma Studio
```bash
npx prisma studio
```
Opens visual database editor at http://localhost:5555

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

## Development Tips

### Hot Reload Not Working?
- Save the file again
- Restart dev server
- Clear Next.js cache: `rm -rf .next`

### Check Console for Errors
- Browser console (F12)
- Terminal where you ran `npm run dev`

### Testing Emails Locally
Without Resend API key, emails are logged to console. Check terminal output.

### Testing Different Timezones
Change your system timezone or use browser dev tools to simulate different locations.

## Next Steps

Now that you're set up:

1. ✅ Test the complete booking flow
2. ✅ Try creating multiple event types
3. ✅ Connect Google Calendar
4. ✅ Customize event colors and descriptions
5. ✅ Test cancellation flow
6. 📚 Review the code to understand how it works
7. 🎨 Customize the UI to match your brand
8. 🚀 Deploy to Vercel when ready

## Deployment Checklist

When ready to deploy:

- [ ] Setup production database (Neon, Supabase, or Railway)
- [ ] Update DATABASE_URL with production value
- [ ] Generate new NEXTAUTH_SECRET for production
- [ ] Update NEXTAUTH_URL and APP_URL to production domain
- [ ] Setup Resend with verified domain
- [ ] Update Google OAuth redirect URI with production URL
- [ ] Test complete flow in production
- [ ] Setup error monitoring (Sentry)

## Get Help

- Check main README.md for detailed documentation
- Review code comments in source files
- Look at API routes in `app/api/` for backend logic
- Check components in `app/` for frontend code

**Happy coding! 🎉**



