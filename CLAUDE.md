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
  palette. `--accent-text:#b48cff` is the same accent lightened to clear 7:1, and is for
  accent on small body text only; `--accent` stays on decoration and large text. Two
  raised surfaces (`--bg-raise-1/2`) are for genuinely lifted panels, and `--hairline`
  replaced the old flat `#1c1c1a` dividers. Case study pages are the one exception: each carries a single per-project
  accent instead of the violet (nitefind `#a259ff`, smiteforge `#e0b84a`, zentra
  `#4fbf82`, amun `#8f8f8f`), set in a small inline block in that page's head.
  Each one also appears twice in `index.html`, on that project's band edge and its
  flood gradient. Change one, change all three.
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
                       raindrop, the sliced hero reflection and its impact ripple,
                       work raindrop + ripples + band reveal, the work wash, spine
                       progress dot, contact pulse, nav dropdown, the scroll-in nav
                       reveal, mobile nav, anchor/hash handling, KD reset
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
- **The hero headline's size is set by the first phrase, not by taste.** "People don't
  experience your design." measures 16.96em in Space Grotesk 700 at the tracking used
  here, and it has to hold one line. The column the hero leaves it is the viewport less
  the asymmetric indent and the right padding, and that column stops growing at 1104px,
  so `--hero-fs` is capped at `min(clamp(34px,4.2vw,64px), 11.4vh)`. Raising either
  number re-breaks the phrase. Below 900px one line would mean a 19px headline, so the
  `<br data-mob>` is switched on instead and the phrase takes two lines there.
- **The hero timeline is driven by `lines.length`.** It used to be a hardcoded run of
  four `wipe()` calls; merging two lines left the last cue pointing past the end of the
  list and the drop scheduled against a cue that no longer existed. Re-break the headline
  freely, the sequence follows.
- **The hero reflection has to sit directly under `#surface`.** It mirrors the
  headline across the waterline, so anything between the two breaks it. It arrived
  once placed after `#heroSub` and rendered as a detached blurred smear below the
  body copy, which on a phone read as a stray artefact rather than a reflection.
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
