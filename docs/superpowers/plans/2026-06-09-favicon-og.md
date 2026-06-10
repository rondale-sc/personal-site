# Favicon + OG Embed Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mini-keyboard favicon and build-time Open Graph / Twitter Card images to every page of jonathanjackson.dev.

**Architecture:** A single Astro static endpoint (`src/pages/og/[slug].png.ts`) generates 1200×630 PNG images at build time using `satori` (JSX → SVG) and `sharp` (SVG → PNG). `Base.astro` gains three new optional props (`ogImage`, `ogType`, `canonicalUrl`) and renders the full set of OG and Twitter Card meta tags. Every page passes its pre-computed OG image path.

**Tech Stack:** Astro 6 (static output), satori 0.10+, sharp, @fontsource/inter

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `public/favicon.svg` | Mini-keyboard icon |
| Modify | `astro.config.mjs` | Add `site` for absolute OG URLs |
| Modify | `src/layouts/Base.astro` | OG + Twitter Card meta tags |
| Create | `src/pages/og/[slug].png.ts` | Build-time OG image generation |
| Modify | `src/pages/index.astro` | Pass `ogImage` |
| Modify | `src/pages/resume.astro` | Pass `ogImage` |
| Modify | `src/pages/projects/index.astro` | Pass `ogImage` |
| Modify | `src/pages/projects/[slug].astro` | Pass `ogImage` |
| Modify | `src/pages/posts/index.astro` | Pass `ogImage` |
| Modify | `src/pages/posts/[slug].astro` | Pass `ogImage` |
| Modify | `src/pages/interests/index.astro` | Pass `ogImage` |
| Modify | `src/pages/interests/[slug].astro` | Pass `ogImage` |
| Modify | `src/pages/interests/dogs/index.astro` | Pass `ogImage` |
| Modify | `src/pages/interests/reading/index.astro` | Pass `ogImage` |

---

## Task 1: Favicon

**Files:**
- Modify: `public/favicon.svg`

- [ ] **Step 1: Replace favicon.svg with the keyboard design**

Overwrite `public/favicon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#0f172a"/>
  <!-- Row 1: 5 keys -->
  <rect x="10" y="22" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="26" y="22" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="42" y="22" width="13" height="13" rx="3" fill="#3b82f6" stroke="#60a5fa" stroke-width="1"/>
  <rect x="58" y="22" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="74" y="22" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <!-- Row 2: 5 keys -->
  <rect x="10" y="40" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="26" y="40" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="42" y="40" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="58" y="40" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <rect x="74" y="40" width="13" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
  <!-- Row 3: spacebar + key -->
  <rect x="10" y="58" width="42" height="13" rx="3" fill="#1e40af" stroke="#3b82f6" stroke-width="1"/>
  <rect x="58" y="58" width="29" height="13" rx="3" fill="#334155" stroke="#475569" stroke-width="1"/>
</svg>
```

- [ ] **Step 2: Verify it looks right in a browser**

Open the file in a browser or check the dev server:

```bash
cd /path/to/personal-site
npm run dev
```

Open `http://localhost:4321` and check the browser tab icon. Stop the dev server when done.

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: replace placeholder favicon with mini-keyboard design"
```

---

## Task 2: Site Config

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add `site` to astro.config.mjs**

Open `astro.config.mjs`. It currently reads:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

Change it to:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://jonathanjackson.dev',
});
```

- [ ] **Step 2: Run type check to confirm no errors**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: set site URL for absolute OG image URLs"
```

---

## Task 3: Install Packages

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1: Install satori, sharp, and @fontsource/inter**

```bash
npm install --save-dev satori sharp @fontsource/inter
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Verify sharp installed successfully**

Sharp uses native bindings. Confirm the install completed without errors:

```bash
node -e "const s = require('sharp'); console.log('sharp ok')"
```

Expected output: `sharp ok`

