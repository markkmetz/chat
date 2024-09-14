#!/bin/bash
cd /github/chat
git pull origin main

if [ "$(git diff --name-only HEAD@{1} HEAD)" != "" ]; then
    echo "Changes detected. Building the project..."
    npm run build
    cp -r /github/build/* /var/www/html/
    echo "Build and deployment completed."
else
    echo "No changes detected."
fi
