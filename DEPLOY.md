# QueueFree Deployment Configuration

## 📁 Publish Directory: `dist/`

Your built files are in the `dist/` directory. This is what you deploy to hosting platforms.

## 🌐 Platform-Specific Configurations

### Netlify
```
Build command: npm run build
Publish directory: dist
```

### Render (Web Service)
```
Build command: npm install && npm run build
Start command: npm start
Root directory: / (or dist/ for static)
```

### Vercel
```
Build command: npm run build
Output directory: dist
Install command: npm install
```

### Firebase Hosting
Create `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### GitHub Pages
```
Build and deployment source: GitHub Actions
Build command: npm run build
Publish directory: dist/
```

## 🔧 Current Build Output

Your `dist/` folder contains:
- ✅ `index.html` - Main app
- ✅ `css/` - Stylesheets  
- ✅ `js/` - JavaScript files
- ✅ `assets/` - Images & icons
- ✅ `server.js` - Node.js server
- ✅ `package.json` - Dependencies
- ✅ `.htaccess` - Apache config
- ✅ `_redirects` - Netlify config

## 🚀 Quick Deploy Commands

### Deploy to Netlify (Manual)
1. Run: `npm run build`
2. Drag & drop `dist/` folder to Netlify

### Deploy to Render
1. Push to GitHub
2. Connect repo to Render
3. Set publish directory: `dist`

### Deploy to Vercel
```bash
npm run build
npx vercel deploy dist/
```