If you see a binding error, run `npm rebuild sharp`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add satori, sharp, @fontsource/inter for OG image generation"
```

---

## Task 4: OG Meta Tags in Base.astro

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Update Base.astro with OG props and meta tags**

Replace the entire contents of `src/layouts/Base.astro` with:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const {
  title,
  description = 'Personal website',
  ogImage = '/og/home.png',
  ogType = 'website',
  canonicalUrl = Astro.url.href,
} = Astro.props;

const ogImageAbsolute = new URL(ogImage, Astro.site).toString();
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{title}</title>

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImageAbsolute} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content={ogType} />
    <meta property="og:site_name" content="Jonathan Jackson" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageAbsolute} />

    <!-- Apply stored theme before first paint to prevent flash -->
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('theme');
        document.documentElement.setAttribute('data-theme', stored || 'light');
      })();
    </script>
  </head>
  <body>
    <header>
      <div class="header-inner">
        <Nav />
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <div class="footer-inner">
        <Footer />
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```

Expected: no errors. (Pages that don't pass `ogImage` will get the default `/og/home.png`.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add OG and Twitter Card meta tags to Base layout"
```

---

## Task 5: OG Image Endpoint

**Files:**
- Create: `src/pages/og/[slug].png.ts`

This endpoint generates a 1200×630 PNG for every page at build time. The split-layout template has a dark left panel (keyboard icon or thumbnail) and a right panel (section label, title, description).

**How satori works:** It accepts a tree of plain JavaScript objects (not JSX) that describe the layout, and returns an SVG string. `sharp` converts that SVG to PNG. All CSS must use satori's subset: flexbox for layout, pixel values as numbers, no grid, no `em`/`rem`.

- [ ] **Step 1: Create the src/pages/og/ directory and the endpoint file**

Create `src/pages/og/[slug].png.ts` with the following content:

```typescript
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPostSlug } from '../../lib/posts';

interface OgProps {
  title: string;
  description: string;
  section: string;
  thumbnail?: string;
}

export async function getStaticPaths() {
  const [projects, interests, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('interests'),
    getCollection('posts'),
  ]);

  const staticPages = [
    {
      params: { slug: 'home' },
      props: { title: 'Jonathan Jackson', description: 'Staff Software Engineer at LinkedIn. Amateur radio operator and builder of things.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'resume' },
      props: { title: 'Resume', description: 'Professional background and experience.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'projects' },
      props: { title: 'Projects', description: "Things I've built.", section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'posts' },
      props: { title: 'Posts', description: 'All posts across projects, radio, and writing.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'interests' },
      props: { title: 'Interests', description: "Things I'm into.", section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'interests-dogs' },
      props: { title: 'Furry Friends', description: 'Dogs past and present.', section: 'Interests' } satisfies OgProps,
    },
    {
      params: { slug: 'interests-reading' },
      props: { title: 'Reading', description: "Books I'm reading and have read.", section: 'Interests' } satisfies OgProps,
    },
  ];

  const projectPages = projects.map(p => ({
    params: { slug: `project-${p.id}` },
    props: { title: p.data.title, description: p.data.summary ?? '', section: 'Projects', thumbnail: p.data.thumbnail } satisfies OgProps,
  }));

  const interestPages = interests.map(i => ({
    params: { slug: `interest-${i.id}` },
    props: { title: i.data.title, description: i.data.description ?? '', section: 'Interests', thumbnail: i.data.thumbnail } satisfies OgProps,
  }));

  const postPages = posts
    .filter(p => !p.data.draft)
    .map(p => ({
      params: { slug: `post-${getPostSlug(p)}` },
      props: {
        title: p.data.title,
        description: p.data.summary ?? '',
        section: p.data.interest
          ? p.data.interest.charAt(0).toUpperCase() + p.data.interest.slice(1)
          : 'Projects',
        thumbnail: p.data.thumbnail,
      } satisfies OgProps,
    }));

  return [...staticPages, ...projectPages, ...interestPages, ...postPages];
}

// Read fonts once at module load (build-time only)
const fontRegular = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2')
);
const fontBold = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2')
);

function key(accent = false): object {
  return {
    type: 'div',
    props: {
      style: {
        width: 22,
        height: 22,
        backgroundColor: accent ? '#3b82f6' : '#334155',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: accent ? '#60a5fa' : '#475569',
      },
    },
  };
}

function keyRow(keys: object[]): object {
  return { type: 'div', props: { style: { display: 'flex', gap: 4 }, children: keys } };
}

const spacebarKey: object = {
  type: 'div',
  props: {
    style: {
      width: 62,
      height: 22,
      backgroundColor: '#1e40af',
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#3b82f6',
    },
  },
};

