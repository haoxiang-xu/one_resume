#!/bin/bash
# filepath: /Users/red/Desktop/GITRepo/one_resume/shell/config_PROD.sh

echo "🔧 Updating configuration for local development..."

# Step 1: Update .env file with local MongoDB URL
echo "📝 Updating .env with local MongoDB..."
sed -i '' 's|MONGODB_URL="mongodb://.*"|MONGODB_URL="mongodb://admin_0001:WNB231_M2B3J1_0AN2KS_2NDI34_9X1MDO_O27CBS_0H6C4J_P4NG7S_PNGH76_0M1FTB_IBRVFD_PZQAS3_H767FV@database:27017/one_resume_db"|' ../backend/.env

# Step 2: Update container.js with localhost:8888
echo "📝 Updating container.js root_url..."
sed -i '' 's|const root_url = .*|const root_url = "/";|' ../frontend/src/CONTAINERs/request/container.js

echo "✅ Configuration updated successfully!"
echo "📊 MongoDB URL: mongodb://admin_0001:WNB231_M2B3J1_0AN2KS_2NDI34_9X1MDO_O27CBS_0H6C4J_P4NG7S_PNGH76_0M1FTB_IBRVFD_PZQAS3_H767FV@database:27017/one_resume_db"
echo "🌐 API URL: /"