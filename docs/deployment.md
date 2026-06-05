# Deployment

The site is hosted on Cloudflare Pages with automatic deployments from the `main` branch on GitHub.

## Architecture

| Component | Provider |
|-----------|----------|
| Hosting | Cloudflare Pages |
| CI/CD | Cloudflare Pages (GitHub integration) |
| Validation | GitHub Actions |
| DNS | Cloudflare DNS |
| Domain | TBD (custom domain pending) |

## Initial Cloudflare Pages Setup

These steps are done once to connect the repo to Cloudflare Pages.

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub and select the `rondale-sc/personal-site` repository
4. Configure the build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `22`
5. Click **Save and Deploy**

After setup: every push to `main` triggers a production deploy. Every PR branch gets a preview URL at `<branch>.personal-site.pages.dev`.

## Environment Variables

Set in Cloudflare Pages dashboard under **Settings → Environment variables**.

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_VERSION` | `22` | Yes — tells Cloudflare which Node version to use |

## Custom Domain Setup (when TLD is acquired)

1. Purchase a domain and transfer DNS management to Cloudflare (or use Cloudflare Registrar directly)
2. In the Cloudflare Pages project: **Custom domains** → **Set up a custom domain**
3. Enter your domain (e.g. `yourname.com`)
4. Cloudflare will prompt you to add a CNAME record — it does this automatically if your DNS is on Cloudflare
5. Wait for SSL certificate provisioning (usually < 5 minutes)

For apex domain (`yourname.com`, not `www`): Cloudflare supports CNAME flattening, so apex domains work without extra configuration.

**Multiple domains:** You can add both `yourname.com` and `www.yourname.com` as custom domains on the same Pages project. Cloudflare preserves whichever domain the user typed — no forced redirects unless you configure them.

## Branch Deployments

- `main` → production (`personal-site.pages.dev` or custom domain)
- Any other branch → preview (`<branch-name>.personal-site.pages.dev`)

Preview URLs are posted automatically as PR comments by Cloudflare.

## Rollback

To roll back to a previous deployment:
1. Go to **Workers & Pages** → your project → **Deployments**
2. Find the deployment to roll back to
3. Click **...** → **Rollback to this deployment**
