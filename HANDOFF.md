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

## MAJOR UPDATE 7 — current state snapshot, 2026-08-03. Read this first, it supersedes the technical claims above.

Everything above this point is historical — decisions, rejected directions,
and the reasoning behind locked choices (thesis wording, "no em dashes,"
equal-size project titles, violet-only accent, etc. are all still true and
still worth reading). But the *technical* descriptions of what's built
(hover previews as "colored placeholder blocks," work section as a static
radial web, mobile as "not yet designed") are all stale — dozens of commits
have landed since MAJOR UPDATE 6. This section is a clean snapshot of where
the live site actually stands. Full blow-by-blow is in `git log`; commit
messages in this repo are written to carry real context (root causes, not
just "fixed bug"), so `git log -p <file>` is worth reading before assuming
something needs rework.

**If you're a fresh agent picking this up cold (including on a different
device from a synced/joint project): read this section, skim recent
`git log --oneline -20`, then read `index.html` + `css/style.css` +
`js/main.js` directly rather than trusting any doc's paraphrase of current
values** — this project has been burned before (MAJOR UPDATE 5) by a doc/
reference file drifting out of sync with the real site.

### Current section-by-section state (all built, not placeholders)

- **Nav**: lives INSIDE `<section id="hero">` now (absolutely positioned at
  hero's own top edge), not a sibling above it. Same for the footer, inside
  `#contact`. This was a deliberate fix — as separate top-level elements
  with their own `scroll-snap-align`, they each acted like their own extra
  section during scroll-snap, requiring an extra scroll gesture to get past
  them. Don't move them back out without re-solving that.
- **Hero**: ghost word "KRISTIAN", headline "People don't experience your
  design. / They experience your decisions." (owner-edited directly in
  index.html — the second line has a stray `<p>` tag nested inside the
  `<span class="line-inner">`, which is invalid HTML but harmless in
  practice: the sitewide `*{margin:0}` reset zeroes out the `<p>`'s default
  margin, and browsers happily render `<p>` inside `<span>` despite it not
  being valid per the content model, so it just acts as a manual line break.
  Not worth "fixing" unless it starts actually breaking something.)
  Headline reveal is now ONE effect only: opacity fade + a left-to-right
  mask-based wipe per line (`--reveal` custom property, needs `@property`
  registration to animate smoothly — falls back to a plain fade in browsers
  without `@property` support). Explicitly stripped of scale/blur/settle-
  wobble that used to be layered on top — don't re-add them without being
  asked, that combination was deliberately rejected as "messed up."
- **Work section (desktop)**: scroll-triggered ripple reveal, still violet,
  still an X-layout (angles -45/45/135/225), but several rounds beyond
  what's described above:
  - Stage/card sizing is viewport-driven (`min(78vw, 1180px)` wide ×
    `min(40vw, 56vh, 560px)` tall) and deliberately WIDE now, not square —
    positioned via `padding-top` on `.work-section` that's tuned to exactly
    clear the "WORK" ghost word's own height (300px, zero extra buffer) so
    `align-items:center` splits the remaining space evenly above/below the
    card. If you ever change the ghost word's font-size, recompute this —
    the symmetry depends on padding-top matching the ghost's real height
    exactly, not approximately.
  - Node spread uses independent `radiusX`/`radiusY` (not one shared
    radius) to match the wide/short card shape.
  - Hover preview is REAL cropped screenshots now (`img/previews/*.jpg`,
    9:19.5 phone-ratio crops), not placeholder blocks. Restructured into
    `.preview-wrap` (position/size, unclipped) wrapping an inner `.preview`
    (the clipped image box) so a rotating conic-gradient ring
    (`previewRingSpin` keyframe) and four HUD-style corner brackets can
    extend past the image's own rounded corners. Also gets a one-time
    light-sweep shimmer on activation. `--proj-rgb` (set per-project via a
    `.preview-wrap.KEY` / `.mobile-preview-wrap.KEY` class) drives the tint/
    ring/corner/glow color everywhere — same variable, shared rule, both
    desktop and mobile preview elements key off it.
  - The fall itself is still 2.2s (NOT sped up — that was tried and
    explicitly reverted; what actually needed fixing was the trigger firing
    too late, not the fall being too slow). `IntersectionObserver` threshold
    is 0.15 (down from 0.9) so the drop starts within ~80px of scrolling
    toward the section instead of only once it's almost fully in view.
- **Work section (mobile, <700px)**: tap-to-expand accordion, ONE shared
  preview element (`#mobilePreviewWrap` in index.html, `position:fixed`,
  centered on the viewport) — NOT one embedded per accordion item anymore.
  This was a real architectural bug fix, not polish: with a per-item
  preview, tapping a different project opened a different DOM element
  living inside that item's own panel, and since panels above/below it were
  simultaneously collapsing/expanding, the whole thing visibly relocated
  between taps. `setMobilePreview()`/`hideMobilePreview()` in `main.js` now
  just swap that one element's image/label/color and toggle `.active`.
  **Important, hard-won lesson if you touch this again**: it has to be
  `position:fixed` (viewport-relative), not `position:absolute` (section-
  relative) — the tap handler also calls `recenterOnSettledLayout(header)`,
  which scrolls so the TAPPED header sits at viewport-center, and that
  scroll target is different for every item in the list. A section-relative
  preview stayed visually aligned with items near the top (where the
  section's own midpoint and the post-scroll viewport-center happen to
  coincide) but drifted noticeably out of alignment for items further down
  — only caught by explicitly testing the first, middle, and last item, not
  by eyeballing one. If you're debugging "preview looks misaligned" again,
  check this first.
  Also: recentering is deliberately DEFERRED (780ms, matching the panel's
  own `.75s` max-height transition) rather than computed synchronously on
  click. `.work-section` uses `justify-content:center` to center the
  collapsed list, which means the moment a panel starts growing, the flex
  slack that was distributing space above the list starts collapsing, and
  the header's true document position drifts throughout the whole
  transition — reading the position synchronously at click time only ever
  captured the pre-drift value. This is the actual root cause of an old,
  repeatedly-reported "dropdown scrolls up and down weird" bug across
  several earlier fix attempts that only patched the math, not the timing.
