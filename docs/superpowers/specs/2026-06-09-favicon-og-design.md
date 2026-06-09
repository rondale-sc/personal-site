# Favicon + OG Embed Metadata — Design Spec

**Date:** 2026-06-09  
**Status:** Approved

## Overview

Add a proper favicon and full Open Graph / Twitter Card metadata to jonathanjackson.dev. Every page gets a build-time-generated OG image using a split-layout template (keyboard icon + title/description). Content entries can optionally supply a `thumbnail` image that replaces the keyboard icon in the left panel.

---

## 1. Favicon

**What:** Replace the placeholder `public/favicon.svg` (currently a silhouette emoji) with a mini-keyboard SVG.

**Design:** Dark background (`#0f172a`), a 3-row grid of keys styled to match the site's dark theme, one key highlighted in accent blue (`#3b82f6`). Space bar row at the bottom. No text/initials — the keyboard shape is the icon.

**Implementation:**
- Overwrite `public/favicon.svg` with the new SVG markup.
- No changes to `Base.astro` — the existing `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` is sufficient.
- No PNG fallback required (SVG favicons are supported in all modern browsers; this is a personal site, not a product).

---

## 2. OG Meta Tags in `Base.astro`

**New props added to `Base.astro`:**

| Prop | Type | Default |
|------|------|---------|
| `ogImage` | `string` | `"/og/home.png"` |
| `ogType` | `string` | `"website"` |
| `canonicalUrl` | `string` | `Astro.url.href` |

**Tags rendered in `<head>`:**

```html
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
```

`ogImageAbsolute` is constructed from `Astro.site` + `ogImage` so the URL is fully qualified (required by OG spec). `Astro.site` must be set in `astro.config.mjs` to `https://jonathanjackson.dev`.

---

## 3. Build-Time OG Image Generation

**Packages:** `satori` (HTML/CSS → SVG) + `sharp` (SVG → PNG).

**Endpoint:** `src/pages/og/[slug].png.ts`

- Output: static 1200×630 PNG files at `/og/<slug>.png`
- `getStaticPaths` enumerates every page with its metadata
- `GET` renders the split-layout template and returns a PNG response

**Pages enumerated in `getStaticPaths`:**

| Slug | Title | Section | Source |
|------|-------|---------|--------|
| `home` | Jonathan Jackson | — | hardcoded |
| `resume` | Resume | — | hardcoded |
| `projects` | Projects | — | hardcoded |
| `interests` | Interests | — | hardcoded |
| `interests-radio` | Amateur Radio | Interests | hardcoded |
| `interests-reading` | Reading | Interests | hardcoded |
| `project-<id>` | project.data.title | Projects | `getCollection('projects')` — id has `.md` extension stripped |
| `radio-<id>` | entry.data.title | Radio | `getCollection('radio')` — id has `.md` extension stripped |
| `reading-<id>` | entry.data.title | Reading | `getCollection('reading')` — id has `.md` extension stripped |

**Template — split layout (1200×630):**

```
┌─────────────────────┬──────────────────────────────────────┐
│                     │                                      │
│   [keyboard icon]   │  SECTION LABEL (small, muted)        │
│   or [thumbnail]    │                                      │
│                     │  Page or Entry Title                 │
│  jonathanjackson    │  (large, white)                      │
│      .dev           │                                      │
│                     │  Short description text              │
│                     │  (small, slate-400)                  │
└─────────────────────┴──────────────────────────────────────┘
```

- Left panel: `#1e293b` background, keyboard icon SVG centered, domain label at bottom
- Right panel: `#0f172a` background, section in small monospace caps, title in large bold, description in slate
- Divider: `#334155` 1px border
- When `thumbnail` is set: the image fills the left panel (cover fit), domain label overlays at bottom with semi-transparent background

**Font:** Inter — install `@fontsource/inter` as a dev dependency. The endpoint reads `node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2` and `inter-latin-700-normal.woff2` at build time and passes them to satori's `fonts` option. Satori requires fonts to be provided explicitly; no system fonts are available.

---

## 4. Content Schema Updates

Add `thumbnail` field to all three content collections in `src/content.config.ts`:

```ts
thumbnail: z.string().optional(),
```

**Value format:** Absolute path from `public/` root, e.g. `"/images/og/my-project.jpg"`. When used in the satori endpoint, the file is read from disk (`public/` + path) and converted to a base64 data URI for embedding.

**Affected collections:** `projects`, `radio`, `reading`.

---

## 5. Page Updates

Each static `.astro` page passes `ogImage` to `Base`:

| Page | `ogImage` value |
|------|----------------|
| `index.astro` | `/og/home.png` |
| `resume.astro` | `/og/resume.png` |
| `projects/index.astro` | `/og/projects.png` |
| `interests/index.astro` | `/og/interests.png` |
| `interests/radio/index.astro` | `/og/interests-radio.png` |
| `interests/reading/index.astro` | `/og/interests-reading.png` |
| `projects/[slug].astro` | `/og/project-${project.id}.png` |

For content collections without a dedicated page (radio entries, reading entries), OG images are generated but pages don't exist yet — no change needed until those detail pages are built.

---

## 6. `astro.config.mjs` Change

Add `site: 'https://jonathanjackson.dev'` so `Astro.site` resolves correctly for absolute OG image URLs.

---

## Out of Scope

- Apple touch icon / manifest icons (can be added later)
- Per-section accent colours on the OG card (can be added later)
- Redirect from `www.jonathanjackson.dev` (DNS / Cloudflare config, not site code)
