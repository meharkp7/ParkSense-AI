#!/bin/bash

# ParkSense AI - Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting ParkSense AI..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "${YELLOW}⚠️  Python3 not found. Please install Python 3.9+${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "${YELLOW}⚠️  Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo "${BLUE}📦 Checking backend setup...${NC}"
if [ ! -d "backend/.venv" ]; then
    echo "${YELLOW}Creating Python virtual environment...${NC}"
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo "${BLUE}📦 Checking frontend setup...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "${BLUE}Starting servers...${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "${YELLOW}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "${BLUE}🐍 Starting backend server on http://localhost:8000${NC}"
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "${BLUE}⚛️  Starting frontend server on http://localhost:5173${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "${GREEN}✨ ParkSense AI is running!${NC}"
echo ""
echo "📍 Frontend: ${BLUE}http://localhost:5173${NC}"
echo "📍 Backend:  ${BLUE}http://localhost:8000${NC}"
echo "📍 API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "💡 Logs:"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""
echo "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for user interrupt
wait