- **About/Bio**: real photo (`img/kristian-about.jpg` desktop,
  `img/kristian-about-mobile.jpg` mobile via a `<picture>`/`<source
  media>` swap at the 900px breakpoint) with duotone treatment (grayscale +
  contrast filter + violet gradient multiply). `object-position` is tuned
  per breakpoint to frame his face/neck/chest — if a new photo is ever
  swapped in, expect to re-tune these values by hand (they're specific to
  where the subject sits in each source image, there's no way to make this
  automatic). Photo has `margin-top` on the stacked mobile layout
  specifically so it doesn't fully cover the "BIO" ghost word underneath it.
- **Contact**: has a small looping "listening pulse" now (accent dot +
  softly expanding/fading rings, ~3.6s cycle) sitting left of the CTA
  button, both breakpoints — pure CSS `animation:infinite`, JS
  (`IntersectionObserver` in `main.js`) only toggles an `.in-view` class to
  fade it in/out with the section, doesn't drive the loop itself.
- **Ambient background glow**: removed. `body{ background: var(--bg); }`
  only now — the two low-opacity radial-gradient "atmosphere" layers that
  used to sit behind everything are gone.

### Known gaps / open items, current as of this update
- **Mobile scroll-snap**: `min-height:100dvh` was added alongside the
  existing `100vh` on `.snap-section` and `.about, .contact` (progressive
  enhancement — falls back silently where `dvh` isn't supported) to address
  mobile browsers' address-bar show/hide making `100vh` taller than the
  actually-visible viewport. **This has NOT been verified on a real mobile
  device** — only in a desktop browser's mobile-viewport emulation, which
  can't reproduce the dynamic-toolbar behavior this fix targets. If scroll-
  snap still feels off on an actual phone, this is the first thing to
  revisit; check real device behavior before assuming the fix didn't work.
- **Case study pages**: only `nitefind.html` and `zentra.html` exist.
  `smiteforge.html`, `freya-sews.html`, `amun.html` are still not built —
  same gap noted in earlier updates, unchanged.
- **`HERO-BUILD-SPEC.md` is now stale** (flagged at the top of that file
  too) — describes an early hero draft that doesn't match the live site at
  all anymore (wrong ghost word, wrong headline). Kept for history, not a
  build reference.
- **`reference/hero-pattern.html` and `reference/raindrop-v4.html`** are
  the only files left in `reference/` — `web-ripple-center.html` and
  `work-index-pattern.html`, referenced in earlier updates above, were
  never actually present in this repo snapshot (or were removed at some
  point) and describe designs that are no longer current anyway (the work
  section is the X-layout ripple reveal, not a radial web). Don't go
  looking for them.
- Nav bar hover states — still the original flag from early updates,
  never revisited. Still just color-fade on hover, no bespoke treatment.

### Environment/testing gotcha worth knowing
If you're testing changes by opening `index.html` directly as a `file://`
URL in an automated/headless browser tool, watch for stale caching — in at
least one session, a `file://` tab kept serving an old cached copy of
`style.css`/`main.js` across multiple reloads (even with cache-disabling
navigation flags) with no visible indication it was stale, which produced
confusing false "this fix isn't working" results. Serving the folder over a
real local HTTP server (e.g. `python3 -m http.server`) and hard-reloading
(or cache-busting the URL/stylesheet link) resolved it reliably. Worth
doing from the start rather than re-discovering this.

## MAJOR UPDATE 8 — background bloom + mobile pill selector, 2026-08-03. Supersedes MAJOR UPDATE 7's "Work section (mobile)" and background-wash claims above.

- **Background bloom (Work + Contact)**: `.work-section` no longer sits
  permanently violet-tinted (`background:rgba(var(--accent-rgb),0.14)` is
  gone). Both Work and Contact now start pure black and animate to that same
  0.14 wash via a shared `.section-bloom` element (a real div, one per
  section — `#workBloom`, `#contactBloom` — not a `::before`, specifically so
  JS can set custom properties and toggle a class on it directly). It's a
  `clip-path:circle()` expanding from 0% to 150% over 4.5s (slowed from an
  initial 3s, see the "raindrop timing" note below), centered on
  `--bloom-x`/`--bloom-y` custom properties that `triggerSectionBloom()` in
  `main.js` computes from the real on-screen position of whatever caused it —
  the ripple-stage's center for Work, **`#contactStage`'s center for
  Contact** (see next bullet; this was originally tied to the listening-
  pulse's position instead, changed same day once an actual visible raindrop
  was added to Contact too — the pulse never drove the bloom for long).
  Resets to black instantly on scroll-out and re-blooms on re-entry — the CSS
  transition is declared only on the `.bloomed` end-state, not the base rule,
  which is the same trick `.drop-wrap`'s `.falling`/`.impact` classes already
  used elsewhere in this file: forward animates, removing the class snaps
  back with no transition. Hero and About are untouched, still plain
  `var(--bg)`.
  Verified via direct pixel/DOM measurement (not just eyeballing) that the
  project-preview cards stay pure black throughout (bloom is `z-index:-1`,
  behind everything) and that scroll-out really does reset to black before
  re-blooming on scroll-back-in.

- **Contact also gets a real raindrop now, not just a bloom**: `#contactStage`
  (a zero-size anchor at the section's own center, same pattern as
  `.work-mobile-stage`) plays the same `playRaindrop()` drop-fall + ripple
  sequence the work section uses, landing dead-center of the section
  regardless of where the text content sits — on wide viewports that's empty
  space to the right of the (left-aligned, max-width-capped) copy; on narrow
  ones it can land near/behind the copy, which is fine because
  `.contact-stage` is `z-index:1`, BELOW `.contact .wrap`'s content
  (`z-index:2`) — the drop/rings/glow read as passing behind the text, not
  obscuring it. Independent of the listening-pulse's own fade-in/out (that
  logic in `main.js` was reverted back to exactly what it was before this
  update — the pulse doesn't drive anything else anymore). Resets/replays on
  every scroll in/out via its own `IntersectionObserver` (threshold 0.15,
  same as Work's desktop ripple) rather than playing once — there's no
  one-shot UI state here (unlike the mobile work entrance) that a replay
  would risk re-triggering incorrectly.

- **Raindrop timing, sitewide**: the whole drop/ring/glow/bloom sequence was
  slowed and re-eased for a more fluid/liquid feel, on request, across all
  three instances (desktop work, mobile work, Contact) rather than just one.
  Desktop fall 2.2s → 3.2s, ring duration 2.3s → 3.4s, ring stagger 580ms →
  720ms, glow 1s → 1.6s, node-placement cascade 90ms → 130ms per node; mobile
  fall 1.6s → 2.2s, ring duration 0.95s → 1.5s, stagger 380ms → 480ms, glow
  0.85s → 1.3s, pill-placement cascade 90ms → 120ms per pill. Contact's new
  raindrop reuses the desktop timings exactly (one signature pace, not a
  third distinct tuning). The ring/glow expansion easing inside `playRaindrop()`
  itself changed from plain `ease-out` to `cubic-bezier(.16,1,.3,1)` (the same
  curve already used for the hero/header-text liquid reveals elsewhere in
  this file) — reads as dissipating into the surface rather than mechanically
  shrinking to nothing. `holdBeforeImpact` in every `playRaindrop()` call
  still has to match its container's `.falling` CSS transition duration
  exactly, same constraint as always — if you retune one, retune the other.

- **Mobile work section: pills, not an accordion**: The tap-to-expand
  accordion described in MAJOR UPDATE 7 is gone — replaced by a row of
  compact pills (`.work-pills` inside `#workPillsWrap`, one `.work-pill` per
  project) sitting near the bottom of the section, below the same fixed
  `#mobilePreviewWrap` preview container from before (unchanged: still
  `position:fixed`, still viewport-centered, still updated in place by
  `setMobilePreview()`). Tapping a pill just swaps the preview's image/
  label/color/link — the preview container itself never moves or resizes,
  and neither does the pills row, so the entire class of scroll-recentering
  bug MAJOR UPDATE 7 documented (`recenterOnSettledLayout()`, the 780ms
  delay, the fixed-vs-absolute preview positioning fight) is gone from the
  codebase, not just fixed — there's nothing left that changes height or
  needs the page to scroll. A persistent "view project" link
  (`#workPreviewLink`, styled with the same `.work-item-btn` look the old
  per-item panel used) sits under the pills and its `href` updates to match
  whichever project is active.
  The one-time entrance drop/ripple (`.work-mobile-stage`,
  `playMobileEntrance()`) is unchanged — still exactly one drop per visit,
  never replayed on tap. What used to happen on impact (the accordion's
  `clip-path` reveal + staggered header-text reveal) now happens to the pills
  wrap instead (same `clip-path:circle()` reveal pattern, self-centered
  rather than anchored to the drop's impact point since the pills sit well
  below it), immediately followed by auto-selecting the FIRST project once
  the last pill's stagger-in finishes — with no hover on a touch device, an
  empty fixed preview box would otherwise sit there unpopulated until the
  first tap, which read as broken rather than intentional.
  Active-pill color reuses each project's own `--proj-rgb` (the same custom
  property already driving the preview's ring/corner/glow color) rather than
  the generic sitewide accent — `.work-pill.KEY` was added alongside the
  existing `.preview-wrap.KEY`/`.mobile-preview-wrap.KEY` selector list, same
  four colors, same place they're defined.
  Reduced-motion: `.section-bloom` and `.work-pills-wrap` both got the same
  `clip-path:none !important` + plain-opacity-fade override the rest of this
  file already uses for other `clip-path` reveals: verified via a Playwright
  run with `reducedMotion:'reduce'` that this fires no console errors and
  still lands on exactly one active pill (the JS fallback path skips
  `playRaindrop` entirely and calls the same reveal/select functions
  directly, rather than being a separate code path with its own logic).

- **Desktop spacing symmetry (`.work-section` padding-top:300px)**: audited,
  not changed. Measured `getBoundingClientRect()` gaps (ghost-bottom-to-
  card-top vs. card-bottom-to-section-end) directly at three viewport sizes
  (1440x900, 1920x1080, 1280x800) — they land exactly equal at every size
  (e.g. 27.84px vs 27.84px at 1440x900), confirming the existing comment's
  claim about `padding-top:300px` + no `padding-bottom` + `align-items:center`
  already being correct. No CSS change was needed here; a comment was added
  noting the specific measurement so a future pass doesn't have to re-derive
  it from scratch.

## MAJOR UPDATE 9 — splat impact, Contact raindrop reverted, mobile preview/scroll fixes, pills moved above the preview, 2026-08-03

- **Raindrop impact now reads as a splat, not a shrink-fade**: `.drop-wrap.impact`
  (both `.ripple-stage` and `.work-mobile-stage`) used to just scale down on
  the Y axis and fade opacity -- looked like the drop was shrinking away, not
  hitting anything. It now widens (scaleX up) while flattening (scaleY way
  down) -- `scale(2.6, 0.1)` desktop, `scale(2.2, 0.1)` mobile -- and holds
  briefly before fading with a growing blur (`filter:blur()`, delayed via
  transition-delay) rather than cutting straight to transparent, so it reads
  as spreading flat and melting into the surface. Base `.drop-wrap` needed an
  explicit `filter:blur(0px)` added so that transition has a real starting
  value to animate from.
- **Contact's raindrop (added in UPDATE 8) is reverted.** Contact does not
  get its own falling drop -- `#contactStage` and all its CSS/JS are gone.
  Contact's background bloom is back to being tied to the listening-pulse's
  own `IntersectionObserver`/position, exactly as it was before UPDATE 8
  first added the raindrop. This was a deliberate change of direction, not a
  bug fix -- don't re-add a Contact raindrop without being asked again.
- **Mobile preview no longer gets left on screen after scrolling past Work.**
  `#mobilePreviewWrap`/`#mobilePreviewCopy` are `position:fixed`, so they
  don't automatically leave with the rest of `#work` the way in-flow content
  does. A new `IntersectionObserver` on `#work` (threshold 0, `rootMargin:
  '-2px'`) toggles their `.active` class off the moment `#work` leaves the
  viewport and back on when it returns -- without replaying the one-shot
  entrance or re-selecting a project, since `setMobilePreview()` already left
  the right content in place. The `-2px` rootMargin isn't decorative: with
  scroll-snap landing sections exactly edge-to-edge, `#work`'s bottom can sit
  at EXACTLY 0px from the viewport top with zero true overlap, and that's an
  ambiguous boundary case for `threshold:0` -- observed actually firing
  `isIntersecting:true` with nothing visible. Shrinking the effective root by
  2px removes the ambiguity. If this regresses, check this rootMargin first.
- **Mobile scroll-snap softened.** `scroll-snap-type:y mandatory` +
  `scroll-snap-stop:always` (both still true on desktop) forced a full stop
  at literally every section on mobile regardless of swipe speed, which read
  as the page fighting the gesture rather than assisting it -- explicit
  owner feedback: scrolling should "guide," not "control." Below 700px,
  `html` now gets `scroll-snap-type:y proximity` and `.snap-section` gets
  `scroll-snap-stop:normal` -- snapping only pulls you in once you're
  already close to a section edge; a hard swipe can sail past a section
  entirely instead of being physically stopped there. Desktop's wheel-
  resistance controller (bottom of `main.js`) is unaffected either way --
  it's wheel-only by design and was never touching mobile's touch-scroll.
  **This is a judgment call, not a definitively "solved" problem** -- the
  owner flagged it as an ongoing issue they weren't sure of the fix for; if
  it still feels off, `proximity` vs `mandatory` and the exact snap-stop
  value are the first things to revisit, not the wheel controller.
- **Mobile pills moved above the preview; new per-project description added
  below it.** Previously pills sat near the bottom of the section with a
  static "view project" link inside them. Now: `.work-pills-wrap` sits above
  the fixed preview (`bottom:calc(50% + 187px)` -- 187px is the preview's own
  half-height, 162.5px, plus a ~24px gap), and a new fixed sibling element,
  `.mobile-preview-copy` (`#mobilePreviewCopy` in index.html, containing
  `#mobilePreviewDesc` + the "view project" link, which moved here from
  inside the pills), sits below it at the mirrored offset,
  `top:calc(50% + 187px)`. Both offsets share that one constant on purpose --
  if the preview's fixed 150x325 size ever changes, recompute both together,
  not just one. The description text cross-fades in sync with the image swap
  in `setMobilePreview()` (same isFreshOpen/180ms-swap-timer logic, one more
  piece of content going through it) and currently just reuses each
  project's existing `hook` copy (`p.desc || p.hook` -- add a dedicated
  `desc` field per project once real "what this project is about" copy is
  written; the owner was explicit that the copy itself isn't finalized yet,
  only the mechanism).

## MAJOR UPDATE 10 — index.html/CSS/JS sync fix, Contact CTA restored, hero sentence timing, raindrop sink-in refinement, 2026-08-03

- **`#workBloom`/`#contactBloom` sync gap, confirmed and fixed.** Verified
  directly against the deployed GitHub Pages site (not just local files) --
  `#workBloom` was already present (fixed in a prior session), but
  `#contactBloom` genuinely did not exist in either the live or local
  `index.html`, meaning Contact's background bloom (`triggerSectionBloom()`
  in main.js) was silently a no-op there. Added `<div class="section-bloom"
  id="contactBloom">` as the first child of `#contact`, matching `#work`'s
  pattern exactly.
