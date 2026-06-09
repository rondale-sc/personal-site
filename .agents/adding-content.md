# Adding Content

## Add a project

**Step 1 — create the container** in `src/content/projects/<slug>.md`:

```markdown
---
title: My Project
date: 2026-01-15
status: in-progress
tags: [hardware, electronics]
summary: One-line description.
thumbnail: /projects/my-project/cover.jpg
---
```

The project appears at `/projects/<slug>` immediately. No posts required.

**Step 2 — add posts** in `src/content/posts/<slug>-YYYY-MM-DD-short-title.md`:

```markdown
---
title: "My Project: First Update"
type: project
project: my-project
date: 2026-01-15
---

Update content here.
```

Each post with `project: <slug>` is aggregated on the project page, newest-first. Posts also appear in the homepage Recent feed.

## Add a radio log entry

Create `src/content/posts/YYYY-MM-DD-short-title.md`:

```markdown
---
title: First HF contact
type: radio
date: 2026-03-01
callsign: W1AW
band: 20m
mode: SSB
---

Notes about the contact.
```

Appears at `/interests/radio` and in the homepage Recent feed.

## Add a writing post

Create `src/content/posts/YYYY-MM-DD-short-title.md`:

```markdown
---
title: My Post
type: writing
date: 2026-06-01
summary: Optional one-liner.
---

Content here.
```

Appears at `/writing/<slug>` and in the homepage Recent feed.

## Add a new interest area

1. Create a page at `src/pages/interests/<name>/index.astro`
2. Add the area to the `areas` array in `src/pages/interests/index.astro`
3. If it needs file-based content: add a collection schema in `src/content.config.ts` and a content directory at `src/content/interests/<name>/`
4. If it's post-based: filter `getCollection('posts')` by `type` in the page

## Reading (Goodreads-synced)

No files needed. Add books to your Goodreads shelves and they appear on the next deploy. See `src/lib/goodreads.ts`.
