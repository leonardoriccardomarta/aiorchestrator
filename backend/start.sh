#!/bin/sh
# Startup script for Digital Ocean App Platform
# This runs AFTER build, when environment variables are available

echo "🔄 Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migrations failed"
  exit 1
fi

echo "🚀 Starting server..."
node complete-api-server.js