- **Contact's `<a class="cta mono">` had no `.cta-row` wrapper**, so the
  matching CSS rule (`.contact .cta-row{ margin-top:40px; ... }`) was dead --
  the button sat directly after the paragraph with zero intentional top
  spacing. Restored the `.cta-row` wrapper (which also restores the
  `#listenPulse` markup inside it -- see next bullet) rather than deleting
  the CSS rule and moving the margin onto `.cta` directly, since a real
  layout wrapper was needed anyway to hold the pulse and button side by
  side; moving the margin onto `.cta` alone would have pushed the button
  down relative to the pulse dot instead of moving both together.
- **`#listenPulse` (the dot + 3 rings) was also missing from `index.html`**,
  independent of the bloom/cta-row issue -- restored as part of the
  `.cta-row` fix above. Its own JS/CSS (fade-in-with-section, the 3.6s
  breathing animation) were never touched and just started working again
  once the markup existed.
- **Contact's mobile treatment changed on purpose: bloom off, pulse
  bigger.** `.contact .section-bloom{ display:none; }` under
  `max-width:720px` -- Contact gets NO background wash on mobile now
  (desktop keeps it, still tied to the pulse's own trigger in main.js,
  untouched). In its place, the pulse itself is scaled up at that same
  breakpoint: dot 10px->16px, ring keyframe max size 34px->64px, peak
  opacity 0.5->0.75. The 3.6s cycle, 70%-opacity fade point, and 1.2s
  ring-stagger are all UNCHANGED -- only size/opacity moved, not cadence.
