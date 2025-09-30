@echo off
REM QueueFree Build Script for Windows

echo 🚀 Building QueueFree...

REM Create build directory
if not exist dist mkdir dist

REM Copy static files
echo 📁 Copying static files...
copy index.html dist\
xcopy css dist\css\ /E /I /Y
xcopy js dist\js\ /E /I /Y
xcopy assets dist\assets\ /E /I /Y

REM Copy server files for deployment
copy server.js dist\
copy package.json dist\
copy render.yaml dist\

echo ✅ Build completed! Files are in the 'dist' directory.
echo 🌐 Ready for deployment to Render, Netlify, or any static host.

dir dist
