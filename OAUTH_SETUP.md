# OAuth Setup Guide for Que-Munity

This guide will help you set up Google and GitHub OAuth authentication for your Que-Munity site.

## 🎯 **What's Been Implemented**

✅ **Unified Authentication Page**: Single "Sign In / Sign Up" page at `/auth/signin`  
✅ **Google OAuth**: Login with Google accounts  
✅ **GitHub OAuth**: Login with GitHub accounts  
✅ **Email/Password**: Traditional email/password authentication  
✅ **Clean UI**: No test signup content, professional authentication flow  

## 🔧 **Setup Instructions**

### 1. **Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add your authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
7. Copy your Client ID and Client Secret

### 2. **GitHub OAuth Setup**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Que-Munity
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`
4. Copy your Client ID and Client Secret

### 3. **Environment Variables**

Add these to your Vercel environment variables or `.env.local` file:

```bash
# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Database (your existing connection)
DATABASE_URL="your-database-connection-string"
```

### 4. **Generate NEXTAUTH_SECRET**

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 🚀 **Current Features**

### **Authentication Methods**
- **Google**: Users can sign in with their Google accounts
- **GitHub**: Users can sign in with their GitHub accounts  
- **Email/Password**: Traditional signup and login
- **Unified Flow**: Single page handles both sign in and sign up

### **User Experience**
- **Clean Interface**: Professional OAuth buttons with icons
- **Responsive Design**: Works on all devices
- **Error Handling**: Clear error messages for failed attempts
- **Loading States**: Proper feedback during authentication
- **Auto-redirect**: Users are redirected after successful login

### **Navigation Updates**
- **Single Button**: "Sign In / Sign Up" instead of separate buttons
- **Consistent Links**: All auth links point to new unified page

## 📋 **What You Need to Do**

1. **Set up OAuth apps** in Google and GitHub (see setup instructions above)
2. **Add environment variables** to your Vercel deployment
3. **Test the authentication** with your OAuth apps
4. **Optional**: Customize the styling or add more providers (Discord, Twitter, etc.)

## 🎉 **Benefits**

✅ **Professional Authentication**: Industry-standard OAuth providers  
✅ **User Convenience**: Users can sign in with existing accounts  
✅ **Security**: OAuth handles password security for you  
✅ **Clean UX**: Single sign-in page instead of cluttered options  
✅ **Easy Management**: All authentication in one place  

Your Que-Munity site now has professional-grade authentication! Users can sign in with Google, GitHub, or create traditional accounts, all from one clean interface.