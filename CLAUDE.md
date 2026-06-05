# rondale-sc — Personal Website

## Overview

Static personal website built with Astro, hosted on Cloudflare Pages.

**Repo:** `github.com/rondale-sc/personal-site` — local at `~/Code/rondale-sc/personal-site`
**Live URL:** TBD — set up Cloudflare Pages per `docs/deployment.md` (custom domain TBD)

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
4. Add the interest to the `areas` array in `src/pages/interests/index.astro`

## Deployment

See `docs/deployment.md` for Cloudflare Pages setup and custom domain configuration.

## CI

GitHub Actions runs on every push to `main` and every PR:
- `astro check` (type checking)
- `astro build` (ensures all pages compile)

See `.github/workflows/ci.yml`.
