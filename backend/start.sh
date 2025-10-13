#!/bin/sh
# Startup script for Digital Ocean App Platform
# This runs AFTER build, when environment variables are available

echo "🔄 Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate

if [ $? -eq 0 ]; then
  echo "✅ Database schema applied successfully"
else
  echo "❌ Database schema push failed"
  exit 1
fi

echo "🚀 Starting server..."
node complete-api-server.js

