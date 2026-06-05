# Personal Website Design

**Date:** 2026-06-05
**Status:** Approved

## Purpose

A professional home on the internet that doubles as a personal space. Primary audience is prospective employers and collaborators; secondary audience is anyone who finds it organically. The site must read as professional while reflecting genuine personality and interests.

## Tech Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| Framework | Astro (static output) | `npm run build → dist/` |
| Hosting | Cloudflare Pages | Auto-deploys from GitHub |
| CI | GitHub Actions | Validates on PRs and pushes to `main` |
| Node version | mise | Locked via `.mise.toml` |
| DNS | Cloudflare DNS | Configured once a TLD is acquired |

Reference architecture: [rwjblue/rwjblue.com](https://github.com/rwjblue/rwjblue.com)

## Navigation

```
Home | Projects | Interests | Resume
```

Four top-level nav items. This structure remains stable as interests change — new interest areas are added under `/interests/` without touching the nav.

## Page Structure

```
/                          Home — name, brief bio, links (GitHub, email)
/resume                    Resume — structured page or embedded PDF
/projects                  All projects listing
/projects/[slug]           Individual project entry
/interests                 Hub — cards linking to each active interest area
/interests/radio           Amateur radio landing + log entries
/interests/reading         Reading list (current year + past)
```

Future interest areas (e.g. woodworking) are added by creating `src/content/interests/<name>/` and `src/pages/interests/<name>/index.astro`. Nothing else in the nav or repo structure changes.

## Content Model

Astro content collections with per-type schemas.

### Projects (`src/content/projects/`)

```ts
{
  title: string
  date: date
  status: 'active' | 'completed' | 'archived'
  tags: string[]
  summary: string         // one-line description
  // body: markdown
}
```

Covers all project types: software, hardware (6502 breadboard computer), future work. Writing about a project lives as the markdown body of its entry.

### Reading (`src/content/interests/reading/`)

```ts
{
  title: string
  author: string
  status: 'want-to-read' | 'reading' | 'finished'
  genre: 'philosophy' | 'brain-candy' | string   // extensible
  year: number            // year read/started
  rating?: number         // optional, 1-5
  // body: optional notes/reaction in markdown
}
```

### Radio (`src/content/interests/radio/`)

```ts
{
  title: string
  date: date
  callsign?: string
  band?: string
  mode?: string
  // body: markdown — field notes, activations, write-ups
}
```

Writing lives where it belongs: a book reaction is the markdown body of a reading entry; a technical write-up is the markdown body of a project entry. No dedicated writing section.

## Repository

The personal website lives at `~/Code/rondale-sc`, which corresponds to the GitHub repo `rondale-sc/personal-site`. This is a standalone git repo. The Cloudflare Pages project connects to this repo. The eventual custom domain is added once a TLD is acquired; until then the site is available at `personal-site.pages.dev` (the Cloudflare Pages default subdomain).

## Repo Structure

```
src/
  content/
    content.config.ts      # all collection schemas
    projects/
    interests/
      radio/
      reading/
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
  layouts/
    Base.astro             # page shell: nav + footer
  components/              # nav, project card, book card, etc.
  styles/
public/
docs/
  deployment.md            # Cloudflare Pages setup, DNS, custom domain steps
CLAUDE.md                  # dev setup, build commands, how to add content/interests
```

## Documentation Requirements

Documentation is a first-class Phase 1 deliverable. Two files ship with the initial skeleton:

**`CLAUDE.md`** — written for a new agent session picking up the repo cold:
- Local dev setup (`mise install`, `npm install`, `npm run dev`)
- Build and preview commands
- How CI works (GitHub Actions workflow)
- How Cloudflare Pages deploys (main → production, branches → previews)
- How to add a new interest area (step-by-step)
- How to add a content entry (project, reading, radio)

**`docs/deployment.md`** — written for TLD onboarding and infra setup:
- Cloudflare Pages project creation and GitHub connection
- Environment variables (`NODE_VERSION`)
- Custom domain setup steps (for when a TLD is acquired)
- DNS configuration on Cloudflare
- Preview vs. production URL behavior

Both files are kept updated as the site evolves.

## TLD

No domain acquired yet. Phase 1 deploys to `<project-name>.pages.dev` (provided free by Cloudflare Pages). When a TLD is acquired:
1. Add it to Cloudflare DNS
2. Add as a custom domain in the Cloudflare Pages project
3. Follow the steps in `docs/deployment.md`

For professional use, a `.com` is recommended. Naming patterns to consider: `<firstname><lastname>.com` or `<firstinitial><lastname>.com`.

## Phase 1 Scope

Phase 1 delivers a deployable skeleton. All routes exist; no real content yet.

**In scope:**
- Full repo scaffold with directory structure above
- `Base.astro` layout (nav + footer, no styling decisions locked in)
- All pages as stubs with honest empty states (not lorem ipsum)
- Home: name, placeholder one-line bio, GitHub + email links
- Resume: placeholder section structure
- Projects index: empty state
- Interests hub: Radio and Reading cards (stubs)
- `/interests/radio` and `/interests/reading`: landing pages with empty states
- All content collection schemas defined in `content.config.ts`
- GitHub Actions CI workflow (astro check + build)
- Cloudflare Pages project connected, deploying to `*.pages.dev`
- `CLAUDE.md` and `docs/deployment.md` complete

**Out of scope for Phase 1:**
- Real content entries (no radio logs, books, project writeups)
- Visual design / styling beyond functional layout
- Resume content
- TLD / custom domain
- RSS feed (add when content exists)

## Future Phases

- **Phase 2:** Resume content + styling pass
- **Phase 3:** First real content entries (6502 project writeup, current reading list)
- **Phase 4:** Interest area additions as they become active (woodworking, etc.)
