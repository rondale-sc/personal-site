# Skill: Add a Post

Triggered when the user says **"Create a project"**, **"Add a post"**, **"Update a project"**, **"Add to [interest or project name]"**, or any variation indicating they want to create new content.

All content is a **post** (`src/content/posts/*.md`). The only difference is where it appears:
- Posts with `type: project` and `project: <slug>` → aggregated on the project page
- Posts with `type: radio`, `type: writing`, etc. → aggregated on the matching interest/section page
- All posts always appear on `/posts`

---

## Step 1 — Determine the destination

If the user named a destination (e.g. "add to the 6502 project", "add a radio post"), classify it:

| User says | Destination type | Action |
|-----------|-----------------|--------|
| Names a project (matches a slug in `src/content/projects/`) | project | Set `type: project`, `project: <slug>` |
| Says "radio" / "amateur radio" | interest | Set `type: radio` |
| Says "writing" | interest | Set `type: writing` |
| No destination given | — | Ask: "Is this for a project, or an interest (radio, writing)?" |

If it's a **project** and the slug doesn't exist in `src/content/projects/`, ask:
> "That project doesn't exist yet. Want to create it first?"
If yes, follow **Create a project container** below before adding the post.

---

## Step 2 — Gather post information

Ask for any missing fields. If the user's message already contains the content, extract it rather than asking again.

| Field | Ask | Notes |
|-------|-----|-------|
| `title` | "Post title?" | Required |
| `date` | "Date for this?" | Default: today (`YYYY-MM-DD`) |
| content | "What's the content?" | Required; take from user message if provided |
| `tags` | "Any tags? (or skip)" | Optional |

---

## Step 3 — Create the post file

Derive a short kebab-case slug from the title.
Filename: `<project-slug>-<YYYY-MM-DD>-<post-slug>.md` for project posts, `<YYYY-MM-DD>-<post-slug>.md` for others.

```markdown
---
title: "<title>"
type: <project|radio|writing>
project: <slug>        ← only for project posts
date: <YYYY-MM-DD>
tags: [<tags>]         ← omit if none
---

<content>
```

---

## Create a project container

Only needed when creating a brand-new project (not for adding posts to an existing one).

Gather:

| Field | Ask | Default |
|-------|-----|---------|
| `title` | "Full display title?" | Required |
| `summary` | "One-line description?" | Required |
| `status` | "Status?" | `in-progress` |
| `tags` | "Tags? (or skip)" | `[]` |
| `thumbnail` | "Thumbnail image path? (or skip)" | omit if none |

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

Then proceed to add the first post if the user has content ready.

---

## After creating files

Run `npm run check` to confirm no type errors.
