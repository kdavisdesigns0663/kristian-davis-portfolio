# Kristian Davis portfolio site

Static HTML/CSS/JS, no build tooling, no framework, no package.json. Deployed via
GitHub Pages at `https://kdavisdesigns0663.github.io/kristian-davis-portfolio/`.
Repo: `github.com/kdavisdesigns0663/kristian-davis-portfolio`.

**Before doing anything else, read `HANDOFF.md`** — specifically the last
section ("MAJOR UPDATE 10 — index.html/CSS/JS sync fix, Contact CTA
restored, hero sentence timing, raindrop sink-in refinement"), which is a
current, accurate summary of what's built and how it works. Earlier sections in that
file are historical (rejected directions, locked copy decisions, rationale)
and still worth knowing, but their *technical* descriptions of what's built
are stale — trust the last section and the live files over anything earlier
in that doc.

## Locked design system (won't change without the owner explicitly asking)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code/system accents)
- Palette: near-black background (`--bg:#050505`), off-white text, **one** violet
  accent (`--accent:#a06bff`) used sparingly — no gradients-as-decoration, no
  multi-color palette
- No em dashes, no AI-sounding phrasing, anywhere in body copy — a hard style rule
- Oversized-outline "ghost word" per section (`.ghost`), bleeding off the left edge,
  as a wayfinding/rhythm device
- `scroll-snap-type:y mandatory` — every top-level section is a hard, full-viewport
  stop, not a free-scroll page

## Files
```
index.html         all page markup (single page + nav/footer now live inside
                    #hero/#contact, not as separate top-level elements)
css/style.css       full design system, heavily commented with WHY not just WHAT
js/main.js          all interaction logic: hero reveal, work-section raindrop/
                    ripple (desktop) + pill selector (mobile), section
                    background bloom, contact pulse, wheel-driven scroll
                    resistance
case-studies/       nitefind.html + zentra.html only — smiteforge/freya-sews/amun
                    case study pages don't exist yet
reference/          old dev-time mockups (hero-pattern.html, raindrop-v4.html) —
                    historical, not necessarily current
HANDOFF.md          full project history/decisions — READ THIS FIRST
HERO-BUILD-SPEC.md  STALE, superseded, flagged as such at the top of the file
```

## Workflow notes for this repo specifically
- No build step. Edit the files directly; there's nothing to compile.
- When testing in a browser tool: **serve over a real local HTTP server, not
  `file://`.** A `file://` tab has been observed serving stale cached CSS/JS
  across reloads in this environment with no visible indication — cost real
  time chasing a "fix" that had already worked. `python3 -m http.server` (or
  equivalent) from the repo root, then hard-reload / cache-bust the stylesheet
  link if edits don't seem to be taking effect before assuming the code is wrong.
- Commit messages in this repo's history are written with real technical
  context (root causes, not just "fixed bug") — `git log` and `git log -p
  <file>` are genuinely useful for understanding why something is built the
  way it is, more useful than guessing from the code alone.
- This project has a documented history of docs/reference files drifting out
  of sync with the live site and causing real rework (see HANDOFF.md's MAJOR
  UPDATE 5 and 7). When a doc and the live file disagree, the live file wins —
  and update the doc.
