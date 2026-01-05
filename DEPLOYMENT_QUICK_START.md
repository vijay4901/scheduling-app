# 🚀 Quick Deployment Checklist

## ✅ Completed Steps

- [x] **Code pushed to GitHub**: https://github.com/vijay4901/scheduling-app
- [x] **Deployment guide created**: See `GITHUB_DEPLOYMENT.md`
- [x] **Environment example created**: See `.env.example`

---

## 🎯 Next Steps - Deploy to Vercel (15 minutes)

### Step 1: Create Production Database (Neon)

1. Go to **[https://neon.tech](https://neon.tech)**
2. Sign up (free, no credit card needed)
3. Click "Create a project"
   - Name: `scheduling-production`
   - Region: Choose closest to you
4. Copy the **Connection String** (looks like: `postgresql://user:pass@host.neon.tech/db`)
5. Keep this tab open - you'll need it soon!

---

### Step 2: Deploy to Vercel

1. Go to **[https://vercel.com/signup](https://vercel.com/signup)**
2. Click "Continue with GitHub"
3. Authorize Vercel
4. Click "Add New..." → "Project"
5. Find `scheduling-app` → Click "Import"

---

### Step 3: Configure Environment Variables

Before clicking "Deploy", add these environment variables:

```bash
# 1. Database (from Neon - Step 1)
DATABASE_URL=postgresql://YOUR_NEON_CONNECTION_STRING

# 2. Generate a new secret
# Run in terminal: openssl rand -base64 32
NEXTAUTH_SECRET=YOUR_NEW_SECRET_HERE

# 3. These will be your Vercel URL (update after first deploy)
NEXTAUTH_URL=https://your-app-name.vercel.app
APP_URL=https://your-app-name.vercel.app

# 4. Email service (if you have Resend account)
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=noreply@yourdomain.com

# 5. Google Calendar (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**How to add them in Vercel:**
- Click "Environment Variables" 
- For each variable, paste the name and value
- Click "Add" for each one

---

### Step 4: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes ⏱️
3. You'll get a URL like: `https://scheduling-app-xyz.vercel.app`
4. **Copy this URL!**

---

### Step 5: Update URLs in Vercel

Now that you have your Vercel URL:

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Click "Edit" on these two variables:
   ```
   NEXTAUTH_URL=https://scheduling-app-xyz.vercel.app
   APP_URL=https://scheduling-app-xyz.vercel.app
   ```
   (Replace with your actual Vercel URL)
3. Click "Save"
4. Go to **Deployments** tab
5. Click "⋯" on latest deployment → **"Redeploy"**

---

### Step 6: Run Database Migrations

Install Vercel CLI and migrate your database:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project (select your project when prompted)
vercel link

# Pull production environment variables
vercel env pull .env.production

# Run Prisma migrations on production
npx prisma migrate deploy
```

✅ Your database now has all the tables!

---

### Step 7: Update Google OAuth (if using Calendar)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project → APIs & Services → Credentials
3. Click your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://scheduling-app-xyz.vercel.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://scheduling-app-xyz.vercel.app/api/calendar/callback
   ```
6. Click **Save**

---

### Step 8: Test Your Live App! 🎉

Visit your production URL and test:

- [ ] Sign up with a new account
- [ ] Create an event type
- [ ] Set your availability
- [ ] Visit your booking page: `your-app.vercel.app/yourusername/event-slug`
- [ ] Book a test meeting
- [ ] Check email confirmation (if Resend configured)

---

## 🎁 Bonus: Future Deployments (Auto-Deploy)

Now it's automatic! Just push to GitHub:

```bash
git add .
git commit -m "Add new feature"
git push origin master
```

Vercel will automatically deploy in 2 minutes! 🚀

---

## 📊 Where to Find Things

- **Your GitHub Repo**: https://github.com/vijay4901/scheduling-app
- **Vercel Dashboard**: https://vercel.com (after signup)
- **Neon Dashboard**: https://console.neon.tech (after signup)
- **Your Live App**: Will be at `https://your-app-name.vercel.app`

---

## 🆘 Need Help?

Detailed step-by-step guide: Open `GITHUB_DEPLOYMENT.md` in this project.

---

## 💰 Cost

Everything above is **FREE**:
- ✅ Vercel: Free tier
- ✅ Neon: Free tier (10 GB)
- ✅ Resend: Free tier (100 emails/day)

---

**Current Status**: ✅ Code on GitHub, ready for Vercel deployment!

**Next**: Follow Step 1 above to create Neon database, then deploy to Vercel!

