# Que-Munity Production Deployment Guide

## 🎯 Deployment Checklist

### Phase 1: Database Migration
- [ ] Choose database provider (PlanetScale recommended)
- [ ] Update DATABASE_URL in production
- [ ] Run database migrations on production DB
- [ ] Seed initial data (categories, sample recipes)

### Phase 2: Environment Setup
- [ ] Set up production environment variables
- [ ] Configure NextAuth.js secrets
- [ ] Set up file storage (for recipe images)
- [ ] Configure email provider (for auth)

### Phase 3: Domain & Hosting
- [ ] Deploy to Vercel/Railway
- [ ] Configure custom domain (quminity.app)
- [ ] Set up SSL certificates (automatic with Vercel)
- [ ] Test all functionality in production

## 🔧 Required Environment Variables for Production

```env
# Database
DATABASE_URL="your-production-database-url"

# NextAuth.js
NEXTAUTH_URL="https://quminity.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Optional: Email provider for auth
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@quminity.app"

# Optional: File storage (AWS S3, Cloudinary, etc.)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🗄️ Database Provider Comparison

### PlanetScale (Recommended)
- **Cost**: Free tier available
- **Type**: MySQL-compatible
- **Pros**: Serverless, easy scaling, branching
- **Setup**: 5 minutes
- **Migration**: Simple Prisma migration

### Supabase
- **Cost**: Free tier available  
- **Type**: PostgreSQL
- **Pros**: Built-in auth, real-time, file storage
- **Setup**: 10 minutes
- **Migration**: Change provider in schema.prisma

### Railway
- **Cost**: $5/month minimum
- **Type**: PostgreSQL
- **Pros**: Simple, reliable
- **Setup**: 3 minutes
- **Migration**: Standard PostgreSQL migration

## 📦 Deployment Steps

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect Vercel to your repo
3. Add environment variables in Vercel dashboard
4. Deploy automatically
5. Add custom domain in Vercel settings

### Option 2: Railway
1. Connect Railway to GitHub repo
2. Add environment variables
3. Deploy with one click
4. Configure custom domain

## 🚨 Pre-deployment Tasks
- [ ] Test all authentication flows
- [ ] Verify all community features work
- [ ] Test recipe creation/viewing
- [ ] Ensure all BBQ tools function
- [ ] Check mobile responsiveness
- [ ] Test with production database