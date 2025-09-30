#!/bin/bash

# QueueFree Build Script
echo "🚀 Building QueueFree..."

# Create build directory
mkdir -p dist

# Copy static files
echo "📁 Copying static files..."
cp index.html dist/
cp -r css dist/
cp -r js dist/
cp -r assets dist/

# Copy server files for deployment
cp server.js dist/
cp package.json dist/
cp render.yaml dist/

# Create a production index.html with minified CSS inline (optional)
echo "⚡ Optimizing files..."

echo "✅ Build completed! Files are in the 'dist' directory."
echo "🌐 Ready for deployment to Render, Netlify, or any static host."

ls -la dist/
