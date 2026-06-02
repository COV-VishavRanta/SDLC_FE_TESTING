# Assets

This folder contains static assets that are imported directly into components for optimal caching and optimization.

## Why Assets Instead of Public?

**Assets folder (recommended):**

- ✅ Immutable caching (`Cache-Control: immutable`)
- ✅ Automatic optimization (WebP, responsive sizes)
- ✅ Content hash in filename (automatic cache busting)
- ✅ Automatic width/height detection
- ✅ Optional blur placeholder
- ✅ Tree-shakeable (unused assets excluded from build)

**Public folder:**

- ❌ No caching (`Cache-Control: public, max-age=0`)
- ❌ No automatic optimization
- ❌ Manual cache busting
- ❌ Manual dimensions
- ⚠️ Use only for: favicons, `robots.txt`, `sitemap.xml`, verification files

## Structure

```
src/assets/
├── logo.svg           # Main logo
├── logo-dark.svg      # Dark theme logo variant
├── login-bg.svg       # Login background image
└── README.md          # This file
```

## Usage

### Basic Image Import with Next.js Image Component

```tsx
import Image from 'next/image';
import logo from '@/assets/logo.svg';

export default function Header() {
  return (
    <Image
      src={logo}
      alt='POPLogic Logo'
      width={369}
      height={97}
      priority // Load immediately for above-the-fold content
    />
  );
}
```

### Background Images with Fill

```tsx
import Image from 'next/image';
import loginBg from '@/assets/login-bg.svg';

export default function LoginPage() {
  return (
    <div className='relative min-h-screen'>
      <Image src={loginBg} alt='' fill className='object-cover object-bottom' priority />
      {/* Your content */}
    </div>
  );
}
```

### With Blur Placeholder (for JPG/PNG only)

```tsx
import Image from 'next/image';
import heroImage from '@/assets/hero.jpg';

export default function Hero() {
  return (
    <Image
      src={heroImage}
      alt='Hero'
      width={1200}
      height={600}
      placeholder='blur' // Automatic blur placeholder
    />
  );
}
```

### Using with Regular img Tag (Less Optimal)

```tsx
import logo from '@/assets/logo.svg';

export default function Header() {
  return <img src={logo.src} alt='Logo' width={369} height={97} />;
}
```

## Image Properties

| Property             | Description           | When to Use                           |
| -------------------- | --------------------- | ------------------------------------- |
| `width` & `height`   | Explicit dimensions   | Known size images (logos, icons)      |
| `fill`               | Fill parent container | Backgrounds, responsive images        |
| `priority`           | Load immediately      | Above-the-fold images                 |
| `placeholder="blur"` | Blur-up effect        | JPG/PNG images (automatic)            |
| `quality`            | Image quality (1-100) | Default: 75, increase for hero images |

## File Organization

### What Goes in Assets?

- ✅ Logos and brand assets
- ✅ Background images
- ✅ Hero images and banners
- ✅ Product photos
- ✅ Illustrations and graphics
- ✅ Any image referenced in components

### What Goes in Public?

- ✅ `favicon.ico`
- ✅ `robots.txt`
- ✅ `sitemap.xml`
- ✅ SEO/metadata images (Open Graph)
- ✅ Verification files (`google-verification.html`)
- ✅ Files needing exact URLs

## Naming Conventions

- Use `kebab-case` for all asset files
- Be descriptive and specific
- Include variants in name: `logo-dark.svg`, `logo-light.svg`
- Avoid generic names: ❌ `image1.jpg` → ✅ `hero-dashboard.jpg`

**Examples:**

- `logo.svg`
- `logo-dark.svg`
- `login-background.svg`
- `hero-dashboard.jpg`
- `product-card-placeholder.png`

## Image Optimization Tips

1. **Use appropriate formats:**
   - SVG for logos, icons, illustrations
   - JPG for photos
   - PNG for images requiring transparency
   - WebP will be generated automatically by Next.js

2. **Optimize before importing:**
   - Compress images with tools like TinyPNG, ImageOptim
   - SVGs should be optimized with SVGO
   - Remove unnecessary metadata

3. **Responsive images:**
   - Let Next.js handle responsive sizes automatically
   - Use `fill` for fluid layouts
   - Use `sizes` prop for advanced control

4. **Performance:**
   - Use `priority` only for above-the-fold images
   - Lazy load below-the-fold images (default behavior)
   - Consider blur placeholders for better UX

## TypeScript

Assets imported have type definitions:

```tsx
import type { StaticImageData } from 'next/image';
import logo from '@/assets/images/logo.svg';

// logo is of type StaticImageData with properties:
// - src: string
// - height: number
// - width: number
// - blurDataURL?: string (for JPG/PNG)
```

## Related

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Components README](../components/README.md) - For SVG icon components
- [Next.js Instructions](.github/instructions/nextjs.instructions.md) - Project conventions
