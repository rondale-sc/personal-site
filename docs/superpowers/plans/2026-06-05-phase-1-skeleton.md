# Personal Website Phase 1 — Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a deployable Astro site at `~/Code/rondale-sc` with all routes, content schemas, CI, and documentation in place — no real content, but a fully operational skeleton live at a Cloudflare Pages `.pages.dev` URL.

**Architecture:** Astro static site with four top-level nav items (Home, Projects, Interests, Resume). Interests are organized as a hub page with per-interest subdirectories, each backed by its own Astro content collection schema. No styling framework is locked in — Phase 1 uses minimal functional HTML.

**Tech Stack:** Astro 6, Cloudflare Pages, GitHub Actions, mise (Node version management)

**Spec:** `docs/superpowers/specs/2026-06-05-personal-website-design.md`

---

## File Map

Files created in this plan:

```
.mise.toml
.gitignore
package.json
astro.config.mjs
tsconfig.json
src/
  content.config.ts
  content/
    projects/.gitkeep
    interests/
      radio/.gitkeep
      reading/.gitkeep
  layouts/
    Base.astro
  components/
    Nav.astro
    Footer.astro
  styles/
    global.css
  pages/
    index.astro
    resume.astro
    projects/
      index.astro
      [slug].astro
    interests/
      index.astro
      radio/
        index.astro
      reading/
        index.astro
public/
  favicon.svg
.github/
  workflows/
    ci.yml
CLAUDE.md
docs/
  deployment.md
```

---

## Task 1: Install mise and initialize project config files

**Files:**
- Create: `.mise.toml`
- Create: `.gitignore`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Install mise**

```bash
curl https://mise.run | sh
# Then add mise to your shell (follow the printed instructions, typically):
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

Verify: `mise --version` prints a version number.

- [ ] **Step 2: Create `.mise.toml`**

```toml
[tools]
node = "22"
```

- [ ] **Step 3: Install Node via mise**

```bash
cd ~/Code/rondale-sc
mise install
```

Expected: mise downloads and activates Node 22.

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
```

- [ ] **Step 5: Create `package.json`**

```json
{
  "name": "rondale-sc",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro sync && astro check"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "astro": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 6: Create `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

- [ ] **Step 7: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 8: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 9: Verify Astro CLI works**

```bash
npx astro --version
```

Expected: prints Astro version (6.x).

- [ ] **Step 10: Commit**

```bash
git init
git add .mise.toml .gitignore package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "chore: initialize Astro project with mise"
```

---

## Task 2: Define content collection schemas

Content schemas are defined before pages so that page components are typed from the start.

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/.gitkeep`
- Create: `src/content/interests/radio/.gitkeep`
- Create: `src/content/interests/reading/.gitkeep`

- [ ] **Step 1: Create content directories**

```bash
mkdir -p src/content/projects
mkdir -p src/content/interests/radio
mkdir -p src/content/interests/reading
touch src/content/projects/.gitkeep
touch src/content/interests/radio/.gitkeep
touch src/content/interests/reading/.gitkeep
```

- [ ] **Step 2: Create `src/content.config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'completed', 'archived']),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

const radio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interests/radio' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    callsign: z.string().optional(),
    band: z.string().optional(),
    mode: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interests/reading' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['want-to-read', 'reading', 'finished']),
    genre: z.string(),
    year: z.number(),
    rating: z.number().min(1).max(5).optional(),
  }),
});

export const collections = { projects, radio, reading };
```

- [ ] **Step 3: Run `astro sync` to generate types**

```bash
npm run check
```

Expected: no errors. (Empty collections produce no type errors.)

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: define content collection schemas for projects, radio, reading"
```

---

## Task 3: Base layout and shared components

All pages use `Base.astro` as their shell. Nav and Footer are extracted as components so they can be updated independently.

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
}

