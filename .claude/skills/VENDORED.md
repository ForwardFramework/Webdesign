# Vendored skills

The skill directories here are vendored from
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
(MIT), version 2.13.0, upstream commit `8a1a6d8`.

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
