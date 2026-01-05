# Database Setup

## Current Configuration: SQLite (Development)

Your application is currently configured to use **SQLite** for quick local development. The database file is located at `prisma/dev.db`.

### ✅ What's Working Now

- ✅ Database is set up and ready
- ✅ All tables created
- ✅ App should be running without errors
- ✅ You can test signup, login, and all features

---

## Switching to PostgreSQL (Recommended for Production)

While SQLite is great for development, you should switch to PostgreSQL for production or if you want a more robust setup.

### Option 1: Neon (Recommended - Free Cloud Database)

1. **Sign up at [https://neon.tech](https://neon.tech)** (free, no credit card)
2. **Create a new project**
3. **Copy your connection string** (looks like: `postgresql://username:password@host.neon.tech/dbname?sslmode=require`)
4. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. **Update `.env` file:**
   ```env
   DATABASE_URL="your-neon-connection-string-here"
   ```
6. **Run migrations:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```
7. **Restart your dev server**

### Option 2: Local PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   # Fix Homebrew permissions first if needed
   sudo chown -R $(whoami) ~/homebrew/Cellar
   
   # Install PostgreSQL
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Create database:**
   ```bash
   createdb scheduling_mvp
   ```

3. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update `.env` file:**
   ```env
   DATABASE_URL="postgresql://localhost:5432/scheduling_mvp"
   ```

5. **Run migrations:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Restart your dev server**

---

## Database Management Commands

```bash
# View database in browser (Prisma Studio)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset
```

---

## Current Status

✅ **Your app is now running with SQLite!**

Visit: [http://localhost:3000](http://localhost:3000)

You can:
- Sign up for an account
- Create event types
- Set availability
- Test bookings
- All features work!

When you're ready for production or want more features, switch to PostgreSQL using the instructions above.