- **Hero headline timing: lines 2-3 now read as one sentence.** The hero
  markup is 3 `<div>`s across 2 sentences ("People don't experience your
  design." / "They experience" + "your decisions." split across two lines
  for the reveal). `playHeroReveal()` in main.js used to apply a flat
  `i * 2.6s` delay to every line, which put a full 2.6s beat between lines 2
  and 3 even though they're one thought -- read as two disconnected
  fragments. Now: line 0 gets 0s, line 1 gets the full 2.6s sentence pause,
  every line after that gets only +0.35s off the previous one
  (`SENTENCE_PAUSE`/`SAME_SENTENCE_GAP` constants in main.js). Verified via
  the actual computed `transitionDelay` values: 0s / 2.6s / 2.95s.
- **Raindrop impact changed from a "splat" to a "sink in."** The previous
  `scale(2.6, 0.1)` (desktop) / `scale(2.2, 0.1)` (mobile) pancaked wide
  enough to read as hitting something solid. Now `scale(1.4, 0.15)` /
  `scale(1.3, 0.15)` -- still narrows/flattens but far less extreme -- PLUS
  a `translateY(10px)` / `translateY(8px)` added to the same transform so
  the drop keeps drifting down while it fades instead of stopping dead and
  squashing in place. `playRaindrop()` in main.js also gained an optional
  `glowFadeDelay` param: `.impact-glow`'s width/height still start
  expanding immediately, but its opacity now holds near peak (0.4) for
  ~0.3s before fading, timed to roughly match how long the drop itself
  takes to fully disappear (0.22s/0.2s delay + 0.5s/0.55s fade) -- so the
  glow is still bright when the drop vanishes rather than already faded,
  meant to read as "something absorbed it."
