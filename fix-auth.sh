#!/bin/bash

echo "🔧 Creating minimal working authentication system..."

# 1. Clean up broken files
echo "📁 Cleaning up..."
rm -rf "src/app/api/auth/[...nextauth]" 2>/dev/null || true
rm -rf "src/app/api/auth/register-disabled" 2>/dev/null || true
rm -rf "src/app/api/subscription-disabled" 2>/dev/null || true  
rm -rf "src/app/api/webhooks-disabled" 2>/dev/null || true
rm -rf "src/lib/auth.ts.disabled" 2>/dev/null || true
rm -rf ".next" 2>/dev/null || true

# 2. Create fresh users file
echo "👥 Creating fresh users database..."
cat > users.json << 'EOF'
[
  {
    "id": "user_001",
    "email": "test@example.com",
    "username": "testuser", 
    "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/GJLxroHxSVeWHlRK2",
    "firstName": "Test",
    "lastName": "User",
    "createdAt": "2025-09-30T00:00:00.000Z"
  },
  {
    "id": "user_002", 
    "email": "quemunity.service@gmail.com",
    "username": "quemunity",
    "password": "$2b$12$eEYn4IqevTgwFUtWsHpQ8.aIjc1sJGuCqEbHZkOLJpxpFMnr5hDiu",
    "firstName": "Que",
    "lastName": "Munity", 
    "createdAt": "2025-09-30T00:00:00.000Z"
  }
]
EOF

echo "✅ Setup complete!"
echo ""
echo "🎯 Ready to test:"
echo "1. Email: test@example.com | Password: password123"  
echo "2. Email: quemunity.service@gmail.com | Password: Bears1022!"
echo ""
echo "🚀 Run: npm run dev"