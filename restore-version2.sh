#!/bin/bash

echo "Restoring Version2 (Clean Blue/Minimalist Design)..."

# Backup current state
mkdir -p current_backup
cp -r client/ server/ shared/ current_backup/ 2>/dev/null

# Restore Version2 files
cp -r version2_backup/client/ ./
cp -r version2_backup/server/ ./
cp -r version2_backup/shared/ ./
cp version2_backup/package.json ./
cp version2_backup/tsconfig.json ./
cp version2_backup/vite.config.ts ./
cp version2_backup/tailwind.config.ts ./
cp version2_backup/postcss.config.js ./
cp version2_backup/components.json ./
cp version2_backup/drizzle.config.ts ./

echo "✅ Version2 (Clean Blue/Minimalist Design) restored successfully!"
echo "Clean, professional design with blue accents and minimal styling"
echo "Run 'npm run dev' to start the application"