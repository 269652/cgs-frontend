#!/bin/sh

echo "🚀 Starting Next.js server..."
npm run start &
NEXTJS_PID=$!

echo "⏳ Waiting for Next.js to be healthy..."
MAX_RETRIES=60
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Next.js is healthy and ready!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Attempt $RETRY_COUNT/$MAX_RETRIES - waiting for Next.js..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Next.js failed to start after $MAX_RETRIES attempts"
    kill $NEXTJS_PID
    exit 1
fi

# Extra wait to ensure everything is fully ready
echo "⏳ Waiting 5 more seconds for full initialization..."
sleep 5

echo "📸 Prefetching OG images..."
node prefetch-og-images.js

if [ $? -eq 0 ]; then
    echo "✅ OG images prefetched successfully!"
else
    echo "⚠️ OG image prefetch had some errors, but continuing..."
fi

echo "✨ Setup complete! Next.js is running."

# Keep the script running and forward signals to Next.js
wait $NEXTJS_PID
