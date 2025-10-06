# 📁 COMPLETE FILE STRUCTURE FOR GLORIOUSTWINS RADIO

## 🗂️ PROJECT ROOT STRUCTURE

```
glorioustwins-radio/
├── app/                          # Next.js 13+ App Directory
│   ├── layout.tsx               ✅ (provided)
│   ├── page.tsx                 ✅ (main home page)
│   ├── robots.ts                ✅ (provided)
│   ├── sitemap.ts               ✅ (provided)
│   ├── manifest.ts              ✅ (provided)
│   ├── globals.css              📝 (create - global styles)
│   ├── about/
│   │   └── page.tsx             📝 (create - about page)
│   ├── schedule/
│   │   └── page.tsx             📝 (create - schedule page)
│   └── privacy/
│       └── page.tsx             📝 (create - privacy policy page)
├── components/                   # React Components
│   ├── ui/
│   │   ├── Logo.tsx             ✅ (provided)
│   │   └── ThemeToggle.tsx      ✅ (provided)
│   ├── navigation/
│   │   ├── Navigation.tsx       ✅ (provided)
│   │   └── MobileMenu.tsx       ✅ (provided)
│   ├── sections/
│   │   ├── HeroSection.tsx      ✅ (provided)
│   │   ├── ScheduleSection.tsx  ✅ (provided)
│   │   ├── TeamSection.tsx      ✅ (provided)
│   │   └── Footer.tsx           ✅ (provided)
│   └── player/
│       ├── LivePlayer.tsx       ✅ (provided)
│       └── MobilePlayer.tsx     ✅ (provided)
├── hooks/                        # Custom React Hooks
│   ├── useNowPlaying.ts         ✅ (provided)
│   └── useTheme.ts              ✅ (provided)
├── types/
│   └── index.ts                 ✅ (provided)
├── data/
│   └── siteMetaData.ts          ✅ (provided)
├── public/                       # Static Assets
│   ├── icons/                   📁 (create all icons below)
│   ├── presenters/              📁 (create presenter images)
│   ├── images/                  📁 (create additional images)
│   └── studio-bg.jpg            🖼️ (create - hero background)
├── package.json                  📝 (update with dependencies)
├── tailwind.config.js           📝 (create - Tailwind configuration)
├── tsconfig.json                📝 (create - TypeScript config)
└── next.config.js               📝 (create - Next.js config)
```

## 🎨 ICONS FOLDER STRUCTURE

Create these exact icon files in `public/icons/`:

### Favicon Files (Required)

```
public/icons/
├── favicon.ico                  📝 16x16, 32x32, 48x48 multi-size
├── favicon-16x16.png            📝 16x16px PNG
├── favicon-32x32.png            📝 32x32px PNG
├── favicon-96x96.png            📝 96x96px PNG
└── safari-pinned-tab.svg        📝 SVG monochrome icon
```

### Apple Touch Icons (iOS/Safari)

```
public/icons/
├── apple-touch-icon.png         📝 180x180px (main)
├── apple-icon-57x57.png         📝 57x57px
├── apple-icon-60x60.png         📝 60x60px
├── apple-icon-72x72.png         📝 72x72px
├── apple-icon-76x76.png         📝 76x76px
├── apple-icon-114x114.png       📝 114x114px
├── apple-icon-120x120.png       📝 120x120px
├── apple-icon-144x144.png       📝 144x144px
├── apple-icon-152x152.png       📝 152x152px
└── apple-icon-180x180.png       📝 180x180px
```

### Android/Chrome Icons

```
public/icons/
├── android-icon-36x36.png       📝 36x36px
├── android-icon-48x48.png       📝 48x48px
├── android-icon-72x72.png       📝 72x72px
├── android-icon-96x96.png       📝 96x96px
├── android-icon-144x144.png     📝 144x144px
├── android-icon-192x192.png     📝 192x192px (PWA main)
└── android-icon-512x512.png     📝 512x512px (PWA large)
```

### Microsoft/Windows Icons

```
public/icons/
├── ms-icon-70x70.png            📝 70x70px
├── ms-icon-144x144.png          📝 144x144px
├── ms-icon-150x150.png          📝 150x150px
├── ms-icon-310x150.png          📝 310x150px (wide tile)
├── ms-icon-310x310.png          📝 310x310px (large tile)
└── browserconfig.xml            📝 Microsoft browser config
```

### PWA Shortcut Icons (Optional but Recommended)

