# 🔧 Login Failed (500 Error) - Fix Guide

## 🔴 Issue: 500 Internal Server Error on Login

Based on the error, here are the possible causes and solutions:

---

## ✅ Solution 1: Sign Up First (Most Likely)

**If you haven't created an account yet:**

You're trying to log in with an account that doesn't exist. You need to **sign up first**!

1. Go to: `https://your-app.vercel.app/signup`
2. Create a new account
3. Then try logging in with those credentials

---

## ✅ Solution 2: Check Environment Variables in Vercel

The 500 error suggests a server-side issue. Make sure ALL required environment variables are set in Vercel:

### Required Environment Variables:

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these if missing:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://your-neon-connection-string

# Authentication (REQUIRED)
NEXTAUTH_SECRET=your-secret-key-min-32-characters
NEXTAUTH_URL=https://your-app-name.vercel.app
APP_URL=https://your-app-name.vercel.app

# Email (Optional - for now)
RESEND_API_KEY=re_your_key
FROM_EMAIL=noreply@yourdomain.com

# Google OAuth (Optional - for calendar)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Generate NEXTAUTH_SECRET:

On your local machine, run:
```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET` in Vercel.

---

## ✅ Solution 3: Verify Database Connection

The login route needs to query the database. Make sure:

1. **DATABASE_URL is set in Vercel** (check Solution 2 above)
2. **Database tables exist** - We already created them with `npx prisma db push`
3. **Connection string includes SSL** - Should have `?sslmode=require`

### Test Database Connection:

```bash
# In your terminal
cd "/Users/vijay.chouhan/Documents/Login Auth"

# Check if you can connect to the database
npx prisma studio
```

If Prisma Studio opens successfully, your database is working.

---

## ✅ Solution 4: Check Vercel Logs

To see the actual error:

1. Go to **Vercel Dashboard**
2. Click on your project
3. Go to **Deployments** → Click latest deployment
4. Click **"View Function Logs"**
5. Look for errors from `/api/auth/login`

Common errors you might see:

### Error: "Can't reach database server"
**Fix**: Add `DATABASE_URL` to Vercel environment variables

### Error: "SECRET is required"
**Fix**: Add `NEXTAUTH_SECRET` to Vercel environment variables

### Error: "User not found"
**Fix**: Sign up first at `/signup`

---

## 🧪 Testing Steps

### Test 1: Sign Up First
```
1. Go to: https://your-app.vercel.app/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Username: testuser
   - Password: Test1234!
3. Click "Create account"
4. Should redirect to dashboard
```

### Test 2: Then Login
```
1. Logout or open incognito window
2. Go to: https://your-app.vercel.app/login
3. Enter the same credentials:
   - Email: test@example.com
   - Password: Test1234!
4. Click "Sign in"
5. Should work now! ✅
```

---

## 📋 Complete Checklist

Before login will work:

- [ ] Account exists (sign up first!)
- [ ] `DATABASE_URL` set in Vercel
- [ ] `NEXTAUTH_SECRET` set in Vercel (32+ chars)
- [ ] `NEXTAUTH_URL` set to your Vercel URL
- [ ] `APP_URL` set to your Vercel URL
- [ ] Database tables created (we did this with `npx prisma db push`)
- [ ] Latest deployment is live (wait 2-3 minutes after push)

---

## 🔍 Quick Diagnosis

Run these checks:

### Check 1: Does the account exist?
- Try signing up with the email first
- If signup says "Email already registered", then the account exists

### Check 2: Are environment variables set?
```bash
# In Vercel Dashboard
Settings → Environment Variables

Should see:
✅ DATABASE_URL
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ APP_URL
```

### Check 3: Is the deployment fresh?
- Check deployment timestamp in Vercel
- Should be from the last few minutes
- If old, trigger a new deployment

---

## 🚀 Force New Deployment

If environment variables were just added:

### Option 1: Redeploy in Vercel
1. Go to **Deployments** tab
2. Click **"⋯"** on latest deployment
3. Click **"Redeploy"**

### Option 2: Push to GitHub
```bash
cd "/Users/vijay.chouhan/Documents/Login Auth"
git commit --allow-empty -m "Trigger rebuild"
git push origin master
```

---

## 💡 Most Common Solution

**99% of the time, this is the issue:**

You're trying to login with an account that **doesn't exist yet**.

**Solution:**
1. Go to `/signup`
2. Create an account
3. Then login with those credentials

---

## 🆘 Still Not Working?

If login still fails after:
- ✅ Creating an account via signup
- ✅ Setting all environment variables
- ✅ Waiting for deployment to complete

Then check the Vercel function logs for the specific error message and share it for more help.

---

## 📖 Related Guides

- `SIGNUP_TROUBLESHOOTING.md` - How to fix signup issues
- `DEPLOYMENT_QUICK_START.md` - Complete deployment guide
- `DATABASE_SETUP.md` - Database configuration help