- **Spacing/alignment audit (item 9 of that session's request): no bugs
  found and fixed, three things flagged instead of guessed at.** Full pass
  across every section's CSS plus direct-viewport (NOT full-page --
  Playwright/Chromium's full-page screenshot mode renders `position:fixed`
  elements at the wrong place entirely, which nearly produced a false
  "leftover mobile preview" bug report here; always verify fixed-position
  elements with a real-viewport screenshot at the actual scroll position,
  not `fullPage:true`) screenshots at desktop and mobile for hero/work/
  about/contact. Nothing found that looked like an accidental
  inconsistency worth changing. Three things ARE worth knowing about
  though:
  - `.contact-group:first-of-type{ margin-top:36px; }` vs sibling
    `.contact-group{ margin-top:32px; }` -- a 4px difference with no
    comment explaining it. Could be deliberate (compensating for the
    `.cta-row`'s own 40px margin-top above it) or could be a stray
    leftover value. Not changed -- flagging per instruction not to guess.
  - `.hero .headline .l2` (style.css) and the entire `.philosophy{...}`
    block target classes/a section that no longer exist anywhere in
    `index.html` (headline is `.l1`+`.l3`+`.l3` now; the Philosophy
    section was removed back in MAJOR UPDATE 2). Both are dead CSS --
    harmless, no visual effect, just clutter. Not removed this pass since
    it wasn't part of the ask, but safe to delete whenever someone's
    already in that area of the file.
  - `.about .section-head` gets `padding-top:0` from BOTH a CSS rule
    (`.about .section-head{ padding-top:0; }`) and a redundant inline
    `style="padding-top:0;"` already on the element in `index.html`.
    Harmless (same value from both), just duplicated.

## MAJOR UPDATE 11 — hero headline reveal rebuilt as word-by-word, not line-by-line, 2026-08-03

The line-level mask-wipe reveal from MAJOR UPDATE 10 (and every version
before it) is gone. Owner feedback, twice in a row, was that the headline
still felt too slow to read as "one thought forming" -- first the per-line
delays were shortened, then the underlying per-line wipe duration itself was
still the bottleneck: a single short line taking 4.4s to wipe in left-to-
right is slow regardless of how the delays between lines are tuned, since
each individual line's OWN reveal takes that long no matter what.

**What changed**: `playHeroReveal()` in `main.js` now splits each line's
text into individual `<span class="word">` elements (built once, up front,
from the existing plain-text content -- not hardcoded into `index.html`),
and reveals them with a fast, uniform per-word stagger
(`WORD_STAGGER = 0.06s`) instead of one slow wipe per line. The `--reveal`
custom property, its `@property` registration, and the mask-image gradient
are all gone from `style.css` -- replaced by a simple `.word` opacity/
transform/filter transition (`.35s`/`.45s`/`.3s`, all fast).

**The one deliberate pause** is `SENTENCE_PAUSE = 0.5s`, applied ONLY
between line 0 ("People don't experience your design.") and line 1 ("They
experience") -- that's a real sentence boundary. There is NO extra pause
between line 1 and line 2 ("your decisions.") beyond the same 0.06s word
stagger everything else uses -- they're one sentence split across two lines
purely for layout, and the whole point of this rebuild was making that
boundary invisible in the timing. Total reveal time end-to-end is now
roughly 1.4s (verified: last word's `transitionDelay` is 0.98s + its own
~0.45s transition), down from over 7s in the original per-line version.

If asked to tune this further: `WORD_STAGGER` and `SENTENCE_PAUSE` are the
two knobs, both plain constants at the top of the hero block in `main.js`.
Don't reintroduce a per-line delay/gap value instead of a per-word one --
that's the specific approach that was tried twice and rejected as too slow
both times.

## MAJOR UPDATE 12 — hero reveal corrected: word-by-word structure was right, speed/style were wrong, 2026-08-03

MAJOR UPDATE 11 (immediately above) fixed the SEQUENCING (word-by-word,
sentence-2 flowing with no gap at its line break) but overcorrected on
speed and dropped the wrong visual effect. Owner feedback: the *word-by-word
timing structure* was correct, but the result "appear[ed] way too fast," and
it needed to go back to being "a slow fluid wipe to kind of match our ripple
liquid animations" -- a fast opacity/blur/translateY fade (what UPDATE 11
shipped) reads as snappy, out of step with every other animation on this
site (raindrop fall, ripple rings, section bloom) which all run several
seconds and use a mask/clip-path-style expanding reveal, not a quick fade.

**What changed, on top of UPDATE 11's structure (unchanged: still per-word,
still no pause at the sentence-2 line break, still one real pause between
sentence 1 and 2)**:
- `.hero .headline .word` in `style.css` is back to the ORIGINAL --reveal
  mask-sweep technique (the one the very first version of this effect used
  at the LINE level) -- `-webkit-mask-image`/`mask-image` with a
  `linear-gradient` driven by an animatable `--reveal` custom property
  (needs its `@property` registration back too) -- instead of the
  opacity+translateY+blur fade UPDATE 11 used. This is a literal left-to-
  right WIPE per word now, not a fade. Also back to ONE effect only (just
  the wipe) -- no transform/blur layered on top, matching this codebase's
  established "combining effects reads as busy" preference.
- Both the per-word transition duration AND the stagger between words got
  much slower: transition `opacity 1.2s` / `--reveal 1.4s` (was `.35s`/
  n/a), `WORD_STAGGER` `0.06s -> 0.3s`, `SENTENCE_PAUSE` `0.5s -> 0.9s`.
  Total reveal time end to end is now ~4.7s (last word delay 3.3s + its own
  1.4s wipe) -- deliberately in the same multi-second range as the site's
  other liquid animations, not the ~1.4s UPDATE 11 landed on.

Verified via the same method as UPDATE 11 (actual `transitionDelay` values
read off each word span, plus screenshots at several points through the
sequence) that sentence 1 wipes in over roughly 0-2.6s, holds through the
0.9s pause, then sentence 2 wipes in continuously from ~2.4s to ~4.7s with
no visible break at its own internal line wrap.

If tuning this again: the two speed knobs are the SAME `WORD_STAGGER`/
`SENTENCE_PAUSE` constants UPDATE 11 introduced (still true, just different
values now) plus the `.word` transition durations in `style.css`. Don't
drop back to opacity/blur/transform for the reveal effect itself without a
specific reason to -- the mask wipe is what reads as "liquid" and matching
the rest of the site; that was the actual point of this update, not just a
timing tweak.

## MAJOR UPDATE 13 — hero reveal is per-LINE again, not per-word: word-by-word was never the ask, one continuous sweep is, 2026-08-03

UPDATE 11 and 12 (immediately above) both operated on a per-WORD reveal --
splitting each line into `<span class="word">` elements and animating each
one's own `--reveal`/opacity independently, staggered. Owner feedback made
clear this was the wrong structure the whole time, not just wrong speed:
"one long string of reveal, not separate words starting the reveal at
different times." Per-word was never asked for -- it was this agent's own
interpretation of "appearing one word after the other" a few turns back,
and it should have been read as describing the VISUAL RESULT of a
continuous wipe (words becoming visible in sequence as a sweep passes over
them), not literally "give each word its own independent reveal
animation."

**What changed**: the word-splitting is gone entirely from `main.js` (no
more `<span class="word">`, no more building/storing a `lineWords` array).
`playHeroReveal()` is back to animating each of the 3 `.headline > div`
LINES directly, one `--reveal` mask sweep per line -- structurally very
close to where this started (MAJOR UPDATE 10 and earlier), except for the
one real fix that's carried forward from every iteration since: sentence 2
("They experience" / "your decisions.") is two separate line elements, and
line 2's delay is set to start EXACTLY when line 1's own wipe finishes
(`delay += duration` after each line, `SENTENCE_PAUSE` only added before
line 1) -- zero gap, so despite being two DOM elements they read as one
uninterrupted sweep straight through the wrap point. That specific fix is
NOT new to this update; it's been the correct part of every version since
UPDATE 10 flagged the problem, just previously implemented as "no gap in
the per-word stagger" instead of "no gap in the per-line chain."

**Also new this update**: each line's `transition-duration` is no longer a
flat value -- it's computed in JS as `wordCount * REVEAL_RATE` (0.4s/word),
so the wipe SPEED stays visually consistent across lines of different
lengths (line 0 has 5 words and takes 2.0s; "They experience" has 2 words
and takes 0.8s) rather than every line taking the same fixed duration
regardless of how much text it has to sweep across.

`style.css` reverted to a single `.hero .headline > div{ --reveal:0%; ...
mask-image:...; }` rule (the `.word` rule and its `display:inline-block`
sibling are gone). The `transition` value declared there (`2s`) is only a
fallback -- `main.js` sets `transitionDuration` inline per line at play
time, which takes priority.

Verified by reading each line's actual `transitionDelay`/`transitionDuration`
off the DOM (line 0: 0s/2.0s: line 1: 2.7s/0.8s; line 2: 3.5s/0.8s -- line 2
starts at literally the same moment line 1 ends) and screenshots through
the sequence, including one at 500ms that shows the wipe edge mid-sweep
INSIDE a word ("expe|rience") -- confirming it's one continuous sweep
passing through word boundaries, not discrete per-word reveals.

If tuning this again: `REVEAL_RATE` and `SENTENCE_PAUSE` in `main.js` are
the two knobs now. Do not reintroduce per-word spans/staggering -- that
specific approach was tried twice (UPDATE 11 and 12) and explicitly
rejected both times, for two different reasons (too fast, then still
structurally wrong even after slowing down).

**Same-day follow-up**: `REVEAL_RATE` doubled again, `0.4s -> 0.8s` per
word (line 0's wipe is now 4.0s, "They experience"/"your decisions." are
1.6s each), per explicit owner request to slow down the per-line wipe
speed specifically. `SENTENCE_PAUSE` (0.7s, the gap between the two
phrases) was explicitly NOT touched -- only the in-line sweep speed
changed.

**Second same-day follow-up**: the single shared `REVEAL_RATE` is gone,
split into `SENTENCE1_RATE` (1.2s/word) and `SENTENCE2_RATE` (0.8s/word,
unchanged from the prior tuning) -- explicit request to slow down sentence
1 specifically (its wipe is now 6.0s, up from 4.0s) while sentence 2 keeps
its existing pace. `SENTENCE_PAUSE` DID move this time, `0.7s -> 0.4s`,
because the request was for sentence 2 to start "a little sooner" and for
the two sentences to "feel cohesive" -- shortening the gap between them
is what that meant here, despite the earlier note above saying not to
touch it. Current full timeline: line 0 at 0s/6.0s, line 1 at 6.4s/1.6s,
line 2 at 8.0s/1.6s (chained with zero gap to line 1, as always). Total
reveal is now ~9.6s.
If tuning again: three knobs now, `SENTENCE1_RATE`, `SENTENCE2_RATE`,
`SENTENCE_PAUSE`. There's no longer a rule against moving `SENTENCE_PAUSE`
-- both it and the two rates are fair game depending on what's actually
being asked for. Read the request rather than assuming a prior "don't
touch X" note still applies.

**Third same-day follow-up**: added `OPENING_DELAY` (0.4s) before line 0
starts -- previously it fired the instant `playHeroReveal()` ran, which
read as too abrupt on load. `SENTENCE_PAUSE` shortened again, `0.4s ->
0.2s`, so sentence 2 starts even sooner after sentence 1 finishes. Current
full timeline: line 0 at 0.4s/6.0s, line 1 at 6.6s/1.6s, line 2 at
8.2s/1.6s.
Also: `.hero .headline .l3`'s vertical spacing was tightened --
`line-height:1.15 -> 1.0` AND `margin-top:18px -> 6px` (desktop),
`margin-top:12px -> 4px` (mobile). Both had to move together -- at this
font-size (100px desktop), most of the visible gap between "They
experience" and "your decisions." was the font's own internal leading
from `line-height:1.15` (a 115px-tall line box around a ~100px glyph),
not the margin itself; cutting margin-top alone would barely have moved
the actual visual gap. Measured directly (`getBoundingClientRect` on both
`.l3` elements): 18px gap before, 6px after.

