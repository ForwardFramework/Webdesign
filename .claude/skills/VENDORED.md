# Vendored skills

The skill directories here are vendored from
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
(MIT), version 2.13.0, upstream commit `bc826e2` (re-vendored 2026-08-21).

They are checked into the repo so every Claude Code session in this project —
local, web, or CI — loads them without a separate install step.

| Skill | Purpose |
|---|---|
| `ui-ux-pro-max` | Main design intelligence skill: searchable local database of UI styles, color palettes, font pairings, UX guidelines, charts, and 22 tech stacks |
| `ui-styling` | shadcn/ui + Tailwind component and theming guidance, canvas visual designs |
| `design` | Logos, corporate identity, banners, icons, social images |
| `design-system` | Token architecture (primitive → semantic → component), component specs |
| `brand` | Brand voice, messaging frameworks, asset consistency |
| `banner-design` | Social/ad/web/print banner layouts |
| `slides` | HTML presentations with Chart.js |

## Requirements

Python 3.x (standard library only) for `ui-ux-pro-max/scripts/search.py`.
The scripts make no network calls.

## Usage

The skills auto-activate on UI/UX work. The search engine can also be called directly:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "roofing landing page" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "home services site" --design-system --project-name "Acme"
```

## Updating

Re-copy `.claude/skills/` from a fresh clone of the upstream repo, or run
`npx ui-ux-pro-max-cli init --ai claude` in the project root, then update the
version and commit recorded above.

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uupm
git -C /tmp/uupm log -1 --format='%h %s'          # record this commit at the top of this file

cp .claude/skills/VENDORED.md /tmp/VENDORED.md    # this file is ours, not upstream's
rm -rf .claude/skills
cp -R /tmp/uupm/.claude/skills .claude/skills
cp /tmp/VENDORED.md .claude/skills/VENDORED.md

find .claude/skills -name __pycache__ -type d -prune -exec rm -rf {} +
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "roofing landing page" --domain style
```

Only `.claude/skills/` is vendored — the upstream CLI, docs, and gallery are not.
`VENDORED.md` is the one file in this directory that is *not* from upstream, so
copy it aside before wiping the directory.

Running `search.py` writes `.pyc` files into `ui-ux-pro-max/scripts/__pycache__/`.
That path is gitignored; never commit it. (Three `.pyc` files were committed in the
initial vendoring and removed on 2026-08-21.)
