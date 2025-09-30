# QueueFree Build Guide

## 🚀 Building Your Project

### Quick Build Commands

```bash
# Install dependencies (first time only)
npm install

# Development server
npm run dev

# Build for production
npm run build

# Clean build directory
npm run clean

# Build and prepare for deployment
npm run deploy
```

## 📦 Build Options

### Option 1: Node.js Build (Recommended)
```bash
npm run build
```
This creates a `dist/` folder with all optimized files ready for deployment.

### Option 2: Manual Build (Windows)
```cmd
build.bat
```

### Option 3: Manual Build (Linux/Mac)
```bash
chmod +x build.sh
./build.sh
```

## 🌐 Deployment Ready Files

After building, your `dist/` folder contains:

- `index.html` - Main application file
- `css/` - Stylesheets
- `js/` - JavaScript files
- `assets/` - Images and icons
- `server.js` - Node.js server (for Render)
- `package.json` - Dependencies
- `.htaccess` - Apache server configuration
- `_redirects` - Netlify configuration

## 🚢 Deploy to Different Platforms

### Render.com
1. Push code to GitHub
2. Connect repository to Render
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Deploy from `dist/` directory

### Netlify
1. Run `npm run build`
2. Drag & drop the `dist/` folder to Netlify
3. Or connect GitHub repository

### Vercel
1. Run `npm run build`
2. Deploy the `dist/` folder
3. Or use Vercel CLI: `vercel deploy dist/`

### Traditional Web Hosting
1. Run `npm run build`
2. Upload contents of `dist/` folder via FTP
3. Point domain to uploaded directory

## 🔧 Customizing the Build

Edit `build.js` to:
- Add file minification
- Optimize images
- Bundle JavaScript files
- Add more deployment configurations

## 📁 Project Structure After Build

```
dist/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
├── server.js
├── package.json
├── .htaccess
└── _redirects
```