**Fourth same-day follow-up**: `SENTENCE1_RATE`/`SENTENCE2_RATE` are gone,
collapsed back into a single `REVEAL_RATE = 1.2` shared by both sentences
-- explicit request to make sentence 2 "copy" sentence 1's own animation
style/speed rather than having its own faster rate. `SENTENCE_PAUSE`
shortened again, `0.2s -> 0.1s`. Current full timeline: line 0 at
0.4s/6.0s, line 1 at 6.5s/2.4s (2 words * 1.2s/word, up from 1.6s at the
old 0.8s/word rate), line 2 at 8.9s/2.4s (still zero gap from line 1).
If tuning again: `OPENING_DELAY`, `REVEAL_RATE`, `SENTENCE_PAUSE` -- back
to three simple knobs, one shared rate for the whole headline again. Don't
reintroduce a per-sentence rate split without being asked; that was tried
and explicitly undone this update.

**Fifth same-day follow-up**: the per-sentence rate split IS back --
`REVEAL_RATE` split into `SENTENCE1_RATE` (1.2, unchanged) and
`SENTENCE2_RATE` (0.5, new) because the owner then asked for "they
experience your decisions" specifically to "start appearing faster."
Worth understanding why this isn't a contradiction of the previous
entry's advice: "copy sentence 1's animation STYLE" (satisfied by both
sentences sharing the same mask-wipe technique, unchanged) is a different
axis from "play at the same SPEED" (which this follow-up explicitly
undoes). `SENTENCE_PAUSE` also dropped further, `0.1s -> 0.05s`, for a
near-immediate start after sentence 1. Current full timeline: line 0 at
0.4s/6.0s (unchanged), line 1 at 6.45s/1.0s, line 2 at 7.45s/1.0s (still
zero gap from line 1) -- sentence 2 now finishes at 8.45s total, down
from 11.3s before this follow-up.
The actual lesson here: don't treat any single prior note in this file as
a permanent rule -- read what's being asked for THIS turn. "Style" and
"speed" are separate knobs on this effect (mask-wipe technique vs.
duration/rate), and a request about one doesn't imply anything about the
other.

## MAJOR UPDATE 14 — hero reveal RESET to the simplest possible version; ignore the mask-wipe/per-sentence-rate detail above, 2026-08-03

Everything above this point about the hero headline reveal (word-splitting,
the `--reveal` mask-sweep, `SENTENCE1_RATE`/`SENTENCE2_RATE`,
`SENTENCE_PAUSE`, `OPENING_DELAY`) is **gone**. None of it exists in the
code anymore. Owner feedback, verbatim: "Something isn't working right for
the hero text. You keep switching the animations on the hero text." That
was accurate -- five straight rounds of increasingly fiddly tuning (see
everything above) had drifted into genuinely inconsistent, hard-to-reason-
about behavior. The fix was not another tuning pass; it was throwing out
all the special-casing and rebuilding the simplest version that satisfies
the actual, stable requirement: **one animation style, same for every
line, appearing sequentially, slow and fluid.**

**What it is now**: `.hero .headline > div` is a plain `opacity:0 -> 1`
transition, `2s ease`, IDENTICAL for all 3 lines -- no mask-image, no
`--reveal` custom property, no `@property`. In `main.js`,
`playHeroReveal()` sets each line's `transitionDelay` to `i * LINE_DURATION`
(0s, 2s, 4s) and adds `.placed` -- that's the entire mechanism. No word-
splitting, no per-sentence branching, no chained-delay math for a line
wrapping mid-sentence. Every line behaves identically; sentence 1 vs.
sentence 2 is not a concept the code knows about anymore.

