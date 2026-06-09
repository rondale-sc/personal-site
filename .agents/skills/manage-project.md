# Skill: Add a Post

Triggered when the user says **"Add a post"**, **"Create a project"**, **"Update a project"**, **"Add to [interest or project name]"**, or any variation indicating they want to create content.

All content is a **post** (`src/content/posts/*.md`). Every post goes to `/posts` automatically. The `project` or `interest` field routes it to a section page as well.

---

## Step 1 — Determine the destination

If the user named a destination, classify it:

| User says | Check | Action |
|-----------|-------|--------|
| Names something matching `src/content/projects/` | project | Set `project: <slug>` |
| Names something matching `src/content/interests/` | interest | Set `interest: <slug>` |
| Says "radio", "writing", or any known interest | interest | Set `interest: <slug>` |
| No destination given | — | Ask: "Is this for a project or an interest? Which one?" |

**If the destination doesn't exist yet:**
- For a project: ask to create it first (follow **Create a project container** below)
- For an interest: ask to create it first (follow **Create an interest container** below)

---

## Step 2 — Gather post information

Ask for anything not already provided:

| Field | Ask | Notes |
|-------|-----|-------|
| `title` | "Post title?" | Required |
| `date` | "Date?" | Default: today (`YYYY-MM-DD`) |
| content | "What's the content?" | Required; extract from user message if already there |
| `tags` | "Any tags? (or skip)" | Optional |

---

## Step 3 — Create the post file

Derive a short kebab-case slug from the title.
- Project posts: `<project-slug>-<YYYY-MM-DD>-<post-slug>.md`
- Interest posts: `<YYYY-MM-DD>-<post-slug>.md`

```markdown
---
title: "<title>"
project: <slug>        ← for project posts (omit interest line)
interest: <slug>       ← for interest posts (omit project line)
date: <YYYY-MM-DD>
tags: [<tags>]         ← omit if none
---

<content>
```

---

## Create a project container

Only needed for a brand-new project.

Gather: `title` (required), `summary` (required), `status` (default: `in-progress`), `tags`, `thumbnail` (optional).

Derive slug from title: lowercase, spaces → hyphens, strip punctuation.

Create `src/content/projects/<slug>.md`:

```markdown
---
title: <title>
date: <today>
status: <status>
tags: [<tags>]
summary: <summary>
thumbnail: <path>      ← omit if none
---
```

---

## Create an interest container

Only needed for a brand-new interest area. No code changes required — just a file.

Gather: `title` (required), `description` (optional).

Derive slug from title.

Create `src/content/interests/<slug>.md`:

```markdown
---
title: <title>
description: <description>
---
```

The page at `/interests/<slug>` is automatically generated.

---

## After creating files

Run `npm run check` to confirm no type errors.
