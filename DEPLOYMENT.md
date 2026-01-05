# 🚀 Deployment Guide

This guide covers deploying your Scheduling MVP to production.

## Deployment Options

### Option 1: Vercel + Neon (Recommended - Easiest)

**Best for:** Quick deployment, serverless, auto-scaling

**Stack:**
- Frontend/API: Vercel
- Database: Neon (Serverless PostgreSQL)
- Estimated cost: $0-25/month

#### Steps:

1. **Setup Neon Database**
   ```bash
   # Go to https://neon.tech
   # Sign up (free tier available)
   # Create a new project
   # Copy the connection string
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click Deploy

4. **Environment Variables for Vercel**
   ```env
   DATABASE_URL=postgresql://your-neon-connection-string
   NEXTAUTH_SECRET=your-production-secret-here
   NEXTAUTH_URL=https://your-app.vercel.app
   APP_URL=https://your-app.vercel.app
   RESEND_API_KEY=your-resend-key
   FROM_EMAIL=noreply@yourdomain.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

5. **Run Database Migrations**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Link project
   vercel link

   # Run migration
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

6. **Update Google OAuth Redirect URI**
   - Go to Google Cloud Console
   - Add: `https://your-app.vercel.app/api/calendar/callback`

✅ **Done!** Your app is live at `https://your-app.vercel.app`

---

### Option 2: Railway (Full-Stack)

**Best for:** Single platform for everything

**Stack:**
- Everything on Railway
- Includes PostgreSQL database
- Estimated cost: $5-20/month

#### Steps:

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**
   - Click "New"
   - Select "Database" → "PostgreSQL"
   - Copy DATABASE_URL from variables tab

4. **Configure Environment Variables**
   - Go to your service
   - Click "Variables"
   - Add all environment variables (see above)

5. **Deploy**
   - Railway automatically deploys
   - Get your domain from Settings

---

### Option 3: DigitalOcean App Platform

**Best for:** More control, predictable pricing

**Stack:**
- App Platform (containerized)
- Managed PostgreSQL
- Estimated cost: $12-30/month

#### Steps:

1. **Create PostgreSQL Database**
   - Go to DigitalOcean
   - Create → Databases → PostgreSQL
   - Copy connection string

2. **Create App**
   - Apps → Create App
   - Connect GitHub repo
   - Select branch

3. **Configure Build**
   ```yaml
   # Build command
   npm install && npx prisma generate && npm run build

   # Run command
   npm start
   ```

4. **Add Environment Variables**
   - Add all variables in Settings → Environment

5. **Deploy**
   - Click "Deploy"

---

## Pre-Deployment Checklist

### Security

- [ ] Generate strong NEXTAUTH_SECRET (min 32 characters)
  ```bash
  openssl rand -base64 32
  ```
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Rotate database credentials if exposed
- [ ] Setup CORS if needed

### Database

- [ ] Run all migrations
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Verify connection
  ```bash
  npx prisma db pull
  ```
- [ ] Setup automated backups
- [ ] Test queries work in production

### Environment Variables

- [ ] DATABASE_URL (production database)
- [ ] NEXTAUTH_SECRET (new secret for production)
- [ ] NEXTAUTH_URL (production URL)
- [ ] APP_URL (production URL)
- [ ] RESEND_API_KEY (email service)
- [ ] FROM_EMAIL (verified domain)
- [ ] GOOGLE_CLIENT_ID (OAuth)
- [ ] GOOGLE_CLIENT_SECRET (OAuth)

### Google Calendar

- [ ] Update OAuth redirect URI in Google Cloud Console
- [ ] Add production domain to authorized domains
- [ ] Test OAuth flow in production

### Email

- [ ] Verify domain in Resend (for custom emails)
- [ ] Test email delivery
- [ ] Check spam folder
- [ ] Setup SPF/DKIM records

### Testing

- [ ] Sign up flow works
- [ ] Login works
- [ ] Create event type
- [ ] Set availability
- [ ] Test public booking page
- [ ] Complete a booking
- [ ] Receive emails
- [ ] Connect calendar
- [ ] Cancel booking
- [ ] Test on mobile

