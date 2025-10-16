#\!/bin/bash

echo "🚀 Axiom Loom Deployment Script"
echo "================================"

# Kill existing processes
echo "🛑 Stopping existing services..."
pkill -f "node src/server.js" 2>/dev/null
pkill -f "serve -s build" 2>/dev/null
sleep 2

# Start backend server
echo "🔧 Starting backend server..."
cd /Users/lisasimon/repos/eyns-innovation-repos/eyns-ai-experience-center
node src/server.js > /tmp/axiom-backend.log 2>&1 &
BACKEND_PID=$\!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Serve frontend build
echo "🎨 Starting frontend server..."
npx serve -s build -l 3000 > /tmp/axiom-frontend.log 2>&1 &
FRONTEND_PID=$\!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check services
echo ""
echo "📊 Service Status:"
echo "-----------------"

# Check backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend API: Running on http://localhost:3001"
else
    echo "❌ Backend API: Not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Running on http://localhost:3000"
else
    echo "❌ Frontend: Not responding"
fi

echo ""
echo "🎉 Deployment Complete\!"
echo "========================"
echo "Access the application at: http://localhost:3000"
echo ""
echo "To stop services, run:"
echo "  pkill -f 'node src/server.js'"
echo "  pkill -f 'serve -s build'"
