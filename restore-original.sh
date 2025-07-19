#!/bin/bash
# Orijinal e-visa sitesini geri getirme scripti
echo "Restoring original e-visa site..."
cp .backup-home-original.tsx client/src/pages/home.tsx
echo "Original e-visa site restored successfully!"