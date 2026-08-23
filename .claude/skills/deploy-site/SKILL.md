---
name: deploy-site
description: "Ship websites live to GitHub + Netlify with continuous deployment, so every later push auto-publishes. Use this whenever the user wants to build, create, make, redesign, or start a website, landing page, marketing site, portfolio, or client site — trigger even when they only describe the site they want ('build me a site for my roofing business', 'I need a landing page for the new service') and never mention deploying, hosting, GitHub, or Netlify, because creating the repo and Netlify link BEFORE building is what makes every subsequent change deploy automatically. Also use to put an existing local site online, to push changes live, to check whether a deploy succeeded, or to debug a failed Netlify build."
argument-hint: "[site name]"
metadata:
  author: ForwardFramework
  version: "1.0.0"
---

# Deploy Site

Every website goes to a GitHub repo wired to Netlify, so publishing is `git push` and
nothing else.

## Set up the pipes before building

The natural instinct is to build a site and then figure out hosting. Invert that here.

Scaffold the repo and connect Netlify **first**, then build the actual site inside it. Two
things follow from that ordering, and they're the whole reason the skill exists:

- The site is live from the first commit, so the user can watch it take shape at a real URL
  instead of waiting for a reveal at the end.
- Deployment stops being a step. Once the link exists, every edit ships by committing. There
  is no separate "now deploy it" phase to remember, forget, or get wrong.

Retrofitting hosting onto a finished site costs the same work, just later and with more
fiddling. So when a request means "a new website exists at the end of this," start here even
if the user said nothing about hosting.

## Find the scaffold

The scaffold lives in the Webdesign repo as `scripts/new-site.sh`. Locate it in this order,
and stop at the first hit:

1. `$WEBDESIGN_HOME/scripts/new-site.sh`
2. `scripts/new-site.sh` relative to the current git repo root
3. `~/Webdesign/scripts/new-site.sh`
4. `~/Sites/Webdesign/scripts/new-site.sh`

If none exist, ask the user where they keep the Webdesign repo rather than guessing or
reimplementing the script — it encodes build settings and headers that should stay identical
across their sites.

## Building a new site

### 1. Confirm the name and owner

You need a display name ("Acme Roofing"), which becomes the folder, the repo slug
(`acme-roofing`), and the page title. Ask if the request is vague about what the business or
project is actually called — a wrong slug is annoying to change once the repo exists.

Default to a private repo. Ask about `--public` only if the user brings up open-sourcing it.

### 2. Scaffold

```bash
scripts/new-site.sh "Acme Roofing" --no-netlify
```

`--no-netlify` matters: `netlify init` needs an interactive terminal to walk through team
selection and the GitHub App permission grant, and it will hang forever if you run it from a
session. The flag stops before that step and leaves everything else done — folder, template,
git repo, GitHub repo, first push.

Add `--owner <org>` when the repo belongs to an organization, and `--dir <path>` when it
shouldn't land in the default `~/Sites`.

### 3. Build the real site

Now do the actual design work in the scaffolded folder. The starter page in `public/` is a
placeholder — replace it rather than decorating it.

This is where the design skills earn their keep: `ui-ux-pro-max` for layout, type, and color
decisions, `brand` if the user has existing brand assets to stay consistent with, and
`design-system` when the site is big enough that tokens beat one-off styles. Use them as you
normally would; nothing about deployment changes how you design.

Keep the site in `public/` unless you introduce a build step. If you do add one (Vite, Astro,
Tailwind's CLI), update `netlify.toml` in the same commit so Netlify builds it the same way
you do locally:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

A `netlify.toml` that disagrees with the local build is the most common cause of "works on my
machine, blank page in production."

### 4. Commit and push

```bash
git add -A && git commit -m "Build homepage" && git push
```

Commit in meaningful chunks as you work rather than one giant commit at the end. Each push is
a deploy, and small deploys are much easier to roll back when something looks wrong.

### 5. Hand off the one interactive step

Netlify's GitHub App needs a browser to grant repository access, so the user has to run this
once per site. Give them the exact command with the real path filled in:

```bash
cd ~/Sites/acme-roofing && netlify init
```

Tell them to accept the detected build settings — the committed `netlify.toml` supplies them,
so there is little to answer beyond picking the team and confirming the site name.

Worth mentioning the first time they ever do this: granting the GitHub App access to **all
repositories** means future sites link with no extra permission step, while per-repo access
means every new site needs a manual grant in GitHub settings first.

## Putting an existing site online

Same destination, minus the scaffold. From inside the site's folder:

```bash
git init -b main && git add -A && git commit -m "Initial commit"
gh repo create acme-roofing --private --source=. --remote=origin --push
```

Then write a `netlify.toml` describing how the site builds — copy
`templates/static/netlify.toml` from the Webdesign repo as a starting point and correct the
`publish` directory to match reality. Hand off `netlify init` as in step 5.

Check for a `.gitignore` before that first commit. Sites built outside this workflow often
carry `node_modules/`, `.env` files, or `.netlify/` state that shouldn't reach a repo — and a
secret is far easier to keep out than to remove from history.

## Changing a site that's already live

This is the common case once a site exists, and it should stay boring:

```bash
git add -A && git commit -m "Update hero copy" && git push
```

Netlify rebuilds on its own. Don't run `netlify deploy` — it uploads straight from the
machine, bypassing GitHub, which produces a live site that no longer matches the repo. That
divergence is confusing precisely when someone is trying to debug something.

For risky changes, push a branch and open a PR instead. Netlify builds a preview at its own
URL, so the change can be seen in a real browser before it reaches the live site.

## Confirming a deploy worked

A push returning cleanly means GitHub accepted it, not that the site built. When it matters —
first deploy, a build-step change, anything the user is waiting on — check:

```bash
netlify watch    # blocks until the running deploy finishes
netlify open     # opens the site's Netlify dashboard
```

Report the live URL once it's actually serving the new content.

## When a build fails

Read `references/troubleshooting.md` for the failure modes worth knowing: builds that succeed
locally but fail on Netlify, blank pages after a successful build, missing CSS, 404s on
subpages in single-page apps, and repos Netlify can't see.
