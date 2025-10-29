# Supabase Production Setup for Que-Munity

## 🚀 Your Setup Advantage
✅ Supabase account ready
✅ Vercel account ready  
✅ Domain (quminity.app) ready

## 📋 Quick Deployment Steps

### Step 1: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: "que-munity" 
4. Choose region (US East recommended)
5. Generate strong password
6. Wait for setup (2-3 minutes)

### Step 2: Get Connection Details
After project is ready:
1. Go to Settings → Database
2. Copy the "Connection string" 
3. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

### Step 3: Update Your Environment Variables
Create `.env.production` file:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"

# NextAuth (keep for now, can migrate to Supabase auth later)
NEXTAUTH_URL="https://quminity.app"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Optional: For file uploads
SUPABASE_SERVICE_KEY="your-service-role-key"
```

### Step 4: Run Migration Commands

```bash
# 1. Generate new Prisma client for PostgreSQL
npx prisma generate

# 2. Push your schema to Supabase
npx prisma db push

# 3. Seed initial data (optional)
npx prisma db seed
```

### Step 5: Deploy to Vercel
1. Push code to GitHub (with updated schema)
2. In Vercel dashboard, add environment variables
3. Redeploy automatically
4. Add custom domain (quminity.app)

## 🔄 Migration Benefits

**From SQLite to PostgreSQL:**
- ✅ Better performance for multiple users
- ✅ Real-time capabilities 
- ✅ Built-in user management
- ✅ File storage for images/videos
- ✅ Advanced search capabilities

## 🎯 Should You Delete Everything?

**Your Current Supabase:** 
- If it's empty/test data → **Yes, create fresh project**
- If it has important data → **Backup first, then migrate**

**Recommended:** Create a fresh Supabase project specifically for Que-Munity production.

## 🚨 Pre-Migration Checklist
- [ ] Backup current SQLite data (if needed)
- [ ] Create new Supabase project
- [ ] Update Prisma schema (✅ Done)
- [ ] Test locally with new database
- [ ] Deploy to Vercel with production DB
- [ ] Configure custom domain

## 🔥 Next Commands to Run

Ready to migrate? Run these:

```bash
# 1. Install Supabase CLI (optional, for easier management)
npm install -g @supabase/cli

# 2. Generate Prisma client for PostgreSQL  
npx prisma generate

# 3. Create migration (will create tables in Supabase)
npx prisma db push
```