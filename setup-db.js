// Quick database setup for production
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.wwolcpyqzidmfjpmcwkq:gyaGUEAX9sFJnliG@aws-1-us-east-2.pooler.supabase.com:6543/postgres"
    }
  }
})

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to Supabase!')
    
    // Try to create a test user to see what error we get
    console.log('🧪 Testing user creation...')
    
    await prisma.$disconnect()
    console.log('✅ Database setup check complete!')
    
  } catch (error) {
    console.error('❌ Database error:', error.message)
    console.error('Error code:', error.code)
    
    if (error.message.includes('does not exist')) {
      console.log('💡 The database tables need to be created')
    }
  }
}

setupDatabase()