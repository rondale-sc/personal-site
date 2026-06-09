# Content Model

## Collections

### `posts` — `src/content/posts/*.md`

Flat directory. All posts live here regardless of type. Frontmatter fields control which section pages consume them.

**Required fields:**
- `title` — display title
- `type` — `project | radio | writing`
- `date` — ISO date string

**Optional fields:**
- `slug` — overrides the filename-derived URL slug
- `project` — slug of the parent project container (project-type posts only)
- `summary` — one-line description
- `tags` — array of strings
- `draft: true` — hides from all feeds and pages
- `thumbnail` — path to image (project posts)
- `callsign`, `band`, `mode` — radio post metadata
- `meta` — arbitrary key/value escape hatch for future fields

**Helpers in `src/lib/posts.ts`:**
- `getPostSlug(post)` — returns `post.data.slug` if set, otherwise derives from filename
- `getPostHref(post)` — returns the correct URL for the post type

### `projects` — `src/content/projects/*.md`

Project metadata containers. Frontmatter only — no body content.

**Fields:** `title`, `date`, `status`, `tags`, `summary`, `thumbnail`

The project page at `/projects/[slug]` aggregates all posts where `post.data.project === slug`, sorted newest-first.

### `dogs` — `src/content/interests/dogs/*.md`

Reference pages, not in the post stream. One file per dog.

**Fields:** `name`, `status` (`current | past`), `photos` (array of paths), `born`, `breed`

## Reading

Goodreads-synced at build time via `src/lib/goodreads.ts`. No file-based entries. Goodreads user ID: `200941836`. Shelves fetched: `currently-reading`, `read`.
