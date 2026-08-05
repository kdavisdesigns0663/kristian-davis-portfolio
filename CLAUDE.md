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
js/case-study.js       dropdown behaviour only
link.html              mobile-only links screen reached by QR code, noindex
css/link.css, js/link.js
img/kristian-about-crop.jpg          desktop bio photo, 4:5
img/kristian-about-mobile-crop.jpg   mobile bio photo, tighter crop
```

## Things that are easy to get wrong here
- **Scroll snap is `proximity`, not `mandatory`.** Mandatory forced every section
  to fit exactly one viewport and was why the bio section had to be fought into
  submission. Also tested and confirmed broken a second time, independently: A/B'd
  identical wheel input against proximity and mandatory got permanently stuck at
  the first section boundary (0px of further scroll across 40+ events) while
  proximity scrolled the page freely every time. Don't reach for mandatory here.
  Programmatic jumps briefly set `scroll-snap-type:none` via `suspendSnap()`,
  because a snap point can otherwise drag a deep link to the wrong section
  mid-flight.
- **The actual "forced scroll to next section, lock it in" behavior is
  `initScrollLock()` in `main.js`, not CSS.** It intercepts wheel (desktop) and
  touch (mobile) directly: while there's room left to scroll WITHIN the current
  section it does nothing, but the moment input would carry you past a section's
  own edge, the native scroll is prevented and gated behind an accumulated-
  distance threshold, then committed with one `scrollIntoView`. This is what
  lets `#about` (no fixed height, ~1800px tall on a phone) scroll through freely
  while hero/work/contact each lock decisively. Mobile commits with
  `behavior:'instant'`, desktop with `'smooth'` — deliberately different, not a
  bug. If you touch this, keep the bounds check that skips interception past the
  first/last stop; without it, overshooting past Contact re-triggers
  `scrollIntoView` on itself and yanks the page back to Contact's own top instead
  of allowing normal end-of-page scroll.
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

## Pending cleanup (recommended, not done)
These are publicly reachable and indexable on the Pages deploy, and none are
linked from the site:

```
img-treatment-preview.html      dev mockup
reference/hero-pattern.html     dev mockup of a design that has since changed
reference/raindrop-v4.html      same
HERO-BUILD-SPEC.md              flagged stale at the top of its own file
```

Move them into a `docs/` folder excluded from the Pages build, or delete them.
`HANDOFF.md` is 1671 lines and several sections contradict the live code; cutting
it down to one current-state document plus an appendix of locked decisions would
remove a real liability. `link.html` is intentional — noindex, reached by QR code.
