#!/bin/bash
# filepath: /Users/red/Desktop/GITRepo/one_resume/shell/config_PROD.sh

echo "🔧 Updating configuration for local development..."

# Step 1: Update .env file with local MongoDB URL
echo "📝 Updating .env with local MongoDB..."
sed -i '' 's|MONGODB_URL="mongodb://.*"|MONGODB_URL="mongodb://localhost:27017/one_resume_db"|' ../backend/.env

# Step 2: Update container.js with localhost:8888
echo "📝 Updating container.js root_url..."
sed -i '' 's|const root_url = .*|const root_url = "http://localhost:8888/";|' ../frontend/src/CONTAINERs/request/container.js

echo "✅ Configuration updated successfully!"
echo "📊 MongoDB URL: mongodb://localhost:27017/one_resume_db"
echo "🌐 API URL: http://localhost:8888/"