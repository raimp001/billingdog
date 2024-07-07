#!/bin/bash
# update_project.sh

# Stop the running server
echo "Stopping the server..."
pkill -f server.js

# Pull the latest code from the repository
echo "Pulling the latest code..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the server
echo "Starting the server..."
nohup node server.js > server.log 2>&1 &

echo "Project update completed."