const keyboardIcon: object = {
  type: 'div',
  props: {
    style: { display: 'flex', flexDirection: 'column', gap: 5 },
    children: [
      keyRow([key(), key(), key(true), key(), key()]),
      keyRow([key(), key(), key(), key(), key()]),
      keyRow([spacebarKey, key()]),
    ],
  },
};

function buildOgElement(props: OgProps, thumbnailDataUri: string | undefined): object {
  const { title, description, section } = props;

  const domainLabel: object = {
    type: 'div',
    props: {
      style: { color: '#475569', fontSize: 11, fontFamily: 'Inter', letterSpacing: 2 },
      children: 'JONATHANJACKSON.DEV',
    },
  };

  const leftChildren: object[] = thumbnailDataUri
    ? [
        {
          type: 'img',
          props: {
            src: thumbnailDataUri,
            style: { position: 'absolute', top: 0, left: 0, width: 380, height: 630, objectFit: 'cover' },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: 'rgba(0,0,0,0.65)',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { color: '#94a3b8', fontSize: 11, fontFamily: 'Inter', letterSpacing: 2 },
                  children: 'JONATHANJACKSON.DEV',
                },
              },
            ],
          },
        },
      ]
    : [
        keyboardIcon,
        { type: 'div', props: { style: { marginTop: 20 }, children: [domainLabel] } },
      ];

  const rightChildren: object[] = [];

  if (section) {
    rightChildren.push({
      type: 'div',
      props: {
        style: {
          color: '#64748b',
          fontSize: 13,
          fontFamily: 'Inter',
          fontWeight: 400,
          letterSpacing: 3,
          marginBottom: 16,
        },
        children: section.toUpperCase(),
      },
    });
  }

  rightChildren.push({
    type: 'div',
    props: {
      style: {
        color: '#f1f5f9',
        fontSize: title.length > 30 ? 40 : 52,
        fontFamily: 'Inter',
        fontWeight: 700,
        lineHeight: 1.1,
        marginBottom: 20,
      },
      children: title,
    },
  });

  const truncatedDesc = description.length > 100 ? description.slice(0, 97) + '...' : description;
  if (truncatedDesc) {
    rightChildren.push({
      type: 'div',
      props: {
        style: { color: '#94a3b8', fontSize: 22, fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.4 },
        children: truncatedDesc,
      },
    });
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', width: 1200, height: 630, backgroundColor: '#0f172a' },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 380,
              height: 630,
              backgroundColor: '#1e293b',
              borderRightWidth: 1,
              borderRightStyle: 'solid',
              borderRightColor: '#334155',
              position: 'relative',
              overflow: 'hidden',
            },
            children: leftChildren,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 56px',
            },
            children: rightChildren,
          },
        },
      ],
    },
  };
}

