# Hero section — complete build spec

Paste this whole document to Claude Code as one instruction. This reflects
the final, tested state after many rounds of refinement in a separate
conversation — build exactly this, don't reinterpret or "improve" any value
below without checking first.

## Reference file
The exact working code is at `reference/hero-pattern.html` in the repo (or
attached separately if that file is missing — see below). Match it exactly.

## Copy (locked)
- Ghost word: **OBSESSED**
- Eyebrow line: `// ux_consultant · product_design · web_experience` — the
  words "ux_consultant" render in the violet accent color, the rest in dim gray
- Headline, three lines:
  1. "Pattern reader."
  2. "Built together."
  3. "Business-obsessed." — ⚠️ ONE OPEN DECISION: this closing word is still
     being weighed between "Business-obsessed," "Human-obsessed," and
     "Choice-obsessed." Build with "Business-obsessed" for now since it's
     the most-tested option, but treat this single word as a variable, not
     fixed — expect it may change.
- Subhead: "I catch what's off before I can explain why. Then I bring you
  in to build the rest."

## Visual structure (locked)
- **Ghost word**: oversized outline text, bleeding off the left edge of the
  viewport. Space Grotesk 700, font-size 280px (desktop) / 110px (mobile
  breakpoint under 900px), `-webkit-text-stroke: 1px #a06bff` with no fill
  (transparent color), opacity 0.35, letter-spacing -0.02em, positioned
  absolute at top:20px, left:-30px.
- **Eyebrow line**: JetBrains Mono, 15px, dim gray (#a09c92) with the first
  phrase in violet (#a06bff, medium weight). Sits BELOW the ghost word with
  clear vertical separation, not overlapping it. padding-top: 260px desktop
  / 110px mobile, padding-left: 64px desktop / 24px mobile.
- **Headline**: Space Grotesk 700. Lines 1 and 2 are the SAME size (64px
  desktop / 30px mobile) and same off-white color (#e9e7df). Line 3 is
  LARGER (80px desktop / 38px mobile), violet (#a06bff), and indented
  further right (margin-left: 70px desktop / 0 on mobile). This size/color
  asymmetry on line 3 only is intentional — do not make all three lines
  match.
- **Subhead**: 17px, dim gray, left border rail in violet (2px solid),
  positioned with margin-left: 400px desktop / 24px mobile (offset further
  right than the headline, not aligned under it), margin-top: 60px.
- **No decorative connector/line between the ghost word and the eyebrow** —
  this was tried and explicitly rejected as "awkward" and "too literal."
  Just a clean gap, nothing bridging them.
- **No numbering, no visible grid overlay** in the final version (grid was
  a development aid, not part of the shipped design).

## Design principles that produced these numbers (for judgment calls later)
- Ghost word echoes the LAST/climax word of the headline (foreshadowing),
  not the first word — an earlier version echoed the first word and it was
  rejected as redundant ("shouting the word before you've even read it").
- Spacing follows a loose recursive rhythm: each gap is proportioned
  relative to the element before it, not arbitrary pixel guesses. Current
  values reflect roughly a 20% ratio after testing 40% and finding it too
  loose. If new spacing is needed later, reason from this ratio rather than
  guessing a fresh number.
- Only ONE line (the last) gets size/color emphasis. Earlier attempts with
  ascending size across all three lines, or heavy per-line staggering, were
  tested and rejected as either "too clunky" or fighting the punchy rhythm
  of the copy.
- All body copy across the site: no em dashes, no AI-sounding phrasing,
  short plain sentences.

## If reference/hero-pattern.html is missing from the repo
That means the file wasn't synced from the last chat session. Do not rebuild
this from a paraphrase or an old copy of the file — ask for the file to be
re-added before proceeding, since guessing at exact values here has caused
repeated rework in past sessions.
