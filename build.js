const fs = require('fs');
const path = require('path');

console.log('🚀 Building QueueFree...');

// Create build directory (Render expects 'build' folder)
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Function to copy files recursively
function copyFiles(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyFiles(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

try {
    console.log('📁 Copying static files...');
    
    // Copy main files
    fs.copyFileSync('index.html', path.join(buildDir, 'index.html'));
    fs.copyFileSync('server.js', path.join(buildDir, 'server.js'));
    fs.copyFileSync('package.json', path.join(buildDir, 'package.json'));
    
    // Copy render.yaml if exists
    if (fs.existsSync('render.yaml')) {
        fs.copyFileSync('render.yaml', path.join(buildDir, 'render.yaml'));
    }
    
    // Copy directories
    const dirsToCopy = ['css', 'js', 'assets'];
    dirsToCopy.forEach(dir => {
        if (fs.existsSync(dir)) {
            copyFiles(dir, path.join(buildDir, dir));
        }
    });
    
    // Create a simple .htaccess for Apache servers
    const htaccess = `# QueueFree - Apache Configuration
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>`;
    
    fs.writeFileSync(path.join(buildDir, '.htaccess'), htaccess);
    
    // Create _redirects for Netlify
    const redirects = `# QueueFree - Netlify Configuration
/*    /index.html   200`;
    
    fs.writeFileSync(path.join(buildDir, '_redirects'), redirects);
    
    console.log('✅ Build completed successfully!');
    console.log('📦 Built files are in the "build" directory');
    console.log('🌐 Ready for deployment to:');
    console.log('   - Render (use build/ as root)');
    console.log('   - Netlify (drag & drop build/ folder)');
    console.log('   - Vercel (deploy build/ folder)');
    console.log('   - Any static hosting service');
    
    // List contents
    const files = fs.readdirSync(buildDir);
    console.log('\n📁 Built files:');
    files.forEach(file => {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        const type = stats.isDirectory() ? '📂' : '📄';
        console.log(`   ${type} ${file}`);
    });
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
