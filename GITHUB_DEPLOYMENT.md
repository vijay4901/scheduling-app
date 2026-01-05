# 🚀 GitHub & Vercel Deployment Guide

This guide will walk you through deploying your scheduling application to production in under 15 minutes.

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account ([Sign up here](https://github.com/join))
- ✅ Your code ready and tested locally
- ✅ All environment variables documented

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)

1. **Go to GitHub**: Visit [https://github.com/new](https://github.com/new)

2. **Create Repository**:
   - Repository name: `scheduling-app` (or your preferred name)
   - Description: "Full-featured scheduling application - Calendly clone"
   - Keep it **Public** (or Private if you prefer)
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (you already have these)
   - Click "Create repository"

3. **Copy the Repository URL**:
   - You'll see something like: `https://github.com/YOUR_USERNAME/scheduling-app.git`
   - Copy this URL

### Option B: Using GitHub CLI (Advanced)

```bash
# Install GitHub CLI if you haven't
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create scheduling-app --public --source=. --remote=origin --push
```

---

## Step 2: Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Add GitHub as remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/scheduling-app.git

# Check current branch name
git branch

# If you're on 'master', rename to 'main' (recommended)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Troubleshooting:**
- If you get "remote origin already exists", run: `git remote remove origin` first
- If push is rejected, make sure you created an empty repo on GitHub (no README)

**Verify**: Visit your GitHub repository URL - you should see all your files there!

---

## Step 3: Deploy to Vercel

### 3.1 Sign Up for Vercel

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### 3.2 Import Your Project

1. On Vercel dashboard, click "Add New..." → "Project"
2. You'll see your GitHub repositories
3. Find `scheduling-app` and click "Import"
4. Vercel will auto-detect Next.js settings ✅

### 3.3 Configure Project Settings

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (default)
**Build Command**: `npm run build` (auto-detected)
**Output Directory**: `.next` (auto-detected)

Click "Deploy" - but wait! We need environment variables first.

### 3.4 Add Environment Variables

Click "Environment Variables" before deploying.

Add each of these (click "Add" for each one):

```env
DATABASE_URL=PASTE_YOUR_NEON_URL_HERE
NEXTAUTH_SECRET=GENERATE_NEW_SECRET_HERE
NEXTAUTH_URL=https://your-app-name.vercel.app
APP_URL=https://your-app-name.vercel.app
RESEND_API_KEY=YOUR_RESEND_KEY
FROM_EMAIL=noreply@yourdomain.com
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

⚠️ **Important Notes:**
- You'll get `NEXTAUTH_URL` and `APP_URL` after first deployment (come back to update these)
- Generate new `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- Never use your local development secrets in production!

### 3.5 Click Deploy!

Vercel will:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Run `prisma generate`
- ✅ Build your Next.js app
- ✅ Deploy to global CDN

⏱️ First deployment takes 2-3 minutes.

---

## Step 4: Setup Production Database (Neon)

### 4.1 Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up (free - no credit card required)
3. Click "Create a project"

### 4.2 Configure Database

- **Project name**: `scheduling-production`
- **PostgreSQL version**: 15 or 16
- **Region**: Choose closest to your users
- Click "Create project"

### 4.3 Get Connection String

1. In your Neon project, click "Connection Details"
2. Copy the **Connection string**
3. It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

### 4.4 Add to Vercel

1. Go back to your Vercel project
2. Settings → Environment Variables
3. Find `DATABASE_URL` and update it with your Neon URL
4. Save

### 4.5 Run Database Migrations

Install Vercel CLI on your local machine:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull production environment variables
vercel env pull .env.production

# Run Prisma migrations on production database
npx prisma migrate deploy
```

**Verify**: Your production database now has all the tables!

---

## Step 5: Update URLs in Vercel

After your first deployment:

1. Copy your Vercel URL (e.g., `https://scheduling-app-xyz.vercel.app`)
2. Go to Vercel → Settings → Environment Variables
3. Update these variables:
   ```
   NEXTAUTH_URL=https://scheduling-app-xyz.vercel.app
   APP_URL=https://scheduling-app-xyz.vercel.app
   ```
4. Go to Deployments tab → Click "⋯" on latest deployment → "Redeploy"

---

## Step 6: Configure Google OAuth for Production

### 6.1 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID

### 6.2 Add Production URLs

**Authorized JavaScript origins:**
- Add: `https://scheduling-app-xyz.vercel.app`

**Authorized redirect URIs:**
- Add: `https://scheduling-app-xyz.vercel.app/api/calendar/callback`

Click "Save"

---

## Step 7: Test Your Production App! 🎉

Visit your production URL and test:

- [ ] Homepage loads
- [ ] Sign up with new account
- [ ] Login works
- [ ] Create event type
- [ ] Set availability
- [ ] Visit your booking page: `your-app.vercel.app/yourusername/event-slug`
- [ ] Book a test meeting
- [ ] Check email confirmation
- [ ] Connect Google Calendar
- [ ] Cancel a booking

---

## 🔄 Future Deployments (Auto-Deploy)

Great news! Now whenever you push to GitHub, Vercel automatically deploys:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your app
3. Deploy to production
4. Takes ~2 minutes

---

## 📊 Monitoring Your App

### Vercel Dashboard

- **Analytics**: See page views, performance
- **Logs**: Debug production issues
- **Deployments**: History of all deployments

Access at: https://vercel.com/your-username/scheduling-app

### Database Monitoring (Neon)

- **Metrics**: Query performance, storage
- **Queries**: See what queries are running
- **Backups**: Automatic backups included

Access at: https://console.neon.tech

---

## 🎯 Optional: Custom Domain

Want `yourdomain.com` instead of `.vercel.app`?

### In Vercel:

1. Go to Settings → Domains
2. Add your domain: `yourdomain.com`
3. Vercel will show DNS records to add

### In Your Domain Provider:

Add these DNS records:
- **Type**: A Record
- **Name**: @ (or www)
- **Value**: 76.76.21.21

Or:
- **Type**: CNAME
- **Name**: @ (or www)
- **Value**: cname.vercel-dns.com

### Update Environment Variables:

```env
NEXTAUTH_URL=https://yourdomain.com
APP_URL=https://yourdomain.com
```

And update Google OAuth redirect URI to match.

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Fix**: Make sure all dependencies are in `package.json`
- Run: `npm install` locally to verify

**Error**: "Prisma Client not generated"
- **Fix**: Already handled in your `build` script ✅

### Database Connection Fails

**Error**: "Can't reach database server"
- **Fix**: Check `DATABASE_URL` is correct
- Verify Neon database is active
- Make sure URL includes `?sslmode=require`

### OAuth Errors

**Error**: "redirect_uri_mismatch"
- **Fix**: Update Google Console redirect URI to match exactly
- Format: `https://your-app.vercel.app/api/calendar/callback`

### Emails Not Sending

**Error**: "Invalid API key"
- **Fix**: Verify `RESEND_API_KEY` in Vercel environment variables
- Check Resend dashboard for API key status

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Starting)

- **Vercel**: Free (Hobby plan)
  - 100 GB bandwidth/month
  - Unlimited builds
  - Automatic HTTPS
  
- **Neon**: Free (Starter plan)
  - 3 projects
  - 10 GB storage
  - Automatic backups
  
- **Resend**: Free
  - 100 emails/day
  - 3,000 emails/month

**Total: $0/month** 🎉

### When to Upgrade

**Vercel Pro ($20/month)** when you need:
- Custom domains
- Team collaboration
- Priority support

**Neon Paid ($25/month)** when you exceed:
- 10 GB storage
- 100 hours compute time/month

**Resend Paid ($20/month)** when you exceed:
- 100 emails/day

---

## 🔐 Security Checklist

- [x] `.env` file in `.gitignore` ✅
- [x] Strong `NEXTAUTH_SECRET` generated ✅
- [x] HTTPS enabled (automatic on Vercel) ✅
- [x] Database credentials secured ✅
- [x] OAuth secrets protected ✅
- [ ] Rate limiting (add if needed)
- [ ] CORS configured (if using external APIs)

---

## 📚 Useful Commands

```bash
# View production logs
vercel logs

# Pull production environment variables
vercel env pull

# Run migration on production
npx prisma migrate deploy

# Rollback deployment
vercel rollback

# Open project in browser
vercel open

# Check deployment status
vercel inspect
```

---

## 🎓 Next Steps

1. **Add Custom Domain** (optional)
2. **Setup Error Tracking** (Sentry)
3. **Enable Analytics** (Vercel Analytics - free)
4. **Setup Uptime Monitoring** (UptimeRobot - free)
5. **Create Backups** (Neon automatic backups)

---

## 🆘 Need Help?

- **Vercel Support**: https://vercel.com/support
- **Neon Docs**: https://neon.tech/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Neon database created
- [ ] Database migrations run
- [ ] Google OAuth URLs updated
- [ ] Production app tested
- [ ] Email delivery verified
- [ ] Calendar integration tested
- [ ] Booking flow tested

---

**🎉 Congratulations! Your app is live!**

Share your booking link: `https://your-app.vercel.app/yourusername`

---

*Last updated: January 2026*

