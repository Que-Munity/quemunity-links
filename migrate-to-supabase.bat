@echo off
echo 🚀 Que-Munity PostgreSQL Migration Script

echo.
echo Step 1: Generate Prisma client for PostgreSQL...
call npx prisma generate

echo.
echo Step 2: Push schema to Supabase database...
echo (This will create all tables in your Supabase project)
call npx prisma db push

echo.
echo Step 3: Seed the database with initial data...
call npm run db:seed

echo.
echo ✅ Migration complete! 
echo Your Supabase database is now ready for production.
echo.
echo Next steps:
echo 1. Test locally with: npm run dev
echo 2. Deploy to Vercel with production environment variables
echo 3. Configure your custom domain (quminity.app)

pause