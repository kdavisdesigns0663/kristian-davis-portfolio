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

## MAJOR UPDATE 4 — index.html, style.css, and main.js actually rewritten (not just reference files)

Previous updates in this doc mostly described changes and pointed to
`reference/` mockup files, expecting Claude Code to apply them to the live
site. That repeatedly broke down — the live `index.html` fell out of sync
with the locked hero and work-section designs multiple times, causing
regressions the owner had to catch by screenshotting the rendered page. This
update actually rewrites the real site files directly, not just the
reference mockups. Treat this as the current source of truth for the
homepage; older instructions above describing the hero or work section as
"not yet built" are superseded.

### Ghost word status
Currently "OBSESSED" in the live file, explicitly as a **placeholder the
owner is fine leaving for now** — not a final decision, don't treat it as
locked, but also don't "fix" it unprompted. "NOSY" was tried and rejected
(too juvenile). "HUNCH" was proposed as a stronger alternative but not yet
chosen over "OBSESSED." Revisit only if asked.

### Work section — completely replaced, static web/grid concepts are DEAD
The work section is no longer a list, a scattered grid, or a static radial
spoke-web. It is now a **scroll-triggered ripple reveal**:
- A single violet drop sits at the center of a 600×600 stage on page load,
  inert.
- The moment the `#work` section is scrolled into view (via
  `scroll-snap-type: y mandatory` on `html`, `scroll-snap-align: start` and
  `scroll-snap-stop: always` on each top-level section — every section is
  forced to a hard, full-viewport stop, no gesture-based partial scroll
  between sections), three rings animate outward from the drop like ripples
  in water.
- The 4 project names fade in, positioned at equal angle (90° apart — 4
  projects now, not 5) and equal radius from center, timed to settle in as
  the ripple passes their radius.
- The ripple **plays once only** (`rippleHasPlayed` flag in main.js) —
  scrolling away and back does not replay it. This was a deliberate choice;
  revisit only if the owner asks for it to replay every time.
- **Hover or keyboard-focus on any project name** triggers a preview to
  bloom from the exact CENTER of the stage (not from the project's own
  position) — a colored screen preview scales up from small to large,
  tinted to that project's own accent color, while sibling project names
  dim to 25% opacity. This is currently a colored placeholder block (bar +
  a couple of lines), NOT a real cropped screenshot — swapping in real
  images is a separate, not-yet-scoped task.
- Projects currently live in a plain JS array at the top of the ripple logic
  in `js/main.js` — adding a project is adding one object to that array,
  nothing else needs to change. **Freya Sews has been removed from this
  array** (owner's explicit request — down to 4 active projects: Nitefind,
  SmiteForge, Zentra, Amun). This does not mean the Freya Sews case study
  page should be deleted, just that it's not currently linked from the
  homepage.

Reference/test files for this behavior: `reference/scroll-snap-ripple.html`
is the most complete tested version (scroll-snap + reliable trigger).
`reference/work-ripple-reveal.html` is an earlier version with the hover
preview logic before scroll-snap was added. The LIVE `js/main.js` combines
both — treat the live file as authoritative over either reference file if
they ever disagree.

### Scroll-snap now applies to the WHOLE page, not just the work section
`html { scroll-snap-type: y mandatory; }` plus `.snap-section` (applied to
hero, work, about, contact) with `scroll-snap-align: start` and
`scroll-snap-stop: always`. This means every top-level section is exactly
`100vh` and scrolling hard-stops on each one rather than allowing a
half-scrolled state between sections. This was an explicit request ("force
you down to the next section, not a huge scrolling gesture") and is also
what fixes the ripple's reliability, since the trigger watches for the
section being (almost) fully in view, which scroll-snap guarantees happens
cleanly.

### About and Contact sections
Restructured to sit inside full-viewport snap-sections (vertically centered
via flexbox) rather than plain stacked blocks. Copy content unchanged from
the last copy pass. NOTE: the owner has flagged the About section itself as
still needing a real redesign once photo direction is confirmed (see
"Still needed" section above) — the current version is a minimal adaptation
to fit the new scroll-snap structure, not a finished redesign.

### Cleanup note, not urgent
`.index`, `.row`, `.bloom` and related CSS classes in style.css are now
dead code (leftover from the old stacked-list work section). Safe to remove
whenever convenient — not currently causing any bugs since nothing
references them anymore, just unused weight in the stylesheet.

## MAJOR UPDATE 5 — root cause of the missing ripple found and fixed, real photo implemented

### The ripple bug — actual root cause, not a mystery
Across several rounds, the owner kept reporting the ripple animation wasn't
appearing. The real cause: a previous update (MAJOR UPDATE 4) rewrote
`index.html` and `style.css` to the fixed/tested version, but **`js/main.js`
was never actually updated to match** — it was still running old,
pre-fix JavaScript (wrong element IDs after the markup changed to a
drop-wrap/drop-shape structure, cardinal angles instead of the X-layout,
and the ring animation without the reflow fix described below). This is
now fixed — `js/main.js` matches `reference/raindrop-v4.html` exactly.
**Lesson for future sessions: when CSS/HTML and JS are part of the same
feature, verify all three files were actually updated together, not just
the ones that were top of mind.**

### Two real technical bugs, now fixed (not just described — actually fixed in the live files)
1. **Ring animation not appearing**: CSS transitions do not reliably animate
   from an implicit/unset "auto" size to an explicit one. The `.ring`
   element now has explicit `width:0; height:0;` in its base CSS, and the
   JS forces a reflow (`ring.offsetHeight`) after setting the transition
   property but before changing to the target size — this is required for
   the browser to actually animate the change rather than snapping
   instantly or not rendering the transition at all.
2. **Drop shape skewing/"weirdly shaped"**: applying a vertical
   squash/stretch scale to the SAME element that's rotated 45° stretches
   along the rotated diagonal axis, not true vertical, causing visible
   skew. Fixed by splitting into two nested elements: `.drop-wrap` handles
   position/fall/squash-stretch in true screen-space, `.drop-shape` (a
   child of the wrapper) handles ONLY the rotation. Never recombine these
   into one element.

### Full animation sequence, as currently implemented and tested
1. Section scrolls into view (via IntersectionObserver on `#work`,
   threshold 0.9, relying on scroll-snap to guarantee a clean full-viewport
   entry).
2. A small violet teardrop (`border-radius: 50% 50% 50% 0` rotated 90°
   clockwise — NOT 45°, the owner specifically asked for the extra
   rotation) falls from above the stage to center over 1.2s, with a slight
   vertical stretch while falling (cartoony, not physically realistic —
   this was explicitly OK'd as "doesn't have to be super dynamic, can
   almost be cartoony").
3. On impact: a quick white flash, the drop disappears (squash + fade),
   and simultaneously three violet rings ripple outward from center AND
   the four project names launch outward from the exact center point,
   synced to the first ring's timing (only a 50ms stagger between names,
   not spread across a long independent timeline) so it reads as one
   connected event, not two separate animations.
4. Projects are arranged in an **X layout** (angles -45°/45°/135°/225°),
   NOT a cross/plus shape (which was the first, rejected attempt at
   -90/0/90/180). Same equal-angle, equal-radius rule underneath, just
   rotated 45° from cardinal.
5. All four names are center-anchored with `text-align: center` uniformly
   — an earlier version tried asymmetric left/right text anchoring based on
   angle, which was rejected as "messy." Uniform centering is simpler and
   reads as more intentional for this specific 4-point symmetric layout.
6. **The sequence resets when the section scrolls OUT of view** (the
   IntersectionObserver's else-branch calls `resetSequence()`, clearing all
   rings, hiding the drop, and snapping project nodes back to
   invisible/center) — scrolling back in replays the full sequence from
   scratch. This was an explicit request; do not remove this reset behavior.
7. Hovering OR keyboard-focusing any settled project name blooms a colored
   preview screen from the center point (still a placeholder colored block,
   not a real screenshot), while sibling names dim to 25% opacity.

### About section — real photo now implemented
The owner provided an actual headshot (saved as `img/kristian-about.jpg`).
Quarter-turn pose with arms crossed, natural skin texture (no
over-smoothing issue this time — this photo does NOT need the "disguise
via heavy treatment" workaround discussed for an earlier, rejected photo).
Implemented with the duotone/asymmetric treatment tested earlier in
`reference/img-treatment-preview.html`: grayscale + contrast filter, a
violet-to-black gradient multiplied over it, positioned in a fixed-size
frame (340×420px desktop) to the left of the About text, with the right
edge of the photo fading into the page background rather than a hard
rectangular cut-off. Stacks above the text on mobile instead of
side-by-side. This is real, implemented code now — not a placeholder or a
"still pending" item.

### Still pending, unchanged from before
- Real cropped screenshots for the hover-preview screens (currently colored
  placeholder blocks).
- Mobile version of the work section — owner wants a dropdown/expandable
  list per project (tap reveals preview + a "view project" button, with
  "a similar raindrop effect" on interaction) instead of the desktop X
  layout, which does not translate to narrow viewports. Concept discussed,
  NOT yet designed or built — needs its own dedicated pass.
- Ghost word still "OBSESSED" as an explicit placeholder — not finalized.
- Per-section ghost words (work/about/contact) — not yet built.
- Nav bar hover states — still flagged as generic/lackluster, not yet
  redesigned.

## MAJOR UPDATE 6 — rotation math corrected, ripple spacing fixed, liquid text formation added

### Drop rotation — verified mathematically, not guessed
With `border-radius: 50% 50% 50% 0`, the sharp corner sits at bottom-left
pre-rotation. Two earlier guesses (90°, then a previous 45°) were both
wrong. Working through the actual CSS rotation matrix confirms **135°** is
correct for the sharp point to land straight up. If this shape or
border-radius values ever change, redo this math rather than guessing —
guessing has produced the wrong answer twice in this project already.

### Ripple rings — spacing was the bug, not the concept
Multiple rings were being created correctly, but with only 180ms between
each and a shared 1.8s duration, their leading edges stayed close together
in size at any given moment and visually blended into one thick/blurry
band rather than reading as distinct ripples. Fixed by widening the stagger
to **420ms between each of 4 rings** (reduced from 5 — "a few" per the
owner's own words, not many) and shortening duration slightly to 1.5s so
each ring clears more visual space before the next one starts. Each ring
also has a randomized, slightly irregular border-radius (not a perfect
circle) and gains blur while losing border-width as it expands, so it
dissipates like real water rather than staying a crisp static line.

### Text formation — now liquid, not just a slide-and-fade
Project names now start at `filter: blur(8px)` and sharpen to `blur(0)` as
they settle into place (transition timing: opacity 0.9s, transform 1.3s,
filter 1.1s — filter resolves faster than the position settle, so text
looks focused slightly before it's fully arrived, which reads as more
natural). The position transition also now uses a bouncy easing curve
(`cubic-bezier(.34,1.56,.64,1)`) instead of a flat deceleration — a slight
overshoot-and-settle, closer to how a droplet actually behaves than a UI
element easing into place.








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