**If asked to tune this again**: there is exactly one knob,
`LINE_DURATION` in `main.js` (currently `2`, controls both how long each
line's own fade takes AND the gap before the next line starts, since
delay is derived directly from it). Before adding ANY new distinction
(a different rate for one line, a pause that isn't just "the next line's
delay slot", reintroducing a wipe/mask instead of a fade) -- stop and
reconsider whether that's really what's being asked, or whether it's this
agent over-engineering a simple request again. The last five rounds of
"just this one more tweak" are exactly how this broke down last time.

## MAJOR UPDATE 15 — UPDATE 14 was itself a misread: it IS word-by-word, and it IS a wipe, 2026-08-03

Immediately after UPDATE 14 shipped, the owner corrected it: "Misunderstood.
Wipe in animation not fade in. Wipe in left to right. One word at a time.
Longer pause between the two different phrases." So the "reset to the
simplest version" framing in UPDATE 14 was itself wrong on two counts --
UPDATE 14's plain per-LINE opacity fade was not what was wanted; word-by-
word WIPE (which had been built, then deliberately reverted, THREE updates
earlier at UPDATE 13, in response to what looked at the time like a
rejection of per-word reveals) was actually correct after all. That
UPDATE-13 reversion was the actual misread, not the word-by-word structure
itself.

**What it is now**: word-splitting is back (`<span class="word">`,
built once in `main.js` from each line's plain text, exactly like the
UPDATE-11/12 versions). Each `.word` gets the `--reveal` mask-sweep
technique (real WIPE, not opacity/blur/transform) -- `style.css`,
`.hero .headline .word`, `opacity .8s ease` / `--reveal .9s
cubic-bezier(.45,0,.2,1)`. `main.js` has two constants:
`WORD_STAGGER = 0.3` (gap between each word's own wipe starting, applied
uniformly -- including straight through the line 1/2 wrap inside phrase 2,
no special case there) and `PHRASE_PAUSE = 1.2` (a clearly LONGER gap,
inserted only once, between line 0 finishing its words and line 1's first
word starting -- that's the one real "different kind of pause" in this
version, and it's deliberate, not a bug). Current per-word delays: line 0
words at 0/.3/.6/.9/1.2s, then "They" at 2.7s (1.2s pause + the normal .3s
increment), "experience"/"your"/"decisions." following at .3s apart
through 3.6s.

**The actual lesson, updated**: don't assume a prior "this was rejected,
don't bring it back" note (like UPDATE 13's) is permanently true either --
re-verify against what's being asked THIS turn, same as every other note
in this file. A rejection of one specific past IMPLEMENTATION (which had
its own particular timing/style problems) is not necessarily a rejection
of the underlying STRUCTURE (per-word reveal) that implementation used.

**Same-day follow-up**: word-to-word timing changed from a fixed
`WORD_STAGGER` (flat 0.3s gap for every word regardless of length) to
`CHAR_RATE` (0.08s/character) -- each word's own wipe duration is now
`word.length * CHAR_RATE`, and the next word's delay is that word's delay
+ its own duration (zero gap, fully chained, not just a shorter fixed
gap). Explicit request: make the words "flow onto the screen as if you're
writing them," like natural handwriting pace, where a long word
("experience", 0.8s) visibly takes longer than a short one ("your",
0.32s) instead of every word taking the same fixed time. The wipe visual
style itself (--reveal mask-sweep) and `PHRASE_PAUSE` (1.2s, between the
two phrases) are both unchanged -- this only touched the word-to-word
rhythm within each phrase.
If tuning again: `CHAR_RATE` is the one knob for word-flow speed now,
`PHRASE_PAUSE` is the separate knob for the gap between phrases. Don't
reintroduce a flat per-word stagger -- character-proportional + zero-gap
chaining is specifically what "handwriting" pacing meant here.

**Immediate same-day correction**: word-splitting is GONE again. Owner
feedback: "It is now being displayed in the correct order [the phrase
sequencing/pacing was right]. Instead of pauses between words appearing
we want one fluid motion of letters appearing." The per-word version
(`<span class="word">`, chained with zero TIME-gap) still had a visible
discontinuity: each word was its own independently-masked element, so the
reveal edge visually JUMPED from the end of one word to the start of the
next instead of continuously sliding through the space between them --
zero time-gap doesn't mean zero visual-jump.
Fix: back to a single `--reveal` mask sweep per LINE (not per word) --
same technique UPDATE 13 used, this time with each line's duration set to
`line.textContent.length * CHAR_RATE` (character count, not word count,
for finer proportionality) instead of a flat per-line value. The edge now
moves continuously through every character AND the spaces between words,
which is what actually reads as "one fluid motion of letters appearing."
`PHRASE_PAUSE` (1.2s) and the zero-gap chain between line 1 and line 2
(so phrase 2 is one continuous sweep across its own line wrap) are both
unchanged. Current timeline: line 0 at 0s/2.88s (36 chars), line 1 at
4.08s/1.2s (15 chars, after the phrase pause), line 2 at 5.28s/1.2s
(15 chars, zero gap from line 1).
**Pattern worth naming explicitly**: this is the second time a per-word
version got built, then reverted back to per-line, for two DIFFERENT
underlying reasons (UPDATE 13: felt structurally disconnected; this time:
zero-gap chaining still isn't the same as zero visual discontinuity for
independently-masked elements). If a per-word request comes up again,
the mask-jump problem described here is the specific technical reason
per-word reveals struggle to read as "fluid" with this --reveal
technique -- worth explaining rather than re-discovering by trial again.

**Immediate follow-up, same fix scope**: even the per-line sweep above
still read as having "hiccups between words" to the owner. Root cause
wasn't the delay/duration math (already continuous) -- it was that
`opacity` and `--reveal` shared ONE duration on an eased curve
(`cubic-bezier(.45,0,.2,1)`). That meant a character's overall BRIGHTNESS
was on its own independent ramp, competing with the mask EDGE POSITION
for attention, and the curve's non-constant rate of change read as a
stutter even though nothing was discontinuous timing-wise. Fix: split
them. `opacity` is now a fixed, near-instant `0.15s` (just avoids a hard
pop when a character first gets unmasked); `--reveal` runs the full
per-line duration on `linear` (constant speed, not eased) instead of the
old cubic-bezier. `main.js` now sets `transitionDuration` as a two-value
comma-separated string (`'0.15s, ' + duration + 's'`), matching the CSS
`transition` property's declared order (opacity first, `--reveal`
second) -- if that order ever changes in `style.css`, this line has to
change with it or the two values will apply to the wrong properties.
Practical effect: a character that's already behind the sweep edge is
essentially at full brightness immediately, so the only thing visibly
moving is the edge itself. Verified via `getComputedStyle(line).transition`
showing exactly `"opacity 0.15s ..., --reveal Xs linear ..."` per line,
and a screenshot confirming already-swept text is full-brightness white,
not still catching up.
If tuning again and "hiccup"/"stutter" complaints come back: check
`transition-timing-function` first, not just delay/duration -- an eased
curve on the sweep property is the specific thing that caused this.

**Same-day follow-up: hero markup edited directly by the owner (not this
agent), JS adapted to match.** `index.html`'s headline went from 3 lines
(1 for sentence 1, 2 for sentence 2) to 4 (2 lines each): "People don't
experience" / "your design." are now both `.l1`, alongside the existing
"They experience" / "your decisions." `.l3` pair. `playHeroReveal()` in
`main.js` used to hardcode the phrase boundary at line INDEX 1
(`if (i === 1) delay += PHRASE_PAUSE`) -- with a 2+2 structure that would
have inserted the pause in the wrong place (after line 1, i.e. mid-
sentence-1, instead of between the two phrases). Fixed by reading phrase
membership from each line's own class (`.l1` vs `.l3`) and inserting
`PHRASE_PAUSE` only where that class actually CHANGES between consecutive
lines, rather than a hardcoded index -- this now works regardless of how
many lines are in each phrase, so a future markup edit like this one
shouldn't need a JS change to match. (Reads the class via
`classList.contains('l3')`, not the raw `className` string, specifically
because `className` picks up `.placed` as lines are processed and would
make every already-processed line look "different" from a same-phrase
line that hasn't been processed yet.)
No CSS changes were needed -- `.l1`'s existing line-height already gives
reasonable spacing between the two `.l1` lines with no visible overlap
or awkward gap; verified via screenshot, not just assumed.
