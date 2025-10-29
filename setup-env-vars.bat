@echo off
echo Adding environment variables to Vercel...
echo.
echo Adding DATABASE_URL...
vercel env add DATABASE_URL production
echo.
echo Adding NEXTAUTH_URL...
vercel env add NEXTAUTH_URL production  
echo.
echo Adding NEXTAUTH_SECRET...
vercel env add NEXTAUTH_SECRET production
echo.
echo Environment variables added! Now deploying...
vercel --prod
echo.
echo Done! Your site should now work with user registration.
pause