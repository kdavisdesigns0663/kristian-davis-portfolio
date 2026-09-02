# Kristian Davis portfolio site

Static HTML/CSS/JS, no build tooling, no framework, no package.json. Deployed via
GitHub Pages at `https://kdavisdesigns0663.github.io/kristian-davis-portfolio/`.
Repo: `github.com/kdavisdesigns0663/kristian-davis-portfolio`.

The live files are the source of truth. `HANDOFF.md` is project history — rejected
directions, locked copy decisions, rationale — and is worth reading for *why*
things are the way they are, but its technical descriptions are stale and several
of them now actively contradict the code. Trust the files.

## Locked design system (won't change without the owner explicitly asking)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code/system accents)
- Palette: near-black background (`#050505`), off-white text, **one** violet accent
  (`--accent:#a06bff`) used sparingly — no gradients-as-decoration, no multi-color
  palette. Case study pages are the one exception: each carries a single per-project
  accent instead of the violet (nitefind `#b04ad6`, smiteforge `#e0b84a`, zentra
  `#4fbf82`, amun `#8f8f8f`), set in a small inline block in that page's head.
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
index.html            homepage: #hero, #work, #about, #contact. Nav lives inside
                       #hero, footer inside #contact.
css/style.css          homepage tokens, resets, keyframes, state rules
js/main.js             homepage logic in one `Portfolio` class: hero wipe, work
                       raindrop + ripple (desktop) / pill selector (mobile),
                       background bloom, contact pulse, nav dropdown, KD reset
case-studies/          nitefind, smiteforge, zentra, amun — all four from one
                       template, content past the header is still placeholder
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
_dev/                  design mockups and a stale spec. Underscore-prefixed, so
                       Jekyll keeps the directory out of the Pages build
_originals/            full-resolution masters the served sizes were cut from.
                       Same underscore, same reason: 13MB nothing links to
```

## Things that are easy to get wrong here
- **Scroll snap is `proximity`, not `mandatory`.** Mandatory forced every section
  to fit exactly one viewport and was why the bio section had to be fought into
  submission. Programmatic jumps briefly set `scroll-snap-type:none` via
  `suspendSnap()`, because a snap point can otherwise drag a deep link to the
  wrong section mid-flight.
- **The mobile and desktop work sections are switched in JS, not CSS.** A
  `display:none` stage still runs its timers, and the desktop sequence used to
  overwrite the mobile bloom's origin with a zeroed coordinate. `syncLayout()`
  owns that switch; keep it that way.
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