export const GET: APIRoute = async ({ props }) => {
  const ogProps = props as OgProps;

  let thumbnailDataUri: string | undefined;
  if (ogProps.thumbnail) {
    const imgBuffer = readFileSync(join(process.cwd(), 'public', ogProps.thumbnail));
    const ext = ogProps.thumbnail.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    thumbnailDataUri = `data:${mime};base64,${imgBuffer.toString('base64')}`;
  }

  const element = buildOgElement(ogProps, thumbnailDataUri);

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```

Expected: no errors. If `@fontsource/inter` woff2 path causes a runtime error later (not a type error), see the troubleshooting note at the end of this task.

- [ ] **Step 3: Run a quick build to validate the endpoint generates files**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. Then check:

```bash
ls dist/og/ | head -10
```

Expected: a list of `.png` files like `home.png`, `resume.png`, `project-6502-breadboard-computer.png`, etc.

If the build fails because the font file path is wrong, check the actual path with:

```bash
ls node_modules/@fontsource/inter/files/ | grep "latin-400-normal"
```

Update the `readFileSync` paths in the endpoint to match.

- [ ] **Step 4: Commit**

```bash
git add src/pages/og/
git commit -m "feat: add build-time OG image generation endpoint"
```

---

## Task 6: Update Pages to Pass ogImage

**Files:** all 10 `.astro` page files.

For each page below, find the `<Base` tag and add the `ogImage` attribute shown. The other attributes on `<Base` stay exactly as they are.

- [ ] **Step 1: src/pages/index.astro**

Find:
```astro
<Base title="Jonathan Jackson" description="Staff Software Engineer at LinkedIn. Amateur radio operator and builder of things.">
```

Replace with:
```astro
<Base title="Jonathan Jackson" description="Staff Software Engineer at LinkedIn. Amateur radio operator and builder of things." ogImage="/og/home.png">
```

- [ ] **Step 2: src/pages/resume.astro**

Find:
```astro
<Base title="Resume" description="Professional background and experience.">
```

Replace with:
```astro
<Base title="Resume" description="Professional background and experience." ogImage="/og/resume.png">
```

- [ ] **Step 3: src/pages/projects/index.astro**

Find:
```astro
<Base title="Projects" description="Things I've built.">
```

Replace with:
```astro
<Base title="Projects" description="Things I've built." ogImage="/og/projects.png">
```

- [ ] **Step 4: src/pages/projects/[slug].astro**

Find:
```astro
<Base title={project.data.title} description={project.data.summary}>
```

Replace with:
```astro
<Base title={project.data.title} description={project.data.summary} ogImage={`/og/project-${project.id}.png`}>
```

- [ ] **Step 5: src/pages/posts/index.astro**

Find:
```astro
<Base title="Posts" description="All posts across projects, radio, and writing.">
```

Replace with:
```astro
<Base title="Posts" description="All posts across projects, radio, and writing." ogImage="/og/posts.png">
```

- [ ] **Step 6: src/pages/posts/[slug].astro**

Find:
```astro
<Base title={post.data.title}>
```

Replace with:
```astro
<Base title={post.data.title} description={post.data.summary} ogImage={`/og/post-${getPostSlug(post)}.png`}>
```

- [ ] **Step 7: src/pages/interests/index.astro**

Find:
```astro
<Base title="Interests" description="Things I'm into.">
```

Replace with:
```astro
<Base title="Interests" description="Things I'm into." ogImage="/og/interests.png">
```

- [ ] **Step 8: src/pages/interests/[slug].astro**

Find:
```astro
<Base title={interest.data.title} description={interest.data.description}>
```

Replace with:
```astro
<Base title={interest.data.title} description={interest.data.description} ogImage={`/og/interest-${interest.id}.png`}>
```

- [ ] **Step 9: src/pages/interests/dogs/index.astro**

Find:
```astro
<Base title="Furry Friends" description="Dogs past and present.">
```

Replace with:
```astro
<Base title="Furry Friends" description="Dogs past and present." ogImage="/og/interests-dogs.png">
```

- [ ] **Step 10: src/pages/interests/reading/index.astro**

Find:
```astro
<Base title="Reading" description="Books I'm reading and have read.">
```

Replace with:
```astro
<Base title="Reading" description="Books I'm reading and have read." ogImage="/og/interests-reading.png">
```

- [ ] **Step 11: Run type check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/pages/
git commit -m "feat: wire up per-page OG image paths across all pages"
```

---

## Task 7: Build Verification

- [ ] **Step 1: Run a full build**

```bash
npm run build
```

Expected: exits 0 with no errors.

- [ ] **Step 2: Spot-check OG image output**

```bash
ls dist/og/ | wc -l
```

Expected: at least 7 files (the static pages). The exact count depends on how many posts/projects/interests are in the content collections.

```bash
file dist/og/home.png
```

Expected: `dist/og/home.png: PNG image data, 1200 x 630, ...`

- [ ] **Step 3: Spot-check OG tags in generated HTML**

```bash
grep -A2 'og:image' dist/index.html
```

Expected output (URL will be absolute):
```
<meta property="og:image" content="https://jonathanjackson.dev/og/home.png"/>
```

- [ ] **Step 4: Preview locally and open in browser**

```bash
npm run preview
```

Open `http://localhost:4321`. Confirm the keyboard favicon appears in the browser tab.

Use a local OG debugger — paste `http://localhost:4321` into [opengraph.xyz](https://www.opengraph.xyz) or use [metatags.io](https://metatags.io) to simulate how a link preview would look (these tools can accept a local URL if you use a tunnel, or just inspect the tags via browser devtools instead).

To check the tags directly:
```bash
curl -s http://localhost:4321 | grep 'og:\|twitter:'
```

Expected: the full set of OG and Twitter Card tags with absolute URLs.

- [ ] **Step 5: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: verify OG image generation and favicon"
```