---

## Post-Deployment

### 1. Custom Domain (Optional)

#### Vercel:
```bash
# Add domain in Vercel dashboard
# Update DNS records:
# A record: 76.76.21.21
# CNAME: cname.vercel-dns.com
```

Update environment variables:
```env
NEXTAUTH_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
```

### 2. Setup Monitoring

**Vercel Analytics** (Built-in)
- Automatically enabled
- View in dashboard

**Sentry (Error Tracking)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `.env`:
```env
SENTRY_DSN=your-sentry-dsn
```

### 3. Performance Optimization

**Enable Caching**
- Static pages cached automatically on Vercel
- Use `revalidate` for ISR

**Database Connection Pooling**
- Use connection pooler URL from Neon
- Format: `postgresql://...?pgbouncer=true`

**Image Optimization**
- Next.js handles automatically
- Use `next/image` component

### 4. Backup Strategy

**Database Backups**

Neon:
- Automatic backups included
- Point-in-time recovery available

Railway:
- Enable automatic backups in dashboard

DigitalOcean:
- Daily automatic backups
- Manual backup option

### 5. Setup Alerts

**Email Alerts for:**
- Database connection failures
- High error rates
- Booking failures
- Calendar sync errors

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- BetterUptime

---

## Scaling Considerations

### Database

**When to scale:**
- \> 10,000 bookings
- Slow query times
- Connection pool exhausted

**How to scale:**
- Upgrade database tier
- Add read replicas
- Implement Redis caching

### API

**Rate Limiting:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});
```

**Caching:**
- Use Redis for slot availability
- Cache user profiles
- Cache event types

### Email

**Upgrade Resend:**
- Free: 100 emails/day
- Paid: $20/month for 50,000 emails

---

## Troubleshooting

### Issue: Build fails on Vercel

**Check:**
- All dependencies in package.json
- Prisma generate in build command
- Environment variables set

**Fix:**
```json
// package.json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Issue: Database connection timeout

**Check:**
- DATABASE_URL is correct
- Database is running
- Connection pool settings

**Fix:**
```env
# Add connection pool settings
DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=30"
```

### Issue: OAuth redirect mismatch

**Check:**
- Redirect URI in Google Console matches production URL
- NEXTAUTH_URL and APP_URL are correct

**Fix:**
- Update redirect URI: `https://yourdomain.com/api/calendar/callback`
- Restart application

### Issue: Emails not sending

**Check:**
- RESEND_API_KEY is valid
- FROM_EMAIL is verified
- Check Resend dashboard for errors

**Fix:**
- Verify domain in Resend
- Check API key permissions
- Review error logs

---

## Cost Breakdown

### Minimal Setup (Free Tier)
- Vercel: Free
- Neon: Free (3 projects, 10 GB)
- Resend: Free (100 emails/day)
- **Total: $0/month**

### Small Business (<1000 users)
- Vercel Pro: $20/month
- Neon: $25/month (paid tier)
- Resend: $20/month (50k emails)
- **Total: $65/month**

### Growing Business (>1000 users)
- Vercel Pro: $20/month
- Neon/Railway DB: $50/month
- Resend: $20/month
- Uptime monitoring: $10/month
- **Total: $100/month**

---

## Rollback Plan

If something goes wrong:

1. **Revert Deployment**
   ```bash
   vercel rollback
   # Or in Railway/DO dashboard
   ```

2. **Database Rollback**
   ```bash
   # Revert last migration
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

3. **Check Logs**
   ```bash
   vercel logs
   # Or in Railway/DO dashboard
   ```

---

## Security Best Practices

### Production Checklist

- [ ] HTTPS enabled (automatic on modern platforms)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS configured properly
- [ ] CSP headers configured
- [ ] Regular dependency updates
- [ ] Error logging (don't expose secrets)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)

### Recommended Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor response times
- [ ] Review email delivery rates

### Monthly
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Check database performance
- [ ] Review user feedback

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup restore test
- [ ] Disaster recovery drill

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Ready to deploy? Follow Option 1 for the quickest setup! 🚀**


