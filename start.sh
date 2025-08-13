#!/bin/bash

echo "Installing dependencies and building backend..."
cd backend
bun install
bun run build
if [ $? -eq 0 ]; then
    bun run start &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
else
    echo "Backend setup failed"
    exit 1
fi

echo "Installing dependencies and building frontend..."
cd ../frontend
bun install
bun run build
if [ $? -eq 0 ]; then
    bun run start &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
else
    echo "Frontend setup failed"
    kill $BACKEND_PID
    exit 1
fi