a {
  color: inherit;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header, footer {
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

footer {
  border-top: 1px solid #e5e5e5;
  border-bottom: none;
  font-size: 0.875rem;
  color: #666;
}
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/interests', label: 'Interests' },
  { href: '/resume', label: 'Resume' },
];
const currentPath = Astro.url.pathname;
---
<nav>
  {links.map(link => (
    <a href={link.href} aria-current={currentPath === link.href ? 'page' : undefined}>
      {link.label}
    </a>
  ))}
</nav>

<style>
  nav {
    display: flex;
    gap: 1.5rem;
  }
  a {
    text-decoration: none;
    font-weight: 500;
  }
  a[aria-current="page"] {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<p>© {year} — built with <a href="https://astro.build">Astro</a></p>
```

- [ ] **Step 4: Create `src/layouts/Base.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Personal website' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{title}</title>
  </head>
  <body>
    <header>
      <Nav />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <Footer />
    </footer>
  </body>
</html>
```

- [ ] **Step 5: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">👤</text>
</svg>
```

- [ ] **Step 6: Verify types**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/components/ src/styles/ public/
git commit -m "feat: add Base layout, Nav, Footer components, and global styles"
```

---

## Task 4: Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Home" description="Personal website — amateur radio, reading, and projects.">
  <h1>Hi, I'm [Your Name]</h1>
  <p>
    Software developer, amateur radio operator, and occasional builder of things.
    This site is a work in progress — come back soon.
  </p>
  <ul>
    <li><a href="https://github.com/rondale-sc">GitHub</a></li>
    <li><a href="mailto:boiling-foot2u@icloud.com">Email</a></li>
  </ul>
</Base>
```

Note: Replace `[Your Name]` and the email/GitHub links with real values before publishing.

- [ ] **Step 2: Start dev server and verify page loads**

```bash
npm run dev
```

Open `http://localhost:4321` in a browser. Expected: page renders with nav (Home, Projects, Interests, Resume) and the placeholder bio.

- [ ] **Step 3: Stop dev server and run check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page stub"
```

---

## Task 5: Resume page

**Files:**
- Create: `src/pages/resume.astro`

- [ ] **Step 1: Create `src/pages/resume.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Resume" description="Professional background and experience.">
  <h1>Resume</h1>
  <p><em>Coming soon — full resume in progress.</em></p>

  <h2>Experience</h2>
  <p>—</p>

  <h2>Education</h2>
  <p>—</p>

  <h2>Skills</h2>
  <p>—</p>
</Base>
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev
```

Navigate to `http://localhost:4321/resume`. Expected: page renders with the stub structure and nav active on Resume.

- [ ] **Step 3: Run check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/resume.astro
git commit -m "feat: add resume page stub"
```

---

## Task 6: Projects pages

**Files:**
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`

- [ ] **Step 1: Create `src/pages/projects/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<Base title="Projects" description="Things I've built.">
  <h1>Projects</h1>
  {sorted.length === 0 ? (
    <p><em>Projects coming soon.</em></p>
  ) : (
    <ul>
      {sorted.map(project => (
        <li>
          <a href={`/projects/${project.id.replace(/\.mdx?$/, '')}`}>
            <strong>{project.data.title}</strong>
          </a>
          <span> — {project.data.summary}</span>
          <span> [{project.data.status}]</span>
        </li>
      ))}
    </ul>
  )}
</Base>
```

- [ ] **Step 2: Create `src/pages/projects/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    params: { slug: project.id.replace(/\.mdx?$/, '') },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---
<Base title={project.data.title} description={project.data.summary}>
  <h1>{project.data.title}</h1>
  <p>
    <time datetime={project.data.date.toISOString()}>
      {project.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </time>
    {' '}·{' '}
    <span>{project.data.status}</span>
    {project.data.tags.length > 0 && (
      <span> · {project.data.tags.join(', ')}</span>
    )}
  </p>
  <Content />
</Base>
```

- [ ] **Step 3: Run check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 4: Verify projects index in dev server**

```bash
npm run dev
```

Navigate to `http://localhost:4321/projects`. Expected: "Projects coming soon." empty state renders.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/
git commit -m "feat: add projects index and detail pages"
```

---

## Task 7: Interests hub and interest pages

**Files:**
- Create: `src/pages/interests/index.astro`
- Create: `src/pages/interests/radio/index.astro`
- Create: `src/pages/interests/reading/index.astro`

- [ ] **Step 1: Create `src/pages/interests/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';

const areas = [
  {
    name: 'Amateur Radio',
    href: '/interests/radio',
    description: 'HF and VHF operations, station notes, and on-air experiments.',
  },
  {
    name: 'Reading',
    href: '/interests/reading',
    description: 'Books — philosophical texts and brain candy in an even split.',
  },
];
---
<Base title="Interests" description="Things I'm into.">
  <h1>Interests</h1>
  <ul>
    {areas.map(area => (
      <li>
        <a href={area.href}><strong>{area.name}</strong></a>
        <p>{area.description}</p>
      </li>
    ))}
  </ul>
</Base>
```

- [ ] **Step 2: Create `src/pages/interests/radio/index.astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const entries = await getCollection('radio');
const sorted = entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<Base title="Amateur Radio" description="Amateur radio logs and notes.">
  <h1>Amateur Radio</h1>
  <p>Licensed amateur radio operator.</p>
  {sorted.length === 0 ? (
    <p><em>Log entries coming soon.</em></p>
  ) : (
    <ul>
      {sorted.map(entry => (
        <li>
          <strong>{entry.data.title}</strong>
          <time datetime={entry.data.date.toISOString()}>
            {' '}{entry.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          {entry.data.band && <span> · {entry.data.band}</span>}
          {entry.data.mode && <span> · {entry.data.mode}</span>}
        </li>
      ))}
    </ul>
  )}
</Base>
```

- [ ] **Step 3: Create `src/pages/interests/reading/index.astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const books = await getCollection('reading');
const byStatus = {
  reading: books.filter(b => b.data.status === 'reading'),
  finished: books.filter(b => b.data.status === 'finished').sort((a, b) => b.data.year - a.data.year),
  'want-to-read': books.filter(b => b.data.status === 'want-to-read'),
};
---
<Base title="Reading" description="Books I'm reading and have read.">
  <h1>Reading</h1>

  <h2>Currently Reading</h2>
  {byStatus.reading.length === 0 ? (
    <p><em>Nothing tracked yet.</em></p>
  ) : (
    <ul>
      {byStatus.reading.map(book => (
        <li><em>{book.data.title}</em> — {book.data.author}</li>
      ))}
    </ul>
  )}

  <h2>Finished</h2>
  {byStatus.finished.length === 0 ? (
    <p><em>Nothing tracked yet.</em></p>
  ) : (
    <ul>
      {byStatus.finished.map(book => (
        <li><em>{book.data.title}</em> — {book.data.author} ({book.data.year})</li>
      ))}
    </ul>
  )}

  <h2>Want to Read</h2>
  {byStatus['want-to-read'].length === 0 ? (
    <p><em>Nothing tracked yet.</em></p>
  ) : (
    <ul>
      {byStatus['want-to-read'].map(book => (
        <li><em>{book.data.title}</em> — {book.data.author}</li>
      ))}
    </ul>
  )}
</Base>
```

- [ ] **Step 4: Run check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Verify all routes in dev server**

```bash
npm run dev
```

Visit each route and confirm it renders:
- `http://localhost:4321/interests` — hub with Radio and Reading cards
- `http://localhost:4321/interests/radio` — "Log entries coming soon."
- `http://localhost:4321/interests/reading` — three sections, all empty state

- [ ] **Step 6: Run full build to confirm all static paths resolve**

```bash
npm run build
```

Expected: exits cleanly, `dist/` contains all routes.

- [ ] **Step 7: Commit**

```bash
git add src/pages/interests/
git commit -m "feat: add interests hub, radio, and reading pages"
```

---

## Task 8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```bash
mkdir -p .github/workflows
```

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: jdx/mise-action@v2

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run check

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow for type check and build"
```

---

## Task 9: Write CLAUDE.md and docs/deployment.md

**Files:**
- Create: `CLAUDE.md`
- Create: `docs/deployment.md`

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
# rondale-sc — Personal Website

## Overview

Static personal website built with Astro, hosted on Cloudflare Pages.

**Repo:** `github.com/rondale-sc/rondale-sc`
**Live URL:** `rondale-sc.pages.dev` (custom domain TBD)

## Local Development

### Prerequisites

- [mise](https://mise.jdx.dev) for Node version management

### Setup

```bash
mise install       # installs Node 22
npm install        # installs dependencies
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `http://localhost:4321` |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run check` | Run Astro type checking |

## Project Structure

```
src/
  content.config.ts       # content collection schemas
  content/
    projects/             # project markdown entries
    interests/
      radio/              # radio log entries
      reading/            # book entries
  layouts/
    Base.astro            # page shell (nav + footer)
  components/
    Nav.astro
    Footer.astro
  pages/                  # file-based routing
    index.astro           → /
    resume.astro          → /resume
    projects/             → /projects, /projects/[slug]
    interests/            → /interests, /interests/radio, /interests/reading
```

## Adding Content

### Add a project

Create `src/content/projects/<slug>.md`:

```markdown
---
title: My Project
date: 2026-01-15
status: completed
tags: [hardware, 6502]
summary: One-line description of the project.
---

Full markdown writeup here.
```

### Add a radio entry

Create `src/content/interests/radio/<slug>.md`:

```markdown
---
title: First HF contact
date: 2026-03-01
callsign: W1AW
band: 20m
mode: SSB
---

Notes about the contact.
```

### Add a book

Create `src/content/interests/reading/<slug>.md`:

```markdown
---
title: Meditations
author: Marcus Aurelius
status: finished
genre: philosophy
year: 2026
rating: 5
---

Optional notes or reaction here.
```

## Adding a New Interest Area

1. Create content directory: `src/content/interests/<name>/`
2. Add collection schema in `src/content.config.ts` (follow the pattern of `radio` or `reading`)
3. Create page: `src/pages/interests/<name>/index.astro`
4. Add the interest to the cards array in `src/pages/interests/index.astro`

## Deployment

See `docs/deployment.md` for Cloudflare Pages setup and custom domain configuration.

## CI

GitHub Actions runs on every push to `main` and every PR:
- `astro check` (type checking)
- `astro build` (ensures all pages compile)

See `.github/workflows/ci.yml`.
```

- [ ] **Step 2: Create `docs/deployment.md`**

```markdown
# Deployment

The site is hosted on Cloudflare Pages with automatic deployments from the `main` branch on GitHub.

## Architecture

| Component | Provider |
|-----------|----------|
| Hosting | Cloudflare Pages |
| CI/CD | Cloudflare Pages (GitHub integration) |
| Validation | GitHub Actions |
| DNS | Cloudflare DNS |
| Domain | TBD (currently `rondale-sc.pages.dev`) |

## Initial Cloudflare Pages Setup

These steps are done once to connect the repo to Cloudflare Pages.

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub and select the `rondale-sc/rondale-sc` repository
4. Configure the build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `22`
5. Click **Save and Deploy**

After setup: every push to `main` triggers a production deploy. Every PR branch gets a preview URL at `<branch>.rondale-sc.pages.dev`.

## Environment Variables

Set in Cloudflare Pages dashboard under **Settings → Environment variables**.

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_VERSION` | `22` | Yes — tells Cloudflare which Node version to use |

## Custom Domain Setup (when TLD is acquired)

1. Purchase a domain and transfer DNS management to Cloudflare (or use Cloudflare Registrar directly)
2. In the Cloudflare Pages project: **Custom domains** → **Set up a custom domain**
3. Enter your domain (e.g. `yourname.com`)
4. Cloudflare will prompt you to add a CNAME record — it does this automatically if your DNS is on Cloudflare
5. Wait for SSL certificate provisioning (usually < 5 minutes)

For apex domain (`yourname.com`, not `www`): Cloudflare supports CNAME flattening, so apex domains work without extra configuration.

**Multiple domains:** You can add both `yourname.com` and `www.yourname.com` as custom domains on the same Pages project. Cloudflare preserves whichever domain the user typed — no forced redirects unless you configure them.

## Branch Deployments

- `main` → production (`rondale-sc.pages.dev` or custom domain)
- Any other branch → preview (`<branch-name>.rondale-sc.pages.dev`)

Preview URLs are posted automatically as PR comments by Cloudflare.

## Rollback

To roll back to a previous deployment:
1. Go to **Workers & Pages** → your project → **Deployments**
2. Find the deployment to roll back to
3. Click **...** → **Rollback to this deployment**
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md docs/deployment.md
git commit -m "docs: add CLAUDE.md and deployment documentation"
```

---

## Task 10: Create GitHub repo and push

- [ ] **Step 1: Create GitHub repo via gh CLI**

```bash
gh repo create rondale-sc/rondale-sc --public --description "Personal website" --source=. --remote=origin
```

If the repo already exists, just add the remote:

```bash
git remote add origin https://github.com/rondale-sc/rondale-sc.git
```

- [ ] **Step 2: Push to GitHub**

```bash
git push -u origin main
```

- [ ] **Step 3: Verify CI passes**

```bash
gh run watch
```

Or open the repo on GitHub → **Actions** tab. Expected: the CI workflow run shows all green.

- [ ] **Step 4: Set up Cloudflare Pages**

Follow the steps in `docs/deployment.md` under "Initial Cloudflare Pages Setup."

After connecting, Cloudflare will trigger an initial deploy. Expected: the site is live at `https://rondale-sc.pages.dev`.

- [ ] **Step 5: Verify live site**

Open `https://rondale-sc.pages.dev` in a browser. Verify:
- Home page loads with nav
- `/projects` shows empty state
- `/interests` shows Radio and Reading cards
- `/interests/radio` and `/interests/reading` show empty states
- `/resume` shows stub structure
- No console errors

---

## Done

Phase 1 complete. The site is live at `rondale-sc.pages.dev` with all routes, typed content schemas, CI, and documentation. To add real content: follow the "Adding Content" section in `CLAUDE.md`.
