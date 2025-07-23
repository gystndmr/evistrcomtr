#!/bin/bash

# Version1 Restore Script
# This script restores the complete Turkey E-Visa project to Version1 state
# All functionality preserved: visa applications, insurance, admin panel, emails, GPay integration

echo "🔄 Restoring Turkey E-Visa Project to Version1..."

# Backup current state before restore
if [ -d "current_backup" ]; then
    rm -rf current_backup
fi
mkdir -p current_backup
cp -r client current_backup/ 2>/dev/null
cp -r server current_backup/ 2>/dev/null
cp -r shared current_backup/ 2>/dev/null
cp package.json package-lock.json tailwind.config.ts postcss.config.js components.json tsconfig.json vite.config.ts drizzle.config.ts current_backup/ 2>/dev/null

echo "📦 Current state backed up to current_backup/"

# Restore Version1
if [ -d "version1_backup" ]; then
    echo "📁 Restoring from version1_backup..."
    
    # Remove current files
    rm -rf client server shared
    rm -f package.json package-lock.json tailwind.config.ts postcss.config.js components.json tsconfig.json vite.config.ts drizzle.config.ts
    
    # Restore Version1 files
    cp -r version1_backup/* .
    
    echo "✅ Version1 restored successfully!"
    echo "🔧 Please run: npm install"
    echo "🚀 Then run: npm run dev"
    echo ""
    echo "📋 Version1 Features Restored:"
    echo "   - Complete visa application system"
    echo "   - Travel insurance marketplace" 
    echo "   - Admin panel (/admin - password: admin123)"
    echo "   - SendGrid email system with PDF attachments"
    echo "   - GPay payment integration"
    echo "   - 6-language support (EN/TR/FR/DE/ES/AR)"
    echo "   - Professional transparent UI design"
    echo "   - Full customer data management"
    echo ""
else
    echo "❌ Error: version1_backup directory not found!"
    echo "Cannot restore Version1. Backup may be missing."
    exit 1
fi