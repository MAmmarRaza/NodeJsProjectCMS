#!/bin/bash

# Navigate to the project directory
cd /home/ubuntu/NodeJsProjectCMS

# Install dependencies if needed
echo "Installing npm dependencies..."
npm install || { echo "npm install failed"; exit 1; }

# Check if pm2 is installed and try to start the app
if ! command -v pm2 &> /dev/null
then
    echo "pm2 could not be found, installing..."
    npm install -g pm2
fi
