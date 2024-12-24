#!/bin/bash

# Create our working directory if it doesn't exist
DIR="/home/ubuntu/NodeJsProjectCMS"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir -p ${DIR} # Use -p to prevent errors if parent dirs are missing
fi

cd /home/ubuntu/NodeJsProjectCMS

# Check if pm2 is installed, if not, install it
if ! command -v pm2 &> /dev/null
then
    echo "pm2 could not be found, installing..."
    npm install -g pm2 # Install pm2 globally
fi

# Stop any previous instance of the app
pm2 delete index.js || echo "No previous pm2 process found."

# Start the application with pm2
pm2 start index.js --name "NodeJsProjectCMS" # Name the pm2 process for better identification
