# PWA Icons Setup

This folder needs two icon files for the PWA to work properly.

## Required Files

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

## Quick Setup Options

### Option 1: Online Generator (Easiest)

1. Visit: https://www.favicon-generator.org/
2. Upload your logo or create a simple design
3. Download the generated icons
4. Rename to `icon-192.png` and `icon-512.png`
5. Place in this folder

### Option 2: Design Tool

1. Open Canva, Figma, or Photoshop
2. Create 192x192 and 512x512 artboards
3. Add your app name/logo
4. Use brand colors (e.g., #3b82f6 for blue)
5. Export as PNG
6. Place in this folder

### Option 3: Simple Placeholder

Create a simple colored square with text:

**Using any image editor:**
- Background: #3b82f6 (blue)
- Text: "TM" or "Task Manager"
- Font: Bold, white color
- Center aligned

### Option 4: Use Existing Logo

If you have a logo:
1. Resize to 192x192 and 512x512
2. Ensure it looks good at both sizes
3. Save as PNG with transparency
4. Place in this folder

## Verification

After adding icons:

1. Start the app: `npm run dev`
2. Open Chrome DevTools (F12)
3. Go to Application > Manifest
4. Check if icons are loaded correctly
5. Try installing the PWA

## Tips

- Use transparent background for flexibility
- Ensure icons are clear at small sizes
- Use your brand colors
- Keep design simple and recognizable
- Test on both light and dark backgrounds

## Current Status

⚠️ **Icons not yet created**

Please create the icons before deploying to production.
