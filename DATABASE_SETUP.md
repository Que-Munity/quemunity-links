# Production Database Setup Scripts

## 1. PlanetScale Setup (Recommended)

### Step 1: Create PlanetScale Database
```bash
# Install PlanetScale CLI
npm install -g @planetscale/cli

# Login to PlanetScale
pscale auth login

# Create database
pscale database create que-munity

# Create development branch
pscale branch create que-munity development

# Get connection string
pscale connect que-munity development --port 3309
```

### Step 2: Update Prisma Schema for Production
```prisma
// Update prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Step 3: Environment Variables
```env
# Add to .env.production
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/que-munity?sslaccept=strict"
```

## 2. Supabase Setup (Alternative)

### Step 1: Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local development
supabase start
```

### Step 2: Update Prisma for PostgreSQL
```prisma
// Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Supabase Environment Variables
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

## 3. Migration Commands

### For PlanetScale:
```bash
# Generate Prisma client
npx prisma generate

# Push schema (PlanetScale doesn't use migrations)
npx prisma db push

# Seed data
npm run seed
```

### For PostgreSQL (Supabase/Railway):
```bash
# Create and run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# Seed data
npm run seed
```

## 4. Production Seed Script
```typescript
// Create scripts/seed-production.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  await prisma.category.createMany({
    data: [
      { name: 'Brisket', slug: 'brisket' },
      { name: 'Ribs', slug: 'ribs' },
      { name: 'Pulled Pork', slug: 'pulled-pork' },
      { name: 'Chicken', slug: 'chicken' },
      { name: 'Sausage', slug: 'sausage' },
    ]
  })

  // Create sample admin user
  await prisma.user.create({
    data: {
      email: 'admin@quminity.app',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      // Add hashed password
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```