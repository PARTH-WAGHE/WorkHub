# QueueFree Assets

This directory contains static assets for the QueueFree project.

## Structure

- `images/` - Local image files (logos, venue photos, etc.)
- `icons/` - Custom icon files (SVG, PNG, etc.)

## Usage

Currently, the project uses external CDN resources:
- Images from Unsplash API
- Icons from Heroicons (inline SVG)
- Fonts from Google Fonts

### Adding Local Assets

If you want to use local assets instead of CDN resources:

1. **Images**: Place image files in the `images/` folder and update image paths in `main.js`
2. **Icons**: Add custom icons to the `icons/` folder and update references in `index.html`

### Recommended Image Formats

- **Photos**: JPEG (for venue photos)
- **Logos**: SVG or PNG with transparency
- **Icons**: SVG for scalability

### Optimization

For better performance:
- Compress images before adding
- Use WebP format for modern browsers
- Optimize SVG files
- Consider using a build tool for asset optimization
