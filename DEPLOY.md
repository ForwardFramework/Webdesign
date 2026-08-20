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
