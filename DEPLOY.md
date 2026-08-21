# Deploying

The site is static HTML, CSS and vanilla JavaScript — no build step, no
framework, no dependencies. It runs on any static host.

Two bundles are produced by `python3 tools/build_zip.py`:

| Bundle | For |
|---|---|
| `dist/forward-framework-site.zip` | Vercel — includes `vercel.json` and `.vercelignore` |
| `dist/forward-framework-site-portable.zip` | Everything else — static.app, Netlify drop, cPanel, S3 |

---

# static.app

1. Build the portable bundle: `python3 tools/build_zip.py --portable`
2. In your static.app dashboard, **Add a new site** and drag
   `forward-framework-site-portable.zip` into the drop zone. It unpacks and
   deploys automatically.
3. The site goes live on a `your-site.static.domains` address. Add your own
   domain under **Settings → Domains** (SSL is issued for free).

### Set the domain

Same rule as any host: the canonical tags, Open Graph tags, JSON-LD,
`sitemap.xml`, `robots.txt` and `llms.txt` all carry an absolute URL. Point
them at whatever address is actually serving the site:

```bash
python3 tools/set_domain.py https://your-site.static.domains
python3 tools/build_zip.py --portable      # then re-upload
```

### Making the forms live

static.app has a built-in **Forms** feature: add a `static-form` attribute to a
`<form>` and submissions land in your dashboard — no endpoint, no third party.

`assets/js/main.js` already supports this. When a form carries `static-form`
(or `netlify`, or `data-native-submit`), the script runs its own validation and
then hands off to the browser instead of intercepting the submit. Without the
attribute it keeps the current behaviour: validate, show the success state, log
the payload to the console.

There are eight forms — the hero form on the homepage plus one per service
page. Ask and the attribute can be added to all of them in one pass.

### Check after deploying

- [ ] `/services/` loads the services hub — this is the one behaviour that
      varies between hosts (serving `index.html` from a subfolder). Verified
      working on a plain static server; confirm it on static.app.
- [ ] A made-up URL shows the branded 404 rather than a host default
- [ ] `/robots.txt`, `/sitemap.xml` and `/llms.txt` all load
- [ ] Canonical tags match the address you are actually serving from

---

# Cloudflare Pages

### Why this host needs its own build

Cloudflare Pages serves HTML **without the extension** and 308-redirects the
extension back: `/pricing.html` permanently redirects to `/pricing`. Uploading
the source unchanged would mean every internal link costs a redirect hop, and —
the real problem — every canonical tag would point at a URL that redirects.
Google treats that as a conflicting signal and it is a documented cause of pages
not being indexed.

So `tools/build_cloudflare.py` produces a Cloudflare-correct copy: `.html`
stripped from links, canonicals, Open Graph URLs, the JSON-LD graph,
`sitemap.xml`, `llms.txt`, `robots.txt` and the JS redirect. Files stay named
`*.html` on disk for Cloudflare to map, and directory indexes keep their
trailing slash (`/services/`). It also writes a `_headers` file, which is
Cloudflare's mechanism for response headers.

```bash
python3 tools/build_cloudflare.py                       # -> dist/cloudflare/ + a zip
python3 tools/build_cloudflare.py https://your-domain.com   # set the domain at the same time
```

Verified against a local emulation of Cloudflare's routing: 16 routes, **zero
redirect hops**, zero 4xx, all 19 internal links resolving directly, canonicals
extensionless.

### Option 1 — Automatic on every push

`.github/workflows/cloudflare.yml` builds and deploys on every push. Add two
secrets under **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → *Edit Cloudflare Workers* template (or a custom token with `Account · Cloudflare Pages · Edit`) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → the ID in the right sidebar (also in the URL) |

Create the Pages project once, named `forward-framework` — or change
`--project-name` in the workflow to match a name you prefer.

Until the secrets exist the workflow still runs, builds the bundle and uploads
it as a downloadable artifact, then skips the deploy with a notice rather than
failing.

### Option 2 — Connect the Git repo

**Workers & Pages → Create → Pages → Connect to Git** → pick the repository.

| Setting | Value |
|---|---|
| Framework preset | `None` |
| Build command | `python3 tools/build_cloudflare.py` |
| Build output directory | `dist/cloudflare` |
| Production branch | `claude/forward-framework-website-qwe3cg` (this repo has no `main`) |

### Option 3 — Direct upload

**Workers & Pages → Create → Pages → Upload assets**, then drag
`dist/forward-framework-cloudflare.zip` in.

### After it is live

Point the site at the domain actually serving it, then rebuild:

```bash
python3 tools/build_cloudflare.py https://forward-framework.pages.dev
```

Add a custom domain under the project's **Custom domains** tab, then rebuild
again with the real domain.

---

# GitHub Pages

A workflow at `.github/workflows/pages.yml` builds and publishes the site on
every push.

### One-time setup (required, and only a repo admin can do it)

**Settings → Pages → Build and deployment → Source: `GitHub Actions`**

Then re-run the latest workflow (Actions → *Deploy to GitHub Pages* → Re-run
jobs), or push any commit.

This step cannot be automated. `actions/configure-pages` accepts
`enablement: true` to switch Pages on through the API, but the workflow token
is refused: *Create Pages site failed — Resource not accessible by
integration.* Creating a Pages site needs administration rights the default
`GITHUB_TOKEN` does not carry. Until the toggle is set, every run fails at the
Configure Pages step with *"Get Pages site failed… verify that the repository
has Pages enabled."*

Once set, the site publishes to:

