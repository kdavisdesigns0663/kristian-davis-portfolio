# Portfolio site — decisions and project notes

**What this file is:** the reasoning behind choices that are settled, so they don't get
re-litigated, plus the current state of the projects. It records *why*, not *how*.

**What this file is not:** a description of the code. It used to be, and it went badly. It
grew to nineteen appended "MAJOR UPDATE" sections describing a work index that was a scattered
12-column grid, then a radial web of spokes, then an X of orbiting nodes, then a tap-to-expand
accordion, and every one of those was live at some point and none of them is now. By the end,
not a single class or function name it documented still existed in the repo. If you want to
know how something works, read the file. `CLAUDE.md` covers the architecture and the traps.

Commit messages here carry real technical context, so `git log -p <file>` is the actual history.

## Owner
Kristian Davis — moved into UX/UI from about ten years in hospitality. Positioned as a UX
consultant and product designer, not "just a designer."

## Locked design system
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (system/code accents)
- **Palette:** near-black background (#050505), off-white text (#e9e7df), one violet accent
  (#a06bff), used sparingly. No neon, no gradients as decoration, no multi-colour palette.
  Case study pages are the single exception: each carries one per-project accent instead of
  the violet. `CLAUDE.md` holds the current values.
- **The ghost word** — an oversized outline word bleeding off the left edge — is a wayfinding
  and rhythm device used in every section, not decoration in the hero only.
- **Every animation solves a problem.** The hero reveals the text, the work raindrop causes
  the work to appear, contact highlights the CTA. Motion that does not answer a question the
  visitor is already asking does not go in.

## Decisions that are settled, and why

**The accent is violet.** Compared directly against red, which read aggressive, and electric
blue, which was a close second. Violet argues better for a thesis about why people decide
things than a technical-reading blue does.

**Personality comes from asymmetry and scale, not from colour.** Two directions were rejected
early: a cold architectural-minimal look (too blocky) and a warm editorial-serif look (too
newspaper-classic). The first real build was rejected as "generic, too blocky, lacking
personality," and the root cause was every section being a centred, evenly-bordered rectangle.
Break symmetry, use scale contrast, let one element bleed past its container. When a
saturated-colour version was shown beside an asymmetry-and-scale version, the owner preferred
the second. Do not reach for more colour as the way to add energy.

**Space Grotesk + JetBrains Mono is a deliberate pivot.** The original brief named Neue Haas,
Suisse, Söhne and PP Neue Montreal. The owner drove the change. Do not "correct" it back.

**No em dashes anywhere in body copy.** Short plain sentences over one long clause-stacked
sentence. The instruction was "get rid of em dashes and anything that sounds or looks AI," and
it applies to case study copy as much as to the homepage. Em dashes in `<title>` and meta tags
are fine and consistent across the case studies.

**Project titles are all the same size.** Differing size reads as "this project matters more,"
which is not the message. If more visual variety is ever wanted, take it from position or
treatment, never from title size.

**No ranked or chronological framing on the work index.** It should not read as a countdown or
a league table.

**Status is honest, never decorative.** `concept` for self-directed or school work with no real
users, `in progress` for something actively being built. A `live` tag, and any language implying
an outcome, only after it is true.

**The thesis does not claim shipped outcomes.** An early draft included "...and, where the work
has shipped, showing what actually happened." It was cut, because there was no completed project
to stand behind it and a sharp visitor would read it as overselling. When Amun actually ships
with real data, that becomes a new addition, not a retrofit of the existing line.

**There is no separate philosophy section, on purpose.** A block that exists to explain the
site's thesis reads as telling rather than showing, and is redundant once the hero states the
thesis outright. It was removed rather than rewritten. If it ever comes back it should be a
single unexplained line, not a headlined section.

**The hero headline is owner-written.** Several drafts were rejected for sounding student-y,
defensive, or juvenile. Do not rewrite it, or reach for phrasing in that register, without
going back to the owner.

## Background material for copy
Art (painting and drawing) → computers → psychology → design, where all three converge. Real
details available for bio copy: painting taught him to notice detail, gamer, swimmer, traveler.
The hospitality background is supporting evidence of client-facing skill, not the headline. All
of this is drawn from the owner's own writing, not invented, and it should stay that way.

## Frozen vs swappable
The point of the architecture. There is one stable story, and projects rotate through it.

**Frozen — the thesis. Should not name specific projects:**
hero headline and subhead, the bio section, the contact section.

**Swappable — the evidence. Expected to change:**
work index entries (title, one-liner, status, accent colour, link) and the case study pages.

The number of projects is expected to move up and down. Nothing in the frozen half should ever
have to change because a project was added or dropped, and no copy anywhere should state a
count. The work rows are still hardcoded in `index.html` rather than driven by a structured
list, so swapping a project is currently an edit in several places: the row itself, the nav
dropdown on every page, and the next-project link at the foot of the neighbouring case studies.
Driving those from one small list is the refactor worth doing next time the index is opened.

## The projects, as they currently stand
Live and built, in the order they appear on the homepage:

| project | what it is | one-liner on the index |
|---|---|---|
| **Nitefind** | nightlife discovery app, 10 weeks, sole designer | Too many options, not enough certainty. |
| **Zentra** | savings and goal-tracking app, 4 weeks | Saving money without losing motivation. |
| **SmiteForge** | dual-platform iOS/Android companion app, 5 weeks | One brand, two very different platforms. |
| **Amun** | protection services brand and site, in progress | Protection services, sold on trust. |

**Amun** is the one project that will actually go live with real users, which makes it the
only place outcome language will ever be earned. Its case study page exists but is an empty
noindex shell, and every entry pointing at it is deliberately disabled and marked "soon."
`CLAUDE.md` lists what has to be flipped when it ships.

**Nitefind** has one open question carried over from its build: peer-review feedback about
density on small breakpoints, back-arrow placement, and a missing icon legend. Whether that was
acted on or is still a known next step was never confirmed. Worth settling before anyone
finalises that page's copy, because it changes whether it reads as done or as in progress.

## Case study template
All three built pages follow the same spine, and a new one should too:

`01 / why this exists` → `02 / the signal` (the research insight) → `03 / key decisions` (a
real tradeoff and the reasoning, which is the whole differentiator against a generic portfolio)
→ `04 / the work` (curated final screens; SmiteForge calls this `04 / side by side` because its
argument is a platform comparison) → `05 / where it stands` (honest status, never a fabricated
outcome).

## Open items
- **Amun** is unbuilt. See `CLAUDE.md` for the specific markers to flip.
- **The work index is hardcoded**, so adding or removing a project touches several files. See
  Frozen vs swappable above.
- **AAA contrast is undecided.** The site passes WCAG AA everywhere. Five colours fail the 7:1
  AAA bar for small text: `#7d786f` (4.65), `#a259ff` (5.25), `#8c877d` (5.51), `#a06bff` (5.86)
  and `#8f8f8f` (6.30). A full AAA repalette was proposed once and not adopted, so nothing has
  been changed. This is a live decision, not an oversight: raising these means lightening the
  violet, which is the one accent the whole design rests on. Ask before touching any of them.
- **Target project types** (luxury, professional services, tech, premium consumer, hospitality,
  fitness, startups) are internal context only. The owner has not decided whether to surface
  them on the site.
