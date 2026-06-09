# Skill: Manage Project

Triggered when the user says **"Create a project"** or **"Update a project"** (with or without a project name).

---

## Create a project

### Step 1 — Gather information

If the user didn't provide a project name, ask:
> "What's the project name?"

Then collect the following. Ask one question at a time if the user hasn't already provided the answers in context:

| Field | Ask | Default / Notes |
|-------|-----|-----------------|
| `title` | "What's the full display title?" | Required |
| `summary` | "One-line description?" | Required |
| `status` | "Status — in-progress, completed, or shelved?" | `in-progress` |
| `tags` | "Any tags? (comma-separated, or skip)" | `[]` |
| `thumbnail` | "Thumbnail image path? (or skip)" | omit field if none |

Derive the slug from the title: lowercase, spaces → hyphens, strip punctuation.
Example: "My 6502 Project" → `my-6502-project`

### Step 2 — Create the project container

Create `src/content/projects/<slug>.md`:

```markdown
---
title: <title>
date: <today's date as YYYY-MM-DD>
status: <status>
tags: [<tags>]
summary: <summary>
thumbnail: <thumbnail>     ← omit line if no thumbnail
---
```

### Step 3 — Offer to add a first post

Ask:
> "Want to add a first update post now?"

If yes, follow the **Add a post** steps below using today's date.

---

## Update a project

"Update a project" means adding a new post to an existing project.

### Step 1 — Identify the project

If the user didn't provide a project name:
- List the slugs found in `src/content/projects/`
- Ask: "Which project? (slug or title)"

### Step 2 — Gather post information

| Field | Ask | Default / Notes |
|-------|-----|-----------------|
| `title` | "Post title?" | Required |
| `date` | "Date for this update?" | Today's date |
| content | "What's the content?" | Take from user's message if already provided |

### Step 3 — Add a post

Derive a short kebab-case slug from the post title.
Create `src/content/posts/<project-slug>-<YYYY-MM-DD>-<post-slug>.md`:

```markdown
---
title: "<title>"
type: project
project: <project-slug>
date: <YYYY-MM-DD>
---

<content>
```

---

## Notes

- Never create a project without a `summary` — it's shown on the `/projects` index.
- Post titles for project updates should include the project name as a prefix if the title would be ambiguous on its own: `"6502: Wozmon Running"` not just `"Wozmon Running"`.
- After creating files, run `npm run check` to verify no type errors.
