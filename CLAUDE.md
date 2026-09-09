# Kristian Davis portfolio site

Static HTML/CSS/JS, no build tooling, no framework, no package.json. Deployed via
GitHub Pages at `https://kdavisdesigns0663.github.io/kristian-davis-portfolio/`.
Repo: `github.com/kdavisdesigns0663/kristian-davis-portfolio`.

The live files are the source of truth. `HANDOFF.md` carries the decisions and the
project notes — rejected directions, locked copy rules, where each project stands —
and is worth reading for *why* things are the way they are. It deliberately does not
describe the code, because the version that did drifted badly enough to cause real
rework. Anything about how something works belongs here or in the file itself.

## Locked design system (won't change without the owner explicitly asking)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code/system accents)
- Palette: soft-black background (`--bg:#09090B`), off-white text, **one** violet accent
  (`--accent:#a06bff`) used sparingly — no gradients-as-decoration, no multi-color
  palette. **`#a06bff` is the only purple on the site** — every size, text and decoration
  alike. Set by the owner on 2026-09-05, after two design passes running argued that two
  violets a shade apart read as a mistake rather than as a system. The lighter
  `--accent-text:#b48cff` is gone, and so is Nitefind's own violet. The contrast cost is
  real and accepted: 5.86:1 clears AA at any size and AAA at large, but is under the 7:1
  AAA bar for body text, and the hero sub copy is the one place that lands. Do not
  reintroduce a second violet to fix that; raise `#a06bff` itself. Two
  raised surfaces (`--bg-raise-1/2`) are for genuinely lifted panels, and `--hairline`
  replaced the old flat `#1c1c1a` dividers. Smiteforge and Zentra still carry a per-project
  accent on their case studies (`#e0b84a` gold, `#4fbf82` green) and Amun a grey
  (`#8f8f8f`), set in a small inline block in that page's head; none of them is a purple,
  which is why they were never in question. Each also appears twice in `index.html`, on
  that project's band edge and its flood gradient, plus once in `BANDS` in `js/main.js`.
  Change one, change all four.
- No em dashes, no AI-sounding phrasing, anywhere in body copy — a hard style rule
- Oversized-outline "ghost word" per section, bleeding off the left edge, as a
  wayfinding/rhythm device
- **Every animation solves a problem.** Hero reveals the text, the work raindrop
  causes the work to appear, contact highlights the CTA. The bio section has no
  entrance animation on purpose — the photograph carries it. Don't add motion that
  doesn't answer a question the visitor is already asking.

## Architecture
Layout and colour live as **inline styles on the elements themselves**. The
stylesheets hold only what an inline style cannot express: resets, custom
properties, keyframes, and the hover/focus/active states (generated as `.i*`,
`.c*`, `.l*` classes — one per element that needs a state).

```
index.html            homepage: #hero, #work, #about, #contact. The nav (#siteNav)
                       and the footer are now siblings of <main>, not nested inside
                       #hero and #contact. They were put inside those sections when
                       scroll snapping was on, because a top-level nav acted as its
                       own snap stop; with snapping gone that reason went with it.
                       #siteNav is fixed and fades in once the hero is scrolled past,
                       so the opening viewport is the headline and nothing else.
css/style.css          homepage tokens, resets, keyframes, state rules
js/main.js             homepage logic in one `Portfolio` class: hero wipe and
                       raindrop, the reflected light under the waterline (`poolBloom`)
                       and the handoff that moves the accent from the payoff word onto
                       the sub copy (`heroHandoff` / `rippleReveal`), work raindrop +
                       ripples + band reveal, the work wash, spine progress dot,
                       contact pulse, nav dropdown, the scroll-in nav reveal, mobile
                       nav, anchor/hash handling. `resetAll()` still exists and works,
                       but nothing reaches it: the KD-brand click that used to replay
                       the page was removed in the 2026-09-04 pass, and `js/tweaks.js`
                       reads `window.portfolio`, which main.js has never assigned
case-studies/          nitefind, zentra and smiteforge are built. amun is an empty
                       noindex shell — its page, and the entries pointing at it,
                       are the only placeholders left
css/case-study.css     shared by all four
js/case-study.js       nav dropdown, and the viewport-driven playback for the
                       Zentra loop video
js/tweaks.js           design panel: accents, ghost word, animation timings.
                       Loaded only on `?tweaks=1`, so a normal visit ships none
                       of it. Values are session-only by design
link.html              mobile-only links screen reached by QR code, noindex
css/link.css, js/link.js
img/kristian-about-crop-800.jpg        desktop bio photo, 4:5
img/kristian-about-mobile-crop-900.jpg mobile bio photo, tighter crop
_originals/            full-resolution masters the served sizes were cut from.
                       Underscore-prefixed, so Jekyll keeps the directory out of
                       the Pages build: 13MB nothing links to
```

