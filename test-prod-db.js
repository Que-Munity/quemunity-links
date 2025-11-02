// Test production DB connection
import { Client } from 'pg';

async function testProdDB() {
  const prodDbUrl = "postgresql://postgres.wwolcpyqzidmfjpmcwkq:gyaGUEAX9sFJnliG@aws-1-us-east-2.pooler.supabase.com:6543/postgres";
  
  const client = new Client({
    connectionString: prodDbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Production DB connected successfully!');
    
    // Test the new columns exist
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('display_name', 'name', 'phone', 'birthday')
    `);
    
    console.log('✅ New columns found:', result.rows);
    
    await client.end();
  } catch (error) {
    console.error('❌ Production DB connection failed:', error.message);
  }
}

testProdDB();