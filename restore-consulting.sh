#!/bin/bash
# Danışmanlık sitesini geri getirme scripti
echo "Restoring consulting site..."
cp client/src/pages/home-consulting.tsx client/src/pages/home.tsx
echo "Consulting site restored successfully!"