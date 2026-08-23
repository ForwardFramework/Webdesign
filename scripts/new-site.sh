#!/usr/bin/env bash
#
# new-site.sh — scaffold a website, create its GitHub repo, and wire it to Netlify
# so that from then on `git push` is the entire deploy process.
#
# Usage:
#   scripts/new-site.sh "Acme Roofing"
#   scripts/new-site.sh "Acme Roofing" --dir ~/Sites --public --template static
#
# Requires: git, gh (GitHub CLI, authenticated), netlify (Netlify CLI, authenticated)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ---------------------------------------------------------------- defaults ---
SITE_NAME=""
PARENT_DIR="${NEW_SITE_DIR:-$HOME/Sites}"
VISIBILITY="--private"
TEMPLATE="static"
GH_OWNER="${NEW_SITE_GH_OWNER:-}"
RUN_NETLIFY=1

# ------------------------------------------------------------------ output ---
bold() { printf '\033[1m%s\033[0m\n' "$*"; }
info() { printf '  %s\n' "$*"; }
die()  { printf '\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# -------------------------------------------------------------------- args ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)      PARENT_DIR="$2"; shift 2 ;;
    --template) TEMPLATE="$2";   shift 2 ;;
    --owner)    GH_OWNER="$2";   shift 2 ;;
    --no-netlify) RUN_NETLIFY=0; shift ;;
    --private)  VISIBILITY="--private"; shift ;;
    --public)   VISIBILITY="--public";  shift ;;
    -h|--help)
      sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    -*) die "unknown flag: $1" ;;
    *)  [[ -n "$SITE_NAME" ]] && die "unexpected argument: $1"
        SITE_NAME="$1"; shift ;;
  esac
done

[[ -n "$SITE_NAME" ]] || die "site name required — e.g. scripts/new-site.sh \"Acme Roofing\""

TEMPLATE_DIR="$REPO_ROOT/templates/$TEMPLATE"
[[ -d "$TEMPLATE_DIR" ]] || die "no template '$TEMPLATE' in $REPO_ROOT/templates"

# Slug: lowercase, non-alphanumerics collapsed to single dashes, trimmed.
SLUG="$(printf '%s' "$SITE_NAME" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
[[ -n "$SLUG" ]] || die "site name '$SITE_NAME' produced an empty slug"

TARGET="$PARENT_DIR/$SLUG"

# --------------------------------------------------------------- preflight ---
bold "Preflight"
REQUIRED=(git gh)
[[ $RUN_NETLIFY -eq 1 ]] && REQUIRED+=(netlify)
for cmd in "${REQUIRED[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || die "'$cmd' not found — see the setup notes in README.md"
done
gh auth status >/dev/null 2>&1 || die "GitHub CLI not authenticated — run: gh auth login"
if [[ $RUN_NETLIFY -eq 1 ]]; then
  netlify status >/dev/null 2>&1 || die "Netlify CLI not authenticated — run: netlify login"
fi
[[ -e "$TARGET" ]] && die "$TARGET already exists"
info "${REQUIRED[*]} ready"

REPO_PATH="$SLUG"
[[ -n "$GH_OWNER" ]] && REPO_PATH="$GH_OWNER/$SLUG"

# --------------------------------------------------------------- scaffold ----
bold "Scaffolding $TARGET"
mkdir -p "$TARGET"
cp -R "$TEMPLATE_DIR/." "$TARGET/"

# Substitute the site name into every template placeholder. Passing the value
# through the environment keeps it literal, whatever characters it contains.
while IFS= read -r -d '' file; do
  SITE_NAME="$SITE_NAME" perl -pi -e 's/\Q{{SITE_NAME}}\E/$ENV{SITE_NAME}/g' "$file"
done < <(grep -rlZ '{{SITE_NAME}}' "$TARGET" 2>/dev/null || true)
info "copied template '$TEMPLATE'"

cd "$TARGET"

# ------------------------------------------------------------------- git -----
bold "Creating git repository"
git init -q -b main
git add -A
git commit -q -m "Initial commit: scaffold $SITE_NAME"
info "committed $(git rev-list --count HEAD) commit on main"

# ---------------------------------------------------------------- github -----
bold "Creating GitHub repository"
gh repo create "$REPO_PATH" $VISIBILITY --source=. --remote=origin --push
REPO_URL="$(gh repo view --json url --jq .url)"
info "$REPO_URL"

# --------------------------------------------------------------- netlify -----
SITE_URL=""
if [[ $RUN_NETLIFY -eq 1 ]]; then
  bold "Linking Netlify (continuous deployment from GitHub)"
  info "netlify init reads netlify.toml, so accept the detected build settings."
  netlify init
else
  bold "Skipping Netlify link (--no-netlify)"
  info "netlify init needs an interactive terminal. Run it yourself in $TARGET."
fi

# The Netlify CLI ships on Node, so node is guaranteed present here.
[[ $RUN_NETLIFY -eq 1 ]] && SITE_URL="$(netlify status --json 2>/dev/null | node -e '
  let raw = "";
  process.stdin.on("data", d => raw += d).on("end", () => {
    try {
      const site = JSON.parse(raw).siteData || {};
      console.log(site.ssl_url || site.url || "");
    } catch { console.log(""); }
  });' || true)"

# ------------------------------------------------------------------ done -----
bold "Done — $SITE_NAME"
info "Local:   $TARGET"
info "GitHub:  $REPO_URL"
[[ -n "$SITE_URL" ]] && info "Live:    $SITE_URL"
info ""
if [[ $RUN_NETLIFY -eq 1 ]]; then
  info "From here on, deploying is just:  git push"
else
  info "One step left — run this in a terminal to turn on auto-deploy:"
  info "  cd $TARGET && netlify init"
fi
