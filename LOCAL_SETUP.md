# Local PostgreSQL Setup Guide

This guide will help you set up and connect to your local PostgreSQL database with automatic database and table creation.

## Prerequisites

1. **PostgreSQL installed** on your system
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **PostgreSQL service running**
   - Windows: Check in Services or start from pgAdmin
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

## Configuration

Your local database configuration is already set up in `.env.local`:

```env
DATABASE_URL="postgresql://postgres:irtaza20@localhost:5432/quemunity_dev"
```

**Configuration breakdown:**
- **Username:** `postgres` (default PostgreSQL user)
- **Password:** `irtaza20` (your password)
- **Host:** `localhost`
- **Port:** `5432` (default PostgreSQL port)
- **Database:** `quemunity_dev` (will be created automatically)

## Quick Start (Automatic Setup)

Run the automated setup script that will:
1. ✅ Create the database if it doesn't exist
2. ✅ Create all tables and columns from Prisma schema
3. ✅ Run any seed data (if available)

```bash
npm run db:setup
```

That's it! The script handles everything automatically.

## Manual Setup (Alternative)

If you prefer to run steps manually:

### Step 1: Create Database (Optional)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE quemunity_dev;

# Exit
\q
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Push Schema to Database
```bash
npx prisma db push
```

This command will create all tables, columns, indexes, and relationships defined in your Prisma schema.

### Step 4: Seed Database (Optional)
```bash
npm run db:seed
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | **Complete automatic setup** (recommended) |
| `npm run db:studio` | Open Prisma Studio to view/edit data |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:reset` | Reset database and rerun migrations |
| `npm run dev` | Start development server |

## Database Schema

Your database will include these tables:

### Core Tables
- **users** - User accounts and profiles
- **accounts** - OAuth provider accounts
- **sessions** - User sessions
- **recipes** - Recipe information
- **ingredients** - Ingredient catalog
- **recipe_ingredients** - Recipe-ingredient relationships
- **instructions** - Recipe step-by-step instructions

### Social Features
- **reviews** - User reviews
- **ratings** - Recipe ratings
- **comments** - User comments
- **favorites** - Favorited recipes
- **follows** - User follow relationships

### Collections & Planning
- **recipe_collections** - User recipe collections
- **meal_plans** - Meal planning
- **shopping_lists** - Shopping lists

### Monetization
- **subscriptions** - User subscriptions
- **recipe_views** - Recipe view tracking
- **creator_payouts** - Creator earnings
- **live_events** - Live cooking events

### Beta Testing
- **beta_testers** - Beta tester information
- **chat_messages** - Beta tester chat

## Verification

After setup, verify everything works:

### 1. Check Database Connection
```bash
npx prisma db push
```
Should output: "The database is already in sync with the Prisma schema."

### 2. View Database in Prisma Studio
```bash
npm run db:studio
```
Opens browser at `http://localhost:5555` to view all tables.

### 3. Check PostgreSQL Directly
```bash
psql -U postgres -d quemunity_dev -c "\dt"
```
Lists all tables in the database.

## Troubleshooting

### ❌ "Connection refused"
**Problem:** PostgreSQL is not running

**Solution:**
- Windows: Start PostgreSQL service from Services app
- Mac: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### ❌ "Authentication failed"
**Problem:** Wrong password or user doesn't exist

**Solution:**
1. Check password in `.env.local`
2. Reset PostgreSQL password:
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'irtaza20';
   ```

### ❌ "Database does not exist"
**Problem:** Database wasn't created

**Solution:** Run the setup script:
```bash
npm run db:setup
```

### ❌ "Port 5432 already in use"
**Problem:** Another service is using port 5432

**Solution:**
1. Check what's using the port:
   ```bash
   netstat -ano | findstr :5432  # Windows
   lsof -i :5432                 # Mac/Linux
   ```
2. Stop that service or change PostgreSQL port in `.env.local`

### ❌ "Prisma Client not found"
**Problem:** Prisma Client needs to be generated

**Solution:**
```bash
npx prisma generate
```

## Making Schema Changes

When you modify `prisma/schema.prisma`:

1. **Push changes to database:**
   ```bash
   npx prisma db push
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Or do both with setup:**
   ```bash
   npm run db:setup
   ```

## Environment Variables

Make sure `.env.local` exists with:

```env
# Required
DATABASE_URL="postgresql://postgres:irtaza20@localhost:5432/quemunity_dev"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-development-secret

# Optional (configure as needed)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Production vs Development

- **Development (Local):** Uses `.env.local` with local PostgreSQL
- **Production:** Uses `.env.production` with hosted database (Supabase/Railway/etc)

Never commit `.env.local` to version control!

## Next Steps

After database setup:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app:**
   ```
   http://localhost:3000
   ```

3. **View database:**
   ```bash
   npm run db:studio
   ```

## Support

If you encounter issues not covered here:
1. Check PostgreSQL logs
2. Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
3. Test connection: `psql -U postgres -d quemunity_dev`

---

**Ready to go!** 🚀 Run `npm run db:setup` and start building!
