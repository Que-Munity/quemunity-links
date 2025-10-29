# 🔐 Social Login Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

### Google OAuth
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Facebook OAuth  
```env
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
```

### GitHub OAuth
```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `https://quminity.app/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Set redirect URI: `https://quminity.app/api/auth/callback/facebook`
5. Copy App ID and App Secret

### 3. GitHub OAuth Setup
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `https://quminity.app/api/auth/callback/github`
4. Copy Client ID and Client Secret

### 4. Email Configuration (Optional)
For email verification and password reset:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=noreply@quminity.app
```

## Features Enabled:
- ✅ Google Sign-in
- ✅ Facebook Sign-in  
- ✅ GitHub Sign-in
- ✅ Email/Password Login
- ✅ Automatic account linking
- ✅ Session management
- ✅ User profile sync

## Next Steps:
1. Add environment variables
2. Run database migration: `npx prisma migrate dev`
3. Deploy to production
4. Test social logins