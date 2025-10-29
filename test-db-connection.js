const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres.wwolcpyqzidmfjpmcwkq:gyaGUEAX9sFJnliG@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing connection...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
  }
}

testConnection();