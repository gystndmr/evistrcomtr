#!/bin/bash

echo "=== VERSION1 GERİ YÜKLEME BAŞLADI ==="

# Mevcut dosyaları backup yap
mkdir -p temp_backup
cp -r client temp_backup/ 2>/dev/null
cp -r server temp_backup/ 2>/dev/null  
cp -r shared temp_backup/ 2>/dev/null
cp package.json temp_backup/ 2>/dev/null
cp tsconfig.json temp_backup/ 2>/dev/null
cp vite.config.ts temp_backup/ 2>/dev/null
cp tailwind.config.ts temp_backup/ 2>/dev/null
cp postcss.config.js temp_backup/ 2>/dev/null
cp components.json temp_backup/ 2>/dev/null
cp drizzle.config.ts temp_backup/ 2>/dev/null
cp replit.md temp_backup/ 2>/dev/null

echo "Mevcut dosyalar yedeklendi..."

# Version1'i geri yükle
if [ -d "version1_backup" ]; then
    echo "Version1 backup bulundu, geri yükleniyor..."
    
    # Ana dosyaları geri yükle
    rm -rf client server shared
    cp -r version1_backup/client .
    cp -r version1_backup/server .
    cp -r version1_backup/shared .
    
    # Konfigürasyon dosyalarını geri yükle
    cp version1_backup/package.json .
    cp version1_backup/tsconfig.json .
    cp version1_backup/vite.config.ts .
    cp version1_backup/tailwind.config.ts .
    cp version1_backup/postcss.config.js .
    cp version1_backup/components.json .
    cp version1_backup/drizzle.config.ts .
    cp version1_backup/replit.md .
    
    echo "✅ VERSION1 BAŞARIYLA GERİ YÜKLENDI!"
    echo "🚀 Turkey E-Visa Application System aktif!"
    
else
    echo "❌ Version1 backup bulunamadı!"
    exit 1
fi

echo "=== VERSION1 GERİ YÜKLEME TAMAMLANDI ==="