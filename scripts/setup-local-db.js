/**
 * Local PostgreSQL Database Setup Script
 * This script automatically creates the database if it doesn't exist
 * and runs all necessary migrations
 */

const { Client } = require('pg');
const { execSync } = require('child_process');

// PostgreSQL connection details
const DB_USER = 'postgres';
const DB_PASSWORD = 'irtaza20';
const DB_HOST = 'localhost';
const DB_PORT = 5432;
const DB_NAME = 'quemunity_dev';

// Build the DATABASE_URL
const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function createDatabaseIfNotExists() {
  // Connect to default 'postgres' database to create our database
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // Connect to default database
  });

  try {
    log('\n🔌 Connecting to PostgreSQL...', colors.blue);
    await client.connect();
    log('✅ Connected to PostgreSQL server', colors.green);

    // Check if database exists
    log(`\n🔍 Checking if database "${DB_NAME}" exists...`, colors.blue);
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (result.rows.length === 0) {
      log(`\n📦 Database "${DB_NAME}" does not exist. Creating...`, colors.yellow);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      log(`✅ Database "${DB_NAME}" created successfully!`, colors.green);
    } else {
      log(`✅ Database "${DB_NAME}" already exists`, colors.green);
    }

    await client.end();
    return true;
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);

    if (error.code === 'ECONNREFUSED') {
      log('\n💡 PostgreSQL server is not running. Please start PostgreSQL and try again.', colors.yellow);
      log('   On Windows: Check Services or start from pgAdmin', colors.yellow);
      log('   On Mac: brew services start postgresql', colors.yellow);
      log('   On Linux: sudo systemctl start postgresql', colors.yellow);
    } else if (error.code === '28P01') {
      log('\n💡 Authentication failed. Please check your password in the script.', colors.yellow);
    }

    await client.end().catch(() => {});
    return false;
  }
}

async function runPrismaMigrations() {
  try {
    // Set the DATABASE_URL environment variable for Prisma commands
    const env = { ...process.env, DATABASE_URL };

    log('\n🔄 Generating Prisma Client...', colors.blue);
    execSync('npx prisma generate', { stdio: 'inherit', env });
    log('✅ Prisma Client generated', colors.green);

    log('\n🔄 Running database migrations...', colors.blue);
    execSync('npx prisma db push', { stdio: 'inherit', env });
    log('✅ Database schema synchronized', colors.green);

    return true;
  } catch (error) {
    log(`\n❌ Migration error: ${error.message}`, colors.red);
    return false;
  }
}

async function seedDatabase() {
  try {
    // Set the DATABASE_URL environment variable for seed command
    const env = { ...process.env, DATABASE_URL };

    log('\n🌱 Seeding database with initial data...', colors.blue);
    execSync('npm run db:seed', { stdio: 'inherit', env });
    log('✅ Database seeded successfully', colors.green);
    return true;
  } catch (error) {
    log(`\n⚠️  Seeding skipped or failed: ${error.message}`, colors.yellow);
    log('   This is okay if no seed file exists yet', colors.yellow);
    return true; // Don't fail the whole setup if seeding fails
  }
}

async function main() {
  log('\n' + '='.repeat(60), colors.bright);
  log('  🚀 Quemunity Local Database Setup', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  log('Configuration:', colors.blue);
  log(`  • Host: ${DB_HOST}:${DB_PORT}`);
  log(`  • User: ${DB_USER}`);
  log(`  • Database: ${DB_NAME}`);
  log('');

  // Step 1: Create database
  const dbCreated = await createDatabaseIfNotExists();
  if (!dbCreated) {
    log('\n❌ Setup failed at database creation step', colors.red);
    process.exit(1);
  }

  // Step 2: Run migrations
  const migrationsSuccess = await runPrismaMigrations();
  if (!migrationsSuccess) {
    log('\n❌ Setup failed at migrations step', colors.red);
    process.exit(1);
  }

  // Step 3: Seed database (optional)
  await seedDatabase();

  // Success!
  log('\n' + '='.repeat(60), colors.bright);
  log('  ✨ Setup Complete!', colors.green + colors.bright);
  log('='.repeat(60), colors.bright);
  log('\n📝 Next steps:', colors.blue);
  log('  1. Run: npm run dev');
  log('  2. Visit: http://localhost:3000');
  log('  3. View database: npm run db:studio');
  log('');
}

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});
