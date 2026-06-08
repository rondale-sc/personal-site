# Custom Theme — Crisp Technical (Option B)

## Goal

Replace the minimal placeholder styles with a cohesive design system: CSS custom property tokens, dark/light mode toggle, tighter content column, and consistent image treatment throughout.

## Color Tokens

### Light mode (default)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#f8f9fa` | Page background |
| `--surface` | `#ffffff` | Cards, nav, footer |
| `--border` | `#e2e4e8` | All borders, dividers |
| `--text` | `#111318` | Body text |
| `--text-muted` | `#6b7280` | Secondary text, meta |
| `--accent` | `#b85c00` | Links, active states, badges |
| `--accent-hover` | `#9a4d00` | Hover on accent elements |
| `--shadow` | `rgba(0,0,0,0.07)` | Card/image shadow |

### Dark mode (`[data-theme="dark"]`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0f1117` | Page background |
| `--surface` | `#1a1d27` | Cards, nav, footer |
| `--border` | `#2a2d3a` | Borders |
| `--text` | `#e8eaf0` | Body text |
| `--text-muted` | `#8b91a0` | Secondary text |
| `--accent` | `#d4740a` | Links, active states |
| `--accent-hover` | `#e8860c` | Hover |
| `--shadow` | `rgba(0,0,0,0.35)` | Shadows |

## Typography

System font stack — no external font load:
- Sans: `-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif`
- Mono: `'SF Mono', 'Fira Code', ui-monospace, monospace`

## Layout

- Content column: `680px` max-width (down from 800px) — tighter, more focused
- Header/footer: `1100px` max-width container so nav has breathing room on wide screens
- Consistent section padding: `2.5rem 1.5rem`

## Dark Mode Toggle

- Mechanism: `data-theme` attribute on `<html>`, set by an inline `<script is:inline>` in `<head>` before first paint (prevents flash)
- Priority: localStorage → system `prefers-color-scheme` → light
- Toggle button: compact sun/moon in the nav (right side)
- Persisted in `localStorage` key `"theme"`

## Image Treatment

Consistent across all sections:
- `border-radius: 6px`
- `border: 1px solid var(--border)`
- `box-shadow: 0 1px 4px var(--shadow)`
- Aspect ratios enforced per context: project thumbnails `3/2`, dog photos `4/5`, prose images unconstrained but max-width 100%

## Files Changed

- `src/styles/global.css` — full token system, update all hardcoded colors
- `src/layouts/Base.astro` — theme init script (flash prevention), `meta theme-color`
- `src/components/Nav.astro` — toggle button, update scoped colors to tokens
- `src/pages/interests/dogs/index.astro` — replace hardcoded colors with tokens
- `src/pages/index.astro` — hero photo shadow uses token
