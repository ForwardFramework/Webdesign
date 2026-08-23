# Netlify deploy troubleshooting

Failure modes in rough order of how often they bite, with the diagnosis that actually
distinguishes them. Read the build log first — `netlify watch` while a deploy runs, or the
"Deploys" tab in the dashboard via `netlify open`.

## Netlify can't see the repo

**Symptom:** `netlify init` doesn't list the repo, or reports it can't access it.

The GitHub App is installed but scoped to selected repositories, and this one isn't in the
set. Fix it at **GitHub → Settings → Applications → Netlify → Configure**, either by adding
the repo or switching to "All repositories."

Granting all repositories is the setting that makes new sites link with no manual step. That
is a real access tradeoff, so let the user decide rather than assuming.

## Builds locally, fails on Netlify

Almost always an environment difference, and the log names which one:

- **Missing dependency.** The package is installed globally on the machine but isn't in
  `package.json`. Netlify installs only what's committed. Add it as a real dependency.
- **Node version.** Netlify's default may not match local. Pin it so both agree:
  ```toml
  [build.environment]
    NODE_VERSION = "20"
  ```
- **Case-sensitive paths.** macOS filesystems are case-insensitive; Netlify's builders are
  not. `import Header from './components/header'` resolves locally and fails in the build
  when the file is `Header.tsx`. Match the case exactly.
- **Missing environment variables.** A `.env` file is gitignored, so its values don't exist
  in the build. Set them in the Netlify UI, or `netlify env:set KEY value`. Never commit
  secrets to make a build pass.

## Build succeeds, page is blank

The `publish` directory in `netlify.toml` doesn't point at the built output. Netlify is
serving an empty or wrong folder.

Run the build locally, look at what it produced, and make `publish` match — `dist` for Vite,
`build` for Create React App, `_site` for Eleventy, `out` for a static Next export. The
static template publishes `public` because it has no build step at all.

## Styles and images missing, HTML fine

Absolute paths that assumed a different root, or asset references that don't survive the
build. Check the browser console for 404s and confirm the referenced paths exist inside the
published directory. A site that worked when opened as a local file often breaks here,
because `file://` tolerates path sloppiness that a web server doesn't.

## Subpages 404 on refresh

A client-side router owns those routes, so the server has no file to serve for a direct hit.
Redirect everything to the app shell and let the router take over:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Status 200 rather than 301 matters — it rewrites internally and keeps the URL intact.

Don't add this to a plain multi-page static site. It would swallow real 404s and serve the
homepage for typo'd URLs.

## Old content still serving

Confirm the deploy actually finished — `netlify watch`, or check the dashboard for a build
that failed after a green push. GitHub accepting a push says nothing about whether the build
succeeded.

If the newest deploy is genuinely live, it's browser cache. Hard-reload. The template already
sends `Cache-Control: must-revalidate` on HTML to keep this rare; if a site is missing that
header, add it.

## Rolling back

Every deploy stays addressable in the dashboard, so recovery doesn't need a git revert:
`netlify open` → Deploys → pick a known-good one → "Publish deploy." Instant.

Then fix forward in git. A published rollback and the repo's `main` now disagree, and leaving
them that way means the next push silently republishes the broken version.

## Wrong site linked

`.netlify/state.json` holds the site ID and is gitignored, so it can point somewhere stale
after copying a folder. `netlify status` shows the current link; `netlify unlink` followed by
`netlify link` repoints it.
