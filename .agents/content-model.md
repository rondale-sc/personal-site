# Content Model

## Collections

### `posts` — `src/content/posts/*.md`

Flat directory. All posts live here. Frontmatter fields control where they appear.

**Required fields:**
- `title` — display title
- `date` — ISO date string

**Destination (one required):**
- `project` — slug of the parent project container (e.g. `6502-breadboard-computer`)
- `interest` — slug of the parent interest container (e.g. `radio`, `writing`)

**Optional fields:**
- `slug` — overrides the filename-derived URL slug
- `summary` — one-line description
- `tags` — array of strings
- `draft: true` — hides from all feeds and pages
- `thumbnail` — path to image
- `callsign`, `band`, `mode` — radio-specific metadata
- `meta` — arbitrary key/value escape hatch for future fields

**Helpers in `src/lib/posts.ts`:**
- `getPostSlug(post)` — returns `post.data.slug` if set, otherwise derives from filename
- `getPostHref(post)` — returns `/posts/[slug]`
- `getPostSection(post)` — returns `post.data.interest ?? 'project'` for display badges

### `projects` — `src/content/projects/*.md`

Project metadata containers. Frontmatter only — no body content.

**Fields:** `title`, `date`, `status`, `tags`, `summary`, `thumbnail`

The project page at `/projects/[slug]` lists all posts where `post.project === slug`.

### `interests` — `src/content/interests/*.md`

Interest area containers (non-recursive glob — does not include the `dogs/` subdirectory).

**Fields:** `title`, `description`, `thumbnail` (optional — falls back to most recent post thumbnail)

A page at `/interests/[slug]` is automatically generated for each container. Adding a new interest is just a file drop — no code changes needed.

### `dogs` — `src/content/interests/dogs/*.md`

Reference pages, not in the post stream. One file per dog.

**Fields:** `name`, `status` (`current | past`), `photos` (array), `born`, `breed`

## Reading

Goodreads-synced at build time via `src/lib/goodreads.ts`. No file-based entries. Goodreads user ID: `200941836`. Shelves: `currently-reading`, `read`.
