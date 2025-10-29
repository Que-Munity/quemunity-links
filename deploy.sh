#!/bin/bash

# Deployment script for quemunity.app

echo "🚀 Deploying Que-Munity to production..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 2. Generate Prisma client
echo "🔄 Generating Prisma client..."
npm run db:generate

# 3. Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# 4. Seed database (only run once)
echo "🌱 Seeding database..."
npm run db:seed

# 5. Build application
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at https://quemunity.app"