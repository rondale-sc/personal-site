# rondale-sc — Personal Website

## Overview

Static personal website built with Astro, hosted on Cloudflare Pages.

**Repo:** `github.com/rondale-sc/personal-site`
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
  content.config.ts       # collection schemas
  content/
    posts/                # flat — all posts live here (type + project fields route them)
    projects/             # project metadata containers (frontmatter only)
    interests/
      dogs/               # dog profile entries
  lib/
    goodreads.ts          # Goodreads RSS fetch (build-time)
    posts.ts              # getPostSlug / getPostHref helpers
  layouts/
    Base.astro            # page shell (nav, footer, dark mode)
  components/
    Nav.astro
    Footer.astro
  pages/
    index.astro           → /
    resume.astro          → /resume
    projects/             → /projects, /projects/[slug]
    interests/            → /interests, /interests/radio, /interests/dogs, /interests/reading
```

## Content Model

See `.agents/content-model.md` for the full schema reference.

**Quick summary:**
- `src/content/posts/*.md` — flat directory, all posts. `type` field determines which section owns them; `project` field links project posts to a container.
- `src/content/projects/*.md` — project metadata containers. The project page aggregates all posts where `post.project === slug`.
- `src/content/interests/dogs/*.md` — dog profiles (reference pages, not in the post stream).
- Reading is Goodreads-synced at build time — no files needed.

## Adding Content

See `.agents/adding-content.md` for step-by-step instructions for each content type.

## Skills

Procedural instructions for common tasks. AI agents should follow these when the user triggers the matching phrase.

| Trigger | Skill |
|---------|-------|
| "Create a project", "Update a project", "Add a post", "Add to [project or interest]" | `.agents/skills/manage-project.md` |

## Deployment

See `docs/deployment.md` for Cloudflare Pages setup and custom domain configuration.

Requires `wrangler.toml` at the repo root — see that file for the current config.

## CI

GitHub Actions runs on every push to `main` and every PR:
- `astro check` (type checking)
- `astro build` (ensures all pages compile)

See `.github/workflows/ci.yml`.