## Things that are easy to get wrong here
- **There is no scroll snapping any more.** It went through mandatory, then
  proximity, then out. Even proximity pulled a swipe back to a section edge instead
  of letting it carry, which is what read as the page taking the scroll away from
  you. `suspendSnap()` is kept as an empty stub so the call sites do not all need
  editing; do not reintroduce snapping without re-testing a real phone swipe.
- **The work section is one set of bands at every width, reshaped in CSS.** There
  is no second mobile stage and no JS layout switch — earlier versions had both,
  and a `display:none` stage that still ran its timers was the reason. The band is a
  row on desktop and becomes a bordered card below 900px, all in `css/style.css`.
- **The page accelerates as you go down it, and matching one speed across it does not
  work.** The hero is the slowest thing on the site on purpose: it is the introduction and
  it has the visitor's whole attention. The work drop enters faster and gains on every
  band (`ENTRY`/`GAIN` in `initDrop()`), so the first project lands deliberately at ~1.15s
  and the last snaps in at ~3.9s; the beat between hits, the ring set and the band settle
  all ride the same `GAIN` curve, or the drop accelerates away and leaves a slow settle
  behind it. Running the work drop at the hero's exact fall speed was tried on 2026-09-05
  and reverted the same day — it was consistent and it was wrong, taking 11.5s with the
  last band at 11.2s, and the section sat empty long enough to read as broken rather than
  as slow. What carries across the page is the impact, the easing and the ring set, and
  those do match the hero exactly; only the clock is different. Two things not to undo:
  the entrance cannot simply start 0.6vh above the first band, because the section is only
  part-scrolled when the sequence fires, so that point is usually still on screen and the
  drop appears out of nothing in mid-air (it starts at whichever is higher, that or just
  above the viewport's edge); and the scroll handler reveals any band already scrolled
  past, with `revealBand()` guarded by `data-landed` so a later arrival does not replay the
  settle. Clear that marker anywhere bands are reset — `initBands()` and `resetAll()` do.
- **The hero headline's size is set by the first phrase, not by taste.** "People don't
  experience your design." measures 16.96em in Space Grotesk 700 at the tracking used
  here, and it has to hold one line. The column the hero leaves it is the viewport less
  the asymmetric indent and the right padding, and that column stops growing at 1104px,
  so `--hero-fs` is capped at `min(clamp(34px,4.2vw,64px), 11.4vh)`. Raising either
  number re-breaks the phrase. Below 900px one line would mean a 19px headline, so the
  `<br data-mob>` is switched on instead and the phrase takes two lines there.
- **The hero timeline is driven by `lines.length`, and the sentence pause by markup.** It
  used to be a hardcoded run of four `wipe()` calls; merging two lines left the last cue
  pointing past the end of the list and the drop scheduled against a cue that no longer
  existed. The 420ms hold at the sentence boundary was likewise keyed to `i === 1`; it now
  reads `[data-sentence-end]`, which sits on `a2`. Re-break the headline freely, the
  sequence follows.
- **The first sentence is two segments, `a1` and `a2`, not one block with a `<br>`.** The
  reveal is a 90deg gradient mask, so one horizontal front crosses whatever element it is
  on. As a single block containing `<br data-mob>` the two mobile rows uncovered at the
  same time and the sentence arrived in one gesture; desktop never showed it, being one
  row. As two `inline-block` siblings they share a line box above 900px and split below it.
- **The sweep is driven by rows, not by elements — `sameRowAsPrev()` measures which.** Two
  segments on the same visual line have to be one front, and the rules written for moving
  to a *new* row actively break that. The 90ms `OVERLAP` starts the next segment early,
  which on a shared row puts a second front on a line that already has one: "your design."
  lit up while "People don't experience" was still being written, with a dark gap between
  them. On a shared row the cue is `durOf` (when the front leaves the element), never
  `litAt` (when its last glyph lit), with no overlap and no sentence pause — verified at
  0ms gap and 0 px/s speed delta across the join at every width from 901 up. The other half
  is `preLight()`: a mask cannot spill past its own element, so over the last 1.6em of a
  segment the feather is clipped and the edge hardens, and the next segment at `--reveal:0%`
  is not blank — its mask is opaque at x=0 and fades out over 1.6em, which *is* the leading
  edge. It is faded up across exactly the window the previous segment spends losing its
  feather, so the soft edge is handed over instead of snapping from near-hard to a full
  1.6em in one frame. None of this runs when the segments are on separate rows.
- **What sits under the waterline is light, not a mirrored word.** It was a ten-slice
  reflection of "decisions." until 2026-09-04; it is now `#heroPool`, absolutely
  positioned inside `#surface` — overlapping shallow ellipses anchored to the impact
  point. Being out of flow is load-bearing: as a flow element the reflection pushed the
  sub copy down and the mobile hero stopped fitting one screen. Its mask is two layers
  intersected, vertical and horizontal; the horizontal one is not decoration. The two
  widest pools are centred at 74% and 93% with radii reaching past 100%, so without it
  the box clips them at full alpha and draws a straight violet edge down the hero.
- **WebKit does not resolve an SVG mask reference on an HTML element at all.** Not a
  prefix problem — `setMask()` writes `mask`, `-webkit-mask` and `-webkit-mask-image`, and
  it made no difference, because Safari and every browser on iOS parse `url(#rippleWord)`
  and then ignore it. `CSS.supports()` returns true for the value, so there is nothing to
  feature-detect; `this.noSvgMask` sniffs `navigator.vendor` for Apple, which is the only
  honest test available. On that path `rippleRevealGradient()` runs the same front off a
  radial-gradient mask instead, and `[data-cascade-edge]` is dropped, since it exists only
  to soften a turbulent boundary that is not there. Both `decisions.` overlays start at
  `opacity:0` and are lit as their front starts — without that, WebKit painted the white
  overlay over the purple word from first paint, with the ignored mask hiding nothing.
  Every reveal also schedules a timer that drops the mask outright: the animation is
  `requestAnimationFrame`-driven, and nothing may leave content depending on a frame loop
  having run.
- **The ripple is described in ems, and its noise field is held.** Three separate things
  made it read as rough rather than fluid, all fixed on 2026-09-05. The front used a cubic
  ease-out, which left at 2.94x its average speed and then spent 37% of its frames
  essentially stationary — a lurch, then a stall; it is quadratic now (`rippleEase`), 2.03x
  and 21%. The feather, the displacement and the filter's `stdDeviation` were fixed pixel
  values, so at 29px type on a phone a 38px feather was wider than the line while at 64px
  it was half of one — they are all multiples of the element's own font size now
  (`rippleFront`). And `feTurbulence` regenerates its entire noise field on every integer
  `seed`, so stepping the seed ~120 times across the run replaced the distortion every
  couple of frames, which is static rather than water: the seed is held and the field
  drifts through `baseFrequency` instead, cached in `data-bf0` so replays do not compound.
  Durations are the ripple's own (`WORD_MS`/`SUB_MS`), deliberately slower than the wipe —
  `EM_PER_SEC` governs the wipe and is a separate decision.
- **`prefers-reduced-motion` is not only Reduce Motion.** iOS reports it under Low Power
  Mode too, with no way to tell the two apart, so a phone on a low battery takes that
  branch. The hero used to snap to its finished state there, which read as a broken
  intro rather than an honoured preference — the same failure the email glow had. It now
  runs the sequence in opacity alone. Two constraints if you touch it: the global rule in
  `style.css` collapses every `transition-duration` to `.01ms`, so the fades have to be
  Web Animations rather than transitions, and nothing in that branch may travel — no
  drop, no ripple, no pool bloom, no cascade.
- **The raindrop falls on `transform`, not `top`.** A `top` transition between a
  viewport unit and a percentage is not interpolable and silently teleports.
- Rings need an explicit `0` size plus a forced reflow between setting the
  transition and the target size, or they don't animate at all.
- `scrollTo({behavior:'auto'})` inherits the CSS `scroll-behavior:smooth`. Use
  `'instant'` when you mean instant.
- The `.ghost` words are `aria-hidden`; keep them that way or screen readers
  announce "KRISTIAN WORK BIO CONTACT" as page content.
- **Every `:hover` rule lives inside `@media (hover:hover)`, and only ever on
  something that goes somewhere.** A touchscreen has no hover to leave, so a bare
  `:hover` latches on tap and the element stays lit until the next tap lands
  elsewhere. Focus rules stay outside the query — keyboard focus has to answer on
  every device. The same rule governs JS: `initBands()` attaches `mouseenter` only
  when `(hover:hover)` matches, and attaches nothing at all to a band with no
  `href`. Use `a[href]:hover`, never `a:hover`: the "soon" entries are anchors
  without an href and a bare `a:hover` lit them up as though they were links.
- **Autoplaying video is driven from the viewport, not from load.** Mobile Safari
  will not start a video that is thousands of pixels off screen, and a swallowed
  `play()` rejection is indistinguishable from a poster that just sits there. It
  can also refuse outright — Low Power Mode blocks autoplay for every video, muted
  and inline included, and no media query reports that — so a refusal arms the
  next tap to start it. `initMotion()` in `js/case-study.js` owns all of this.

## Workflow notes for this repo specifically
- No build step. Edit the files directly; there's nothing to compile.
- When testing in a browser tool: **serve over a real local HTTP server, not
  `file://`.** A `file://` tab has been observed serving stale cached CSS/JS
  across reloads in this environment with no visible indication — cost real
  time chasing a "fix" that had already worked. `python3 -m http.server` from the
  repo root, then hard-reload if edits don't seem to be taking effect before
  assuming the code is wrong.
- Commit messages in this repo's history are written with real technical context
  (root causes, not just "fixed bug") — `git log -p <file>` is genuinely useful.
- This project has a documented history of docs drifting out of sync with the live
  site and causing real rework. When a doc and the live file disagree, the live
  file wins — and update the doc.

## Images
Every JPEG is progressive and sized to about 2x the width it is actually laid out
at, measured in a browser rather than guessed. Before adding a new one, check what
the page gives it: a 636px slot does not want an 1800px file, and the homepage
project cards render at 154px however large the source is.

The recompressor lives in this repo's history, not in the tree — there is no build
step and nothing to run on deploy. It encodes at descending quality, decodes the
result, and compares it to the source across all three channels, keeping the
smallest file whose error stays under a threshold. Two things it taught, worth not
rediscovering: measure RGB, not luma, or chroma damage is invisible to the guard;
and judge each quality against the error floor of re-encoding at q95, because
re-encoding a 4:2:0 source at 4:2:0 costs a fixed amount before quantization is
involved at all, which a flat threshold reads as failure on every file.

**Replacing an existing image in place (same filename, new bytes) needs a cache-busting
query string on every `<img src>`/`og:image` that points at it, or visitors keep the old
file until they hard-refresh** — this has bitten the work-section preview thumbnails
more than once. `img/previews/nitefind-preview.jpg?v=2` is enough; bump the number on
each subsequent replacement of that same file. No versioning needed for a genuinely new
filename.

## Pending cleanup (recommended, not done)
`HANDOFF.md` is 1670 lines and several sections contradict the live code; cutting
it down to one current-state document plus an appendix of locked decisions would
remove a real liability.

`case-studies/amun.html` still carries the original nav — it never got the
`.navlist` / `.mnav` pair the other three use, so on a phone it shows the full
desktop list rather than collapsing to the menu. It is noindex and nothing links
to it, so this is not live, but it needs doing when Amun ships. Shipping it also
means flipping the nine `aria-disabled` markers that point at it from the other
four pages: two on `index.html` (the dropdown entry and the work band), two each
on nitefind and zentra (desktop nav and `.mnav`), and three on smiteforge (both
navs and the next-project card).

`link.html` is intentional — noindex, reached by QR code.
