# Portfolio site — handoff notes for Claude Code

Context from planning done in Claude chat, so nothing gets re-litigated.

## Owner
Kristian Davis — transitioning from hospitality into UX/UI, positioning as a
UX consultant / product designer, not "just a designer."

## Locked design system
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (system/code accents)
- **Palette:** near-black (#050505 / #0d0d0c background), off-white text (#e9e7df),
  **violet accent (#a06bff)** — used sparingly (underline/rail/ghost-word outline),
  never as a color statement across multiple elements. UPDATED from an earlier
  muted bone/gold (#c9a878) — that value is deprecated, replace anywhere it
  still appears. No neon, no gradients as decoration, no multi-color palette —
  one accent, used with confidence.
- **Signature interaction:** work-index rows are quiet at rest; hover OR keyboard
  focus triggers a "bloom" — a soft color glow + screen preview scaling up from the
  center of that row, while sibling rows dim to ~28% opacity rather than disappearing.
  This must stay accessible: hover and focus-visible states are equivalent, not
  hover-only.
- **Click behavior:** the bloom is a preview only. Clicking navigates to a dedicated,
  shareable case study page — case study pages are NOT constrained to open with
  whatever screen was blooming.

## Why these choices (so they don't get second-guessed later)
- Two earlier directions were rejected: a cold architectural-minimal look (too
  blocky/bland to the owner) and a warm editorial-serif look (too "newspaper
  classic"). The owner wants a controlled, systems-fluent energy — described as
  close to "Matrix" but must stay premium, not literally neon/hacker-cliché.
- Original brief referenced Neue Haas/Inter/Suisse/Söhne/PP Neue Montreal as
  typography touchstones. The final direction (Space Grotesk + JetBrains Mono)
  is a deliberate pivot the owner drove, not an oversight — don't "correct" it
  back toward the original brief without asking.

## Core narrative thread (used in hero + philosophy section)
Art (painting/drawing) → Computers (lifelong technical curiosity) → Psychology
(fascination with why people decide what they decide) → Design, where all three
converge. Hospitality background (~10 years) is supporting evidence of
client-facing skill, not the headline.

## Locked site thesis — DO NOT rewrite without going back to the owner
> "I design by asking why people decide what they decide — and I show the
> reasoning behind every decision, not just the finished screens."

This is deliberately present-tense and does NOT claim shipped outcomes. An
earlier draft included a clause ("...and, where the work has shipped, showing
what actually happened") that was explicitly rejected — the owner has no
completed/live project yet, so a forward-looking outcomes claim would be
premature and could read as overselling to a sharp visitor. Do not re-add
outcome language until Amun (see below) is actually live with real data —
at that point it becomes a new, separate addition, not a retrofit of this
sentence.

## Frozen vs. swappable — the whole point of this architecture
The owner explicitly wants ONE stable story that survives projects rotating
in and out over time. Treat this as a hard rule, not a suggestion:

**Frozen (the thesis — should not reference specific projects by name):**
- Hero headline + subhead
- Philosophy section (Art → Computers → Psychology → Design)
- About/background section
- Contact section

**Swappable (the evidence — expected to change over time):**
- Work index entries (title, one-liner, status tag, color, link)
- Individual case study pages

Practical implication for future build sessions: the work index should be
driven by a simple structured list (title / one-liner / status / accent color
/ link), not hardcoded prose baked into layout, so swapping a project is a
data edit, not a copy rewrite. This wasn't fully implemented in the current
HTML (rows are still hardcoded) — worth refactoring into a small JS/JSON-driven
list next time the index is touched.

## MAJOR UPDATE — thesis rewritten, read this before touching hero/philosophy/index copy

The original thesis ("I design by asking why people decide what they decide...")
was replaced after a long interview process that dug into what's actually
differentiated about the owner's process, not generic UX-consultant language.
Do not revert to the old thesis or "improve" the new one without checking with
the owner — several earlier drafts were explicitly rejected for sounding
"student-y," defensive, or juvenile, so don't reach for similar phrasing
(e.g. "show you why it was right," "my brain goes straight to," "do the work").

### LOCKED — safe to build
- **Hero headline:** "Every business is really the same puzzle: why does
  anyone choose it?" — small setup line, then two large lines with the second
  ("anyone choose it?") in the violet accent, per reference/hero-pattern.html.
- **Ghost word:** "PUZZLE" (changed from the earlier placeholder "WHY").
- **Work index framing:** NO numbering (01-05 removed), NO "five projects"
  count language anywhere. The section should not read as a chronological or
  ranked list.
- **Project one-line hooks** (replacing the old duration/role tags):
  - Zentra → "saving money without losing motivation"
  - SmiteForge → "one brand, two very different platforms"
  - Nitefind → "too many options, not enough certainty"
  - Freya Sews → "one identity, three very different services"
  - Amun → "still being built"

### NOT LOCKED — draft only, do not treat as final
- **Hero subhead** — currently a placeholder in index.html marked
  `[DRAFT — not locked]`. Do not remove that marker or ship this copy without
  the owner reviewing it in context.
- **Philosophy section** — the owner is leaning toward cutting this as its
  own explained block entirely (it read as redundant/"telling not showing")
  and replacing it with either nothing, or a single unexplained pull-quote
  line between hero and work index. Not decided. Current section still has
  OLD copy tied to the OLD thesis — do not treat it as current, and do not
  build a new philosophy-section design until the owner confirms direction.
- **About-section hospitality paragraph** — written against the old thesis,
  needs to be reworked to connect to the new "business puzzle" framing.
  Flagged, not yet rewritten.

### STRUCTURAL — agreed but not built
### STRUCTURAL — SPEC LOCKED, exact reference provided, ready to build
The work index is now a scattered, non-linear layout — concept AND exact
implementation tested and approved by the owner. Reference file:
`reference/work-index-pattern.html`. Open and match it, do not reinterpret
"scattered" from scratch.

**Exact rules, tested and locked:**
- Underlying invisible 12-column grid (visible via a "toggle grid" debug
  button in the reference file — every entry position is snapped to a real
  column line, not arbitrary pixel placement).
- **All 5 titles are the SAME size (48px, Space Grotesk 700).** An earlier
  version used 3 size classes (large/medium/small) to add variety — the
  owner explicitly rejected this because differing size reads as "this
  project matters more," which is not the message intended. DO NOT
  reintroduce size variation between entries for this reason. If more visual
  variety is wanted later, get it from position, rotation, or hook-line
  treatment — never from title size.
- Positions (from the reference file, in px against a 1200px-wide container):
  Nitefind top:0/left:0, Zentra top:160/left:540, SmiteForge top:40/left:900,
  Freya Sews top:400/left:120, Amun top:520/left:680. These specific values
  don't need to be pixel-perfect when responsive breakpoints are handled, but
  the *relationship* — no shared row, no shared column, deliberately
  scattered rather than a grid of neat rows — should be preserved.
- Hover interaction: hovering one entry's title turns it violet and fades
  all sibling entries to 35% opacity — same "quiet at rest, one thing comes
  forward" logic as the original bloom design, just no longer constrained to
  a single vertical list.
- Still needs (not yet tested): the bloom glow/screen-preview layer from the
  original design, layered back onto this positional system; a mobile
  fallback (this whole pattern assumes hover, which doesn't exist on touch);
  responsive behavior for smaller viewports (the reference file has NOT been
  tested below ~1200px width).



Do not redesign this from the description below — an exact working reference
file is included at `reference/hero-pattern.html`. Open it and match it, don't
reinterpret it.

The pattern in brief (see the file for real values):
- An oversized outline "ghost word" (font-size ~280px, Space Grotesk 700,
  `-webkit-text-stroke` instead of fill, ~0.45 opacity) bleeds off the left
  edge of the viewport (negative left position) and sits behind the headline
  as a z-index-0 layer — not a bordered decorative box.
- Headline is 3 stacked lines at different treatments: a small label line
  (~32px, muted gray), then two large lines (~104px, 700 weight, -0.02em
  tracking) — the second of the two large lines is offset right via
  margin-left (~120px) AND colored with the accent, breaking the left-aligned
  block the rest of the headline sits on.
- Subhead is NOT centered under the headline — it's indented further right
  (~340px margin-left), capped at ~420px width, with a left border/rail in
  the accent color instead of floating free.
- Accent color is violet (#a06bff) — locked after the owner explicitly
  compared it against red (rejected — reads aggressive) and electric blue
  (close second, but violet argues better for the "why people decide"
  psychology-driven thesis than a technical-reading blue would).

**This same technique — asymmetric offset, dramatic scale contrast, an
oversized outline element breaking the frame — should be applied to the
philosophy, about, and contact sections too**, replacing their current
symmetric bordered-box layouts. The owner explicitly rejected the original
build for being "generic, too blocky, lacking personality" — root cause was
every section being a centered, evenly-bordered rectangular band. Don't
recreate that pattern anywhere else in the site. Content and specific values
(what word is oversized, how much offset) should be judged per-section, but
the underlying moves — break symmetry, use scale contrast, let one element
bleed past its container — are the fixed rule now.

Do NOT reach for saturated color across multiple elements as the way to add
personality — the owner explicitly preferred the "more alive and confident"
read that came from asymmetry/scale over a saturated-color version they also
saw side by side. Color is one accent (violet), used with confidence, not a
palette.


Each work-index row and case study should carry an honest status, not a
decorative label:
- `concept` — self-directed or school project, prototype only, no real users
- `in progress` — actively being built (currently: Amun)
- (future) something like `live` once a project actually ships — do not add
  this tag or any outcome-implying language to a project until it's true.

## MAJOR UPDATE 2 — copy rewritten from real source material, philosophy section removed

Full site copy rewritten again, sourced from the owner's actual old portfolio
About page (kdavisdesigns0663.github.io/portfolio-website/about.html), not
invented. Real material pulled forward: the painting-taught-me-to-notice-detail
framing, "gamer, swimmer, traveler," and the hospitality background, all
rewritten to connect to the new "business puzzle" thesis rather than sitting
as generic bio filler.

**Style rule, apply everywhere, including case study copy later:** no em
dashes anywhere in body copy. Short, plain sentences instead of one long
clause-stacked sentence. This was an explicit instruction from the owner
("get rid of em dashes and anything that sounds or looks AI") — treat it as
a hard style rule for all future copy on this site, not a one-time cleanup.

**The philosophy section (the "Art / Computers / Psychology / Design" 4-step
block) has been REMOVED from index.html entirely**, not just edited. This
supersedes the earlier "NOT LOCKED" note above that described it as still
present with old copy pending a decision — the decision is now made, the
section is gone. This follows through on the earlier discussion: a separate
block that exists to explain the site's thesis reads as "telling, not
showing," and is redundant once the hero line already states the thesis
directly. If this needs to come back in some form later, it should be a
single unexplained line, not a headlined, justified section. Don't
regenerate the old 4-step version.

## MAJOR UPDATE 3 — work index redesigned as a radial "web," ghost word revised, full site review pending

### Ghost word — "OBSESSED" rejected, needs revision
Owner found "OBSESSED" as the hero ghost word too intense — site should read
as "mildly professional but a little cheeky," not aggressive. Leading
replacement candidate: **"NOSY"** (playful, self-aware, still restrained).
Not fully locked — confirm before building. Do NOT default back to
"OBSESSED" or "WHY" without checking.

### Ghost words needed for OTHER sections, not just hero
Owner wants the oversized-outline-word device used as a wayfinding/rhythm
tool throughout the page, not just in the hero. Rough candidates, NOT
locked, need real development: Work section → "PROOF" or "EVIDENCE", About
section → "WHY" or "REAL", Contact section → "START" or "TALK". Treat these
as starting points for a real copy pass, not final.

### Work index — full redesign: radial "web" layout with animated ripple center
This REPLACES the earlier scattered/12-column-grid concept entirely. New
concept, tested and approved via mockup:

**Static structure:**
- 5 project nodes arranged in a perfect circle around a center point:
  equal angle between each (360° / 5 = 72° apart), equal radius from
  center. This is the "invisible rule" that keeps it reading as intentional
  rather than randomly scattered — a radial system instead of the earlier
  column-grid system, but same underlying principle (a real, checkable rule
  governs position, nothing is arbitrary).
- Thin violet spoke lines connect each node back to the center, fading in
  opacity from center outward.
- Center point has a mark: **three concentric violet rings, fading in
  opacity outward** (a ripple effect) — this was chosen specifically to tie
  to the owner's personal interest in swimming, and it reinforces the
  "Pattern reader" thesis (a ripple is a pattern spreading outward). This
  mark works as pure abstract design even if nobody knows the personal
  meaning behind it — don't over-explain it in any visible copy.
- All 5 node titles remain equal size/weight (per the earlier locked rule —
  no entry should imply more importance than another). This still applies
  in the radial layout.

**Animation, on page load (not yet built, spec only):**
- The ripple rings animate first: expanding outward from the center point.
- The 5 project nodes travel outward along their spoke lines as the ripple
  expands, arriving at their final radial positions in sync with (or just
  behind) the ripple's expansion. Visually, the ripple should read as what
  "pushes" the nodes into place, not as a decoration unrelated to their
  motion.
- Hover/focus behavior from the earlier design still applies once settled:
  hovering one node fades siblings, brings that node's bloom/glow/screen
  preview forward.
- NOT yet specified: exact timing/easing, what happens on mobile (this
  whole concept currently assumes a desktop-sized canvas), whether the
  ripple only plays once on load or replays on some trigger.

Reference file for the static radial layout and ripple center concept:
`reference/web-ripple-center.html` (may need to be re-added if missing —
see the sync warning pattern noted elsewhere in this doc).

### Still needed, not yet designed
- **Headshot placeholder** in the About section — actual photo still
  pending from the owner. Build a clearly-marked, correctly duotone-treated
  placeholder slot (see earlier `img-treatment-preview.html` reference for
  the treatment style) so the layout is complete even without the final
  image.
- **Nav bar hover states** — currently generic/default, explicitly flagged
  as "lackluster." Needs real design attention matching the rest of the
  site's specificity (scale, color, asymmetry), not a generic underline or
  color fade. Not yet designed.
- **Full copy review across the entire homepage** — owner has requested a
  complete pass, not just the hero (which is the only section that's had
  real scrutiny so far). About section, contact section, and all ghost
  words/section labels still need the same level of review the hero went
  through.

## Case studies — five projects, in priority build order


1. **Nitefind** — nightlife discovery app, 10 weeks, sole designer. Furthest along;
   see `case-studies/nitefind.html` for real content already drafted (mood board
   rationale as the strongest "key decision" — Midnight Grid chosen over Alt Scene
   specifically because it served the decision-fatigue thesis; small A/B test on nav
   texture, plain black won). Has an open TODO: whether peer-review feedback
   (density on small breakpoints, back-arrow placement, missing icon legend) was
   actually acted on, or remains a known next step — confirm with owner before
   finalizing copy.
2. **SmiteForge** — dual-platform (iOS/Android) companion app, 5 weeks. Not yet
   drafted — needs a "key decisions" pass (real tradeoff + reasoning), currently
   just has process-narrative content pulled from the owner's existing Behance/
   portfolio site.
3. **Zentra** — fintech savings app, 4 weeks. Stub built (`case-studies/zentra.html`)
   with clear TODOs — needs research insight and 1-2 real tradeoff decisions.
4. **Freya Sews** — service brand (drag performer/designer/makeup artist), concept
   only, never fully developed but strong Figma research + design. NOT a live
   client site — correct this if it appears anywhere as "live."
5. **Amun Personal Protection** — in progress, home screen exists, more coming.
   Will eventually go live — this is the one real "shipping to production" project.
   Currently unbuilt on the site; needs an honest "in progress" placeholder card,
   not a full case study yet.

Case study template (per project): Hero → Why this exists → The signal (research
insight) → Key decisions (real tradeoff + reasoning — the differentiator vs. a
generic portfolio) → The work (curated final screens) → Where it stands (honest
status: shipped/concept/in-progress, not a fabricated "outcome" for projects that
don't have one).

## What's NOT yet built (known gaps)
- Scroll choreography / parallax / content reveal animation — brief explicitly
  asked for this, current build is static outside the work-index bloom.
- A line surfacing target project types (luxury, professional services, tech,
  premium consumer, hospitality, fitness, startups) — currently internal context
  only, not shown on-site. Owner hasn't confirmed whether to add it.
- Mobile equivalent for the hover/bloom interaction (tap-based fallback needed).

## File structure as handed off
```
portfolio-site/
  index.html              — homepage: hero, philosophy, work index, about, contact
  css/style.css            — full design system
  js/main.js                — keyboard-focus parity + smooth scroll
  case-studies/
    nitefind.html          — most complete, real content + TODOs
    zentra.html             — stub with TODOs
    smiteforge.html         — not yet created
    freya-sews.html         — not yet created
    amun.html                — not yet created
```