```
https://forwardframework.github.io/Webdesign/
```

The URL also appears on each workflow run and under Settings → Pages.

### The subpath problem, handled

A GitHub *project* site is served from `https://<owner>.github.io/<repo>/`, not
from the domain root. Every link and asset in this site is root-absolute
(`/assets/css/styles.css`), which is correct for a real domain and broken under
a subpath — 1,188 references would 404.

Rather than compromise the source, `tools/build_pages.py` copies the site into
`_site/` at deploy time and rewrites those paths, using the `base_path` and
`base_url` that `actions/configure-pages` reports. So:

- **No custom domain** → served at `/<repo>/`, paths and canonical URLs are
  rewritten to match.
- **Custom domain added** (Settings → Pages → Custom domain) → `base_path` is
  empty, nothing is rewritten, and the staged output is byte-identical to the
  source.

Either way the canonical tags, Open Graph tags, JSON-LD, `sitemap.xml`,
`robots.txt` and `llms.txt` all point at the address actually serving the site.
A `.nojekyll` file is added so Pages serves the files as-is.

Verified locally by staging with `base_path=/Webdesign`, serving it from a
subfolder and loading every route: no 404s, no JS errors, navigation stays
inside the subpath, canonicals correct.

### Branch note

The workflow triggers on `main` and on `claude/forward-framework-website-qwe3cg`.
This repository currently has no `main` — see the branch note under Vercel
below, which applies here too.

### Run it locally

```bash
python3 tools/build_pages.py /Webdesign https://owner.github.io/Webdesign
cd _site && python3 -m http.server 8000
```

---

# Deploying to Vercel

The site is static HTML, CSS and vanilla JavaScript. There is no build step,
no framework and no dependencies — Vercel serves the repository root as-is.

---

## Before you start: the branch

This repository has **no `main` branch**. The site lives on:

```
claude/forward-framework-website-qwe3cg
```

Vercel deploys the *Production Branch*, which defaults to `main`. So do one of
these, or the first production deploy will have nothing to serve:

- **Set the branch in Vercel** — Project → Settings → Git → Production Branch →
  `claude/forward-framework-website-qwe3cg`, or
- **Create `main` from this branch** and make it the repository default in
  GitHub (Settings → General → Default branch). Cleaner long term.

---

## Option 1 — Deploy from GitHub (recommended)

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   `ForwardFramework/Webdesign`.
2. Configure the project:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** leave empty (override off)
   - **Output Directory:** leave empty (override off)
   - **Install Command:** leave empty
3. Set the Production Branch as described above.
4. **Deploy.**

Every push to that branch then redeploys automatically, and pull requests get
their own preview URL.

## Option 2 — Deploy without Git

From the unzipped site folder:

```bash
npx vercel --prod
```

Or drag the folder onto [vercel.com/new](https://vercel.com/new).

---

## Immediately after the first deploy: set the domain

Every page carries an absolute URL in its canonical tag, Open Graph tags,
JSON-LD entity graph, `sitemap.xml`, `robots.txt` and `llms.txt`. Those
currently say `https://forwardframework.com`.

If the site goes live on a `*.vercel.app` URL while the canonicals point
somewhere else, search engines are told the real page lives at a domain that
does not resolve — which is worse than having no canonical at all. Production
`*.vercel.app` URLs *are* indexable (only preview deployments are `noindex`).

So either add the real domain right away (Project → Settings → Domains), or
point the site at the Vercel URL until you do:

```bash
python3 tools/set_domain.py https://forward-framework.vercel.app
git commit -am "Point site at the Vercel domain" && git push
```

And when the real domain is connected:

```bash
python3 tools/set_domain.py https://forwardframework.com
git commit -am "Point site at the production domain" && git push
```

The script rewrites the domain in every source and generated file and rebuilds
everything. It only touches scheme-qualified URLs, so the `hello@…` addresses
and social profile links are left alone.

---

## What `vercel.json` does

| Rule | Why |
|---|---|
| `/index.html` → `/` (308) | One canonical URL for the homepage instead of two |
| Security headers on all routes | `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, a `Permissions-Policy` denying camera/mic/geo/payment, and HSTS |
| `Cache-Control` on `/assets/*` | 10 minutes plus a day of `stale-while-revalidate`. Deliberately short: `styles.css` and `main.js` are not fingerprinted, so a long cache would serve stale CSS after a deploy |

Clean URLs (`/pricing` instead of `/pricing.html`) are **off**. Turning them on
means Vercel 308-redirects every `.html` URL, so the canonicals, sitemap,
`llms.txt` and internal links would all have to change at the same time or you
get redirect chains and mismatched canonicals. It is a one-command change while
the site is unlaunched — ask and it can be done properly in one pass.

`.vercelignore` keeps `tools/`, `dist/`, `README.md` and `.claude/` out of the
deployment.

---

## Verify after deploying

- [ ] Homepage, a service page, `/services/`, `/pricing.html` all load
- [ ] `/assets/css/styles.css` returns 200 (the page is dark, not unstyled)
- [ ] A made-up URL shows the branded 404
- [ ] `/robots.txt`, `/sitemap.xml` and `/llms.txt` load as plain text/XML
- [ ] Canonical tags show the domain you are actually serving from
- [ ] Submit the sitemap in Google Search Console

## Still to wire up

The forms currently log to the browser console. Set `data-endpoint` on each
`<form data-ff-form>` to a real handler — a Vercel Function, Formspree, or your
CRM's inbound webhook. The rest of the pre-launch checklist (phone number,
email, case studies, testimonials, review counts) is in `README.md` §6.