```
public/icons/
├── play-icon-96x96.png          📝 Play button icon for "Listen Live" shortcut
├── schedule-icon-96x96.png      📝 Calendar icon for "Schedule" shortcut
└── microphone-icon-96x96.png    📝 Mic icon for radio branding
```

## 🖼️ IMAGES FOLDER STRUCTURE

### Presenter Images (Update paths in your components)

```
public/presenters/
├── logo.jpg                     🖼️ Station logo (square format, 400x400px min)
├── taiwo.jpg                    🖼️ Olalere Taiwo (Chairman)
├── prep1.jpg                    🖼️ M Crown (Studio ENGR/OAP)
├── prep2.jpg                    🖼️ Temitope Raifu (OAP)
└── prep3.jpg                    🖼️ Oloyode Abolaji Faruq (Manager/OAP)
```

### Additional Images

```
public/images/
├── studio-bg.jpg                🖼️ Hero section background (1920x1080px min)
├── og-image.jpg                 🖼️ Social media sharing image (1200x630px)
├── studio-interior.jpg          🖼️ Studio photos for about page
├── team-photo.jpg               🖼️ Group photo of entire team
└── equipment-photo.jpg          🖼️ Radio equipment/studio setup
```

## 📝 CONFIGURATION FILES TO CREATE

### 1. package.json (Update dependencies)

```json
{
  "name": "glorioustwins-radio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### 2. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
    },
  },
  plugins: [],
};
```

### 3. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["stream.zeno.fm"], // Add your streaming domain
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/icons/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 6. browserconfig.xml (in public/icons/)

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/icons/ms-icon-70x70.png"/>
            <square150x150logo src="/icons/ms-icon-150x150.png"/>
            <square310x310logo src="/icons/ms-icon-310x310.png"/>
            <TileColor>#059669</TileColor>
        </tile>
    </msapplication>
</browserconfig>
```

## 📱 ADDITIONAL PAGES TO CREATE

### 1. app/about/page.tsx

```typescript
// About page with station history, mission, vision
export default function AboutPage() {
  /* content */
}
```

### 2. app/schedule/page.tsx

```typescript
// Full programming schedule page
export default function SchedulePage() {
  /* content */
}
```

### 3. app/privacy/page.tsx

```typescript
// Privacy policy page
export default function PrivacyPage() {
  /* content */
}
```

### 4. app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom radio player styles */
/* Dark mode variables */
/* Animation classes */
```

## 🚀 RECOMMENDED TOOLS FOR CREATING ICONS

### Icon Generation Tools:

1. **Favicon.io** - https://favicon.io/ (Free)
2. **RealFaviconGenerator** - https://realfavicongenerator.net/ (Free)
3. **PWA Builder** - https://www.pwabuilder.com/ (Microsoft, Free)
4. **Canva** - For creating branded icons and social images

### Image Optimization:

1. **TinyPNG** - Compress images
2. **Squoosh** - Google's image optimization tool
3. **ImageOptim** - Mac app for optimization

## ✅ DEPLOYMENT CHECKLIST

Before going live, ensure you have:

- [ ] All icon files created and properly sized
- [ ] Presenter photos optimized and cropped
- [ ] Hero background image (studio-bg.jpg) added
- [ ] Updated siteMetaData.ts with real URLs and social handles
- [ ] Google Search Console verification code added
- [ ] Analytics tracking implemented
- [ ] Domain configured in next.config.js
- [ ] All components tested on mobile and desktop
- [ ] Audio streaming tested across different devices
- [ ] PWA installation tested on mobile devices

## 📋 PRIORITY ORDER FOR CREATION

1. **Critical (Launch blockers):**

   - favicon.ico, favicon-16x16.png, favicon-32x32.png
   - apple-touch-icon.png
   - android-icon-192x192.png, android-icon-512x512.png
   - studio-bg.jpg
   - All presenter images (logo.jpg, taiwo.jpg, prep1.jpg, prep2.jpg, prep3.jpg)

2. **Important (SEO & sharing):**

   - og-image.jpg (1200x630px for social media)
   - All remaining apple-icon-\*.png files
   - browserconfig.xml

3. **Nice to have (Enhanced experience):**
   - PWA shortcut icons (play-icon-96x96.png, schedule-icon-96x96.png)
   - Additional studio photos
   - Microsoft tile icons

This comprehensive structure will give you a professional, SEO-optimized radio station website with PWA capabilities! 🎙️📻
