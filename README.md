# Webdesign

Design tooling for Claude Code: the vendored [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
skills plus the [21st.dev](https://21st.dev) MCP server, and a scaffold that puts each new
website on GitHub and Netlify in one command.

## New sites: GitHub + Netlify in one command

`scripts/new-site.sh` scaffolds a site, creates its GitHub repo, and connects that repo to a
Netlify site with continuous deployment. After it runs once per site, **`git push` is the
entire deploy process** — Netlify rebuilds and publishes on every push to `main`, and every
pull request gets its own deploy preview URL.

```bash
scripts/new-site.sh "Acme Roofing"
```

That produces `~/Sites/acme-roofing`, a private `acme-roofing` repo on GitHub, and a live
Netlify site — roughly 30 seconds, one browser prompt the first time.

### Options

| Flag | Default | Purpose |
|---|---|---|
| `--dir PATH` | `~/Sites` | Where the project folder is created |
| `--owner NAME` | your personal account | GitHub org or user to own the repo |
| `--public` / `--private` | `--private` | Repo visibility |
| `--template NAME` | `static` | Which folder under `templates/` to copy |

Defaults can be set once via `NEW_SITE_DIR` and `NEW_SITE_GH_OWNER` in your shell profile:

```bash
export NEW_SITE_DIR="$HOME/Sites"
export NEW_SITE_GH_OWNER="ForwardFramework"
```

### One-time setup

Install and authenticate both CLIs. You only do this once, not per site.

```bash
brew install gh                    # or: https://cli.github.com
npm install -g netlify-cli

gh auth login                      # browser, pick HTTPS
netlify login                      # browser
```

The first `netlify init` also asks to install the **Netlify GitHub App** on your account or
org. Grant it access to the repos you want deployable — "All repositories" if you create
sites often, since otherwise each new repo needs a manual grant before Netlify can see it.
This is the step that makes the whole thing automatic afterward.

### What the script does

1. Copies `templates/<name>/` to the target folder, substituting the site name
2. `git init`, initial commit on `main`
3. `gh repo create --source=. --push` — code is on GitHub
4. `netlify init` — creates the Netlify site and links it to the GitHub repo for CI deploys
5. Prints the local path, repo URL, and live URL

Step 4 is the one that prompts. Because each template commits a `netlify.toml` with the build
command and publish directory, Netlify detects the settings and there is little to answer
beyond choosing the team and site name.

### Templates

`templates/static/` is a zero-build starter: site source in `public/`, security and caching
headers in `netlify.toml`, a themed placeholder page, and a 404.

To add another (a Vite or Astro starter, a Tailwind base), copy the folder, adjust its
`netlify.toml` build settings, and use `{{SITE_NAME}}` wherever the name belongs. Any new
folder under `templates/` is immediately usable via `--template`.

### Deploying an existing site

For a site that already exists locally, skip the scaffold and run the last two steps in its
folder:

```bash
gh repo create my-site --private --source=. --remote=origin --push
netlify init
```

## Skills

`.claude/skills/` holds seven vendored skills (`ui-ux-pro-max`, `ui-styling`, `design`,
`design-system`, `brand`, `banner-design`, `slides`). They auto-activate on UI/UX work and
need only Python 3.x. See [.claude/skills/VENDORED.md](.claude/skills/VENDORED.md) for the
upstream version and update procedure.

## 21st.dev MCP server

`.mcp.json` registers the `21st` HTTP MCP server at project scope, so anyone working in this
repo is offered the server on their first session here.

The API key is **not** stored in the repo. The config reads it from the environment via
`${API_KEY_21ST}`, which is the same variable the official
[21st plugin](https://github.com/21st-dev/claude-code-plugin) uses, so one export serves both.

### Setup

```bash
# Get a key at https://21st.dev/settings/api-keys
export API_KEY_21ST="21st_sk_..."   # add to ~/.zshrc, ~/.bashrc, or a gitignored .env
claude                              # approve the project MCP server when prompted
```

Verify with `claude mcp list` (or `/mcp` inside a session); `21st` should report connected.

### Alternatives

Register the server privately instead of via `.mcp.json`:

```bash
claude mcp add --transport http 21st https://21st.dev/api/mcp \
  --header "x-api-key: $API_KEY_21ST"
```

Or install the official plugin, which bundles the same MCP server with the 21st CLI skills:

```
/plugin marketplace add 21st-dev/claude-code-plugin
/plugin install 21st@21st
```

### Network requirement

`21st.dev:443` must be reachable. In sandboxed or proxied environments with an egress
allowlist, add `21st.dev` to it — otherwise the server registers fine but reports
`Needs authentication`, which is the proxy's `403` surfacing as an auth failure rather than
a bad key.
