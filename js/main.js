// --- Hero: headline lines fade in, one at a time, in reading order. ---
// Deliberately the simplest version of this effect after several rounds of increasingly fiddly
// variants (per-word staggering, a mask-sweep wipe, different speeds for different sentences,
// different pauses between different lines) that kept drifting and reading as inconsistent.
// ONE rule now, no exceptions: every line uses the exact same opacity transition (see
// style.css), and line N's delay is simply N * LINE_DURATION -- each line fades fully in before
// the next one starts, slow and fluid, same pace throughout. If this needs to change again,
// change LINE_DURATION (or add a separate GAP if lines should pause between each other instead
// of one continuous cadence) -- don't reintroduce per-line/per-sentence special cases without a
// specific reason; that's exactly what made this hard to reason about before.
// Fires once via IntersectionObserver (hero is the first section, so this effectively means "on
// load") and never resets — this is not a scroll-repeat effect like the work-section ripple.
const heroSection = document.getElementById('hero');
if (heroSection) {
  const heroLines = heroSection.querySelectorAll('.headline > div');
  const LINE_DURATION = 2; // slow, fluid fade -- identical for every line

  let heroPlayed = false;
  function playHeroReveal() {
    if (heroPlayed) return;
    heroPlayed = true;
    heroLines.forEach((line, i) => {
      line.style.transitionDelay = (i * LINE_DURATION) + 's';
      line.classList.add('placed');
    });
    heroSection.classList.add('revealed');
  }
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) playHeroReveal(); });
  }, { threshold: 0.5 });
  heroObserver.observe(heroSection);
}

// --- Work section: raindrop fall + ripple reveal, scroll-triggered, center-anchored hover preview ---
// 4 projects currently, arranged in an X (angles 45deg apart from cardinal).
// To add another, just add one object here — position/animation are computed from this list.
// radiusX/radiusY (not a single shared radius) since the stage is now a wide/short landscape
// panel rather than a square -- an even circular spread would either overflow the card's short
// height or leave the wide axis under-used. Tuned so the widest hook label still clears the
// card edge with padding to spare down to the smallest desktop width the stage's own min()
// sizing allows.
const projects = [
  { key:'nitefind', name:'Nitefind', hook:'too many options, not enough certainty', href:'case-studies/nitefind.html', angle:-45, radiusX:440, radiusY:240, img:'img/previews/nitefind-preview.jpg' },
  { key:'smiteforge', name:'SmiteForge', hook:'one brand, two very different platforms', href:'case-studies/smiteforge.html', angle:45, radiusX:440, radiusY:240, img:'img/previews/smiteforge-preview.jpg' },
  { key:'zentra', name:'Zentra', hook:'saving money without losing motivation', href:'case-studies/zentra.html', angle:135, radiusX:440, radiusY:240, img:'img/previews/zentra-preview.jpg' },
  { key:'amun', name:'Amun', hook:'still being built', href:'case-studies/amun.html', angle:225, radiusX:440, radiusY:240, img:'img/previews/amun-preview.jpg', isPlaceholder:true },
];

// Shared drop-fall + ripple mechanic, used by both the desktop stage and the
// mobile entrance (just at different scale/timing). `container` must have a
// .drop-wrap > .drop-shape, an .impact-flash, and is where .ring elements get
// inserted. Correctness notes carried over from getting this working:
// - falling must be REMOVED before impact is added — leaving both classes on
//   at once means two same-specificity rules fight over `transition`/`opacity`,
//   which is what silently broke the drop on desktop.
// - rings must start at explicit width/height:0 (in CSS) and get a forced
//   reflow (ring.offsetHeight) between setting the transition and setting the
//   target size, or the browser won't animate the change at all.
function playRaindrop(opts) {
  const { container, holdBeforeImpact, ringCount, ringStagger, ringDuration, ringMaxSize, glowDuration, glowMaxSize, glowFadeDelay, onImpact, registerTimer } = opts;
  const reg = registerTimer || function(id){ return id; };

  const dropWrap = container.querySelector('.drop-wrap');
  const flash = container.querySelector('.impact-flash');
  const glow = container.querySelector('.impact-glow');
  container.querySelectorAll('.ring').forEach(r => r.remove());
  dropWrap.classList.remove('impact', 'falling');
  // Clear any inline opacity left over from a previous run rather than setting
  // one — an inline value has higher specificity than .falling's CSS opacity:1
  // and would silently block it from ever becoming visible.
  dropWrap.style.opacity = '';
  dropWrap.offsetHeight;
  dropWrap.classList.add('falling');

  reg(setTimeout(() => {
    dropWrap.classList.remove('falling');
    dropWrap.classList.add('impact');
    flash.classList.add('flash');

    // Soft diffuse splash right at the landing point, distinct from the crisp
    // rings tracing outward — reads as the "liquid" reacting to the drop.
    if (glow) {
      const fadeDelay = glowFadeDelay || 0;
      glow.style.transition = 'none';
      glow.style.width = glow.style.height = '0px';
      glow.style.opacity = '0';
      glow.offsetHeight;
      // Width/height start expanding immediately (no delay) so the glow visibly swells right
      // away, but opacity's fade is held at its peak (0.4) for glowFadeDelay before it starts
      // dropping toward 0 -- tuned per call site so that hold roughly spans how long the drop
      // itself takes to fully fade after impact (see .drop-wrap.impact in style.css), so the
      // glow is still near-peak-bright at the moment the drop disappears rather than already
      // most of the way faded. That's what's supposed to sell "something absorbed it" instead
      // of the drop just vanishing on its own.
      glow.style.transition = `width ${glowDuration}s cubic-bezier(.16,1,.3,1), height ${glowDuration}s cubic-bezier(.16,1,.3,1), opacity ${glowDuration}s ease-out ${fadeDelay}s`;
      glow.style.opacity = '0.4';
      glow.offsetHeight;
      glow.style.width = glow.style.height = glowMaxSize + 'px';
      glow.style.opacity = '0';
    }

    let delay = 0;
    for (let i = 0; i < ringCount; i++) {
      const ring = document.createElement('div');
      ring.className = 'ring';
      const jitter = () => 48 + Math.random() * 6;
      ring.style.borderRadius = `${jitter()}% ${jitter()}% ${jitter()}% ${jitter()}%`;
      container.insertBefore(ring, container.firstChild);
      reg(setTimeout(() => {
        // cubic-bezier(.16,1,.3,1) -- a slow, decelerating "expo out" curve reused from the
        // hero/header-text liquid-reveal transitions elsewhere in this file -- reads as the
        // ring dissipating into the surface rather than mechanically shrinking to nothing,
        // which plain ease-out did.
        ring.style.transition = `width ${ringDuration}s cubic-bezier(.16,1,.3,1), height ${ringDuration}s cubic-bezier(.16,1,.3,1), opacity ${ringDuration}s ease-out, filter ${ringDuration}s ease-out, border-width ${ringDuration}s ease-out`;
        ring.style.opacity = '0.55';
        ring.offsetHeight;
        const size = ringMaxSize + Math.random() * ringMaxSize * 0.15;
        ring.style.width = ring.style.height = size + 'px';
        ring.style.opacity = '0';
        ring.style.filter = 'blur(5px)';
        ring.style.borderWidth = '0.5px';
      }, delay));
      reg(setTimeout(() => ring.remove(), delay + ringDuration * 1000 + 100));
      delay += ringStagger;
    }

    reg(setTimeout(() => { flash.classList.remove('flash'); }, 400));
    if (onImpact) onImpact();
  }, holdBeforeImpact));
}

// --- Section background bloom: shared by the work section (desktop + mobile) and Contact ---
// A black-to-violet wash that expands (clip-path circle, see .section-bloom in style.css) from
// the exact point that triggered it -- the raindrop's impact for Work, the listening-pulse's
// position for Contact -- so the section's own background reads as caused by whatever's already
// animating there, not a separate effect layered on top. sectionEl gets --bloom-x/--bloom-y
// custom properties (inherited down to bloomEl) computed from originEl's real on-screen
// position, so this works whether the origin sits dead-center (the work-section raindrop) or
// off to one side (Contact's pulse, which sits left of the CTA button).
function triggerSectionBloom(sectionEl, bloomEl, originEl) {
  if (!sectionEl || !bloomEl || !originEl) return;
  const secRect = sectionEl.getBoundingClientRect();
  const oRect = originEl.getBoundingClientRect();
  const xPct = ((oRect.left + oRect.width / 2 - secRect.left) / secRect.width) * 100;
  const yPct = ((oRect.top + oRect.height / 2 - secRect.top) / secRect.height) * 100;
  sectionEl.style.setProperty('--bloom-x', xPct + '%');
  sectionEl.style.setProperty('--bloom-y', yPct + '%');
  bloomEl.classList.add('bloomed');
}
function resetSectionBloom(bloomEl) {
  if (bloomEl) bloomEl.classList.remove('bloomed');
}

const stage = document.getElementById('rippleStage');

if (stage) {
  projects.forEach(p => {
    const el = document.createElement('a');
    el.className = 'node';
    el.href = p.href;
    el.tabIndex = 0;
    el.innerHTML = `<span class="node-inner"><div>${p.name}</div><div class="hook">${p.hook}</div></span>`;
    stage.appendChild(el);
    p.el = el;

    // .preview-wrap carries position/size/the active toggle; .preview inside it is just the
    // clipped image box. Split this way so the ring + corner brackets (siblings of .preview,
    // not children) can extend past the image's own rounded corners instead of being clipped
    // by the overflow:hidden that the image itself needs. See style.css for the visual detail.
    const previewWrap = document.createElement('div');
    previewWrap.className = 'preview-wrap ' + p.key + (p.isPlaceholder ? ' is-placeholder' : '');
    previewWrap.innerHTML = `
      <div class="preview-ring"></div>
      <span class="preview-corner tl"></span>
      <span class="preview-corner tr"></span>
      <span class="preview-corner bl"></span>
      <span class="preview-corner br"></span>
      <div class="preview">
        <img src="${p.img}" alt="${p.isPlaceholder ? '' : p.name + ' preview'}" loading="lazy">
        <span class="preview-shimmer"></span>
        <span class="preview-tag">${p.name}</span>
      </div>
    `;
    stage.appendChild(previewWrap);
    p.preview = previewWrap;

    const on = () => { stage.classList.add('hovering'); previewWrap.classList.add('active'); };
    const off = () => { stage.classList.remove('hovering'); previewWrap.classList.remove('active'); };
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    el.addEventListener('focus', on);
    el.addEventListener('blur', off);
  });

  function targetTransform(angle, radiusX, radiusY) {
    const rad = angle * Math.PI / 180;
    const x = radiusX * Math.cos(rad);
    const y = radiusY * Math.sin(rad);
    return `translate(${x}px, ${y}px)`;
  }

  let played = false;
  let timers = [];
  function clearTimers() { timers.forEach(t => clearTimeout(t)); timers = []; }

  function resetSequence() {
    played = false;
    clearTimers();
    const dropWrap = stage.querySelector('.drop-wrap');
    const flash = stage.querySelector('.impact-flash');
    const card = stage.querySelector('.stage-card');
    dropWrap.classList.remove('falling', 'impact');
    dropWrap.style.opacity = '0';
    flash.classList.remove('flash');
    if (card) card.classList.remove('active');
    stage.querySelectorAll('.ring').forEach(r => r.remove());
    projects.forEach(p => {
      p.el.classList.remove('placed');
      p.el.style.transform = 'translate(-50%,-50%) scale(0.3)';
    });
    resetSectionBloom(workBloomEl);
  }

  function playSequence() {
    if (played) return;
    played = true;
    // holdBeforeImpact matches the .falling transition duration in CSS (3.2s) -- slowed from an
    // earlier 2.2s/2.3s/580ms/1s (fall/ring/stagger/glow) across the board for a more fluid,
    // liquid feel; the fix for "nothing happens" was starting the sequence earlier (see the
    // observer's rootMargin below), not making the fall itself faster, so that stays untouched.
    playRaindrop({
      container: stage,
      holdBeforeImpact: 3200,
      ringCount: 4,
      ringStagger: 720,
      ringDuration: 3.4,
      ringMaxSize: 420,
      glowDuration: 1.6,
      glowMaxSize: 260,
      // Matches roughly how long .drop-wrap.impact takes to fully fade (0.22s delay + 0.5s
      // fade = 0.72s) -- see the glowFadeDelay comment in playRaindrop() above.
      glowFadeDelay: 0.3,
      registerTimer: (id) => timers.push(id),
      onImpact: () => {
        triggerSectionBloom(workSection, workBloomEl, stage);
        const card = stage.querySelector('.stage-card');
        if (card) card.classList.add('active');
        projects.forEach((p, i) => {
          timers.push(setTimeout(() => {
            p.el.style.transform = `translate(-50%,-50%) ${targetTransform(p.angle, p.radiusX, p.radiusY)} scale(1)`;
            p.el.classList.add('placed');
          }, i * 130));
        });
      },
    });
  }

  // Watch the SECTION (guaranteed full-viewport via scroll-snap) so the trigger
  // is reliable, and reset on exit so scrolling back replays the sequence. Threshold
  // dropped from 0.9 (had to nearly finish the scroll into the section before anything
  // happened, reading as "blank") to 0.15 -- low enough that the fall starts within the
  // first ~80px of scrolling away from the hero, so the scroll itself reads as what
  // triggers the drop, but still above the section's small natural peek at rest (hero is
  // a hair shorter than the viewport) so it doesn't fire before any scrolling happens.
  const workSection = document.getElementById('work');
  const workBloomEl = document.getElementById('workBloom');
  const rippleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) playSequence();
      else resetSequence();
    });
  }, { threshold: 0.15 });
  if (workSection) rippleObserver.observe(workSection);
}

// --- Work section: mobile pill selector (below ~700px, see style.css) ---
// Same `projects` array as the desktop raindrop layout, rendered as a row of pills next to one
// fixed preview container (#mobilePreviewWrap). Tapping a pill just swaps that container's
// image/label/color/href -- the container itself never moves or resizes. An earlier version used
// a tap-to-expand accordion with its own per-tap scroll-recentering logic; that logic is gone
// entirely here, not just disabled, because pills never change any element's height or the
// page's scroll position, so there's nothing left needing recentering.
const pillsWrap = document.getElementById('workPillsWrap');
const pillsContainer = document.getElementById('workPills');
const previewLink = document.getElementById('workPreviewLink');
const mobileStage = document.getElementById('workMobileStage');
if (pillsWrap && pillsContainer) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Single shared preview -- setMobilePreview() just updates this one element's content and
  // toggles .active, never its position (see the CSS comment above .mobile-preview-wrap).
  const mobilePreviewWrap = document.getElementById('mobilePreviewWrap');
  const mobilePreviewImg = document.getElementById('mobilePreviewImg');
  const mobilePreviewTag = document.getElementById('mobilePreviewTag');
  // Description block sits below the preview (see .mobile-preview-copy in style.css), toggled
  // and cross-faded in lockstep with the image/tag above rather than as a separate update --
  // same isFreshOpen/swap-timer logic, just one more piece of content. Reuses each project's
  // existing `hook` copy (already short, already project-specific, not shown anywhere else on
  // mobile) as a placeholder description -- swap in dedicated copy per project once it's
  // written, this just needs `desc` (or however it ends up named) added to the `projects` array.
  const mobilePreviewCopy = document.getElementById('mobilePreviewCopy');
  const mobilePreviewDesc = document.getElementById('mobilePreviewDesc');
  let mobilePreviewSwapTimer = null;
  let activePill = null;

  function setMobilePreview(p, isFreshOpen) {
    clearTimeout(mobilePreviewSwapTimer);
    const applyContent = () => {
      mobilePreviewImg.src = p.img;
      mobilePreviewImg.alt = p.isPlaceholder ? '' : p.name + ' preview';
      mobilePreviewTag.textContent = p.name;
      mobilePreviewWrap.className = 'mobile-preview-wrap active ' + p.key + (p.isPlaceholder ? ' is-placeholder' : '');
      if (mobilePreviewDesc) mobilePreviewDesc.textContent = p.desc || p.hook;
      if (mobilePreviewCopy) mobilePreviewCopy.classList.add('active');
    };
    if (isFreshOpen) {
      // Nothing was showing -- play the full bloom-in from scratch.
      applyContent();
    } else {
      // Already open, switching directly to a different project. Replaying the whole
      // retract-then-rebloom clip-path cycle here would either swap the image while still
      // partially visible (looks broken) or force an ~1.1s wait before anything happens
      // (feels sluggish) -- instead, cross-fade just the image/label/description in place while
      // the bloom shape/card/ring stay fully expanded throughout.
      mobilePreviewImg.style.transition = 'opacity .18s ease';
      mobilePreviewImg.style.opacity = '0';
      if (mobilePreviewDesc) mobilePreviewDesc.style.opacity = '0';
      mobilePreviewSwapTimer = setTimeout(() => {
        applyContent();
        mobilePreviewImg.style.opacity = '1';
        if (mobilePreviewDesc) mobilePreviewDesc.style.opacity = '1';
      }, 180);
    }
  }

  function selectProject(p, pillEl, isFreshOpen) {
    if (activePill === pillEl) return;
    if (activePill) {
      activePill.classList.remove('active');
      activePill.setAttribute('aria-pressed', 'false');
    }
    pillEl.classList.add('active');
    pillEl.setAttribute('aria-pressed', 'true');
    activePill = pillEl;
    if (previewLink) previewLink.href = p.href;
    setMobilePreview(p, isFreshOpen);
  }

  projects.forEach(p => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'work-pill ' + p.key;
    pill.textContent = p.name;
    pill.setAttribute('aria-pressed', 'false');
    pill.addEventListener('click', () => {
      selectProject(p, pill, !mobilePreviewWrap.classList.contains('active'));
    });
    pillsContainer.appendChild(pill);
    p.pillEl = pill;
  });

  let mobileEntrancePlayed = false;
  function playMobileEntrance() {
    if (mobileEntrancePlayed) return;
    mobileEntrancePlayed = true;

    const revealPills = () => {
      pillsWrap.classList.add('revealed');
      // Ripples through the pills one at a time rather than all appearing together the
      // instant the wrap's own clip-path finishes expanding.
      projects.forEach((p, i) => {
        setTimeout(() => p.pillEl.classList.add('placed'), 160 + i * 120);
      });
      // First project previews automatically -- with no hover on touch, an empty fixed preview
      // box would just look broken until the first tap. Delay matches the last pill's own
      // stagger so this reads as the sequence settling into a default, not racing it.
      setTimeout(() => {
        selectProject(projects[0], projects[0].pillEl, true);
      }, 160 + projects.length * 120 + 250);
    };

    if (prefersReducedMotion || !mobileStage) {
      revealPills();
      return;
    }

    // holdBeforeImpact must match the .falling transition duration in CSS (2.2s) so
    // impact/ripple/reveal all trigger the instant the drop lands -- slowed from an earlier
    // 1.6s/0.95s/380ms/0.85s (fall/ring/stagger/glow) alongside the desktop stage, for the same
    // more fluid, liquid feel.
    playRaindrop({
      container: mobileStage,
      holdBeforeImpact: 2200,
      ringCount: 2,
      ringStagger: 480,
      ringDuration: 1.5,
      ringMaxSize: 300,
      glowDuration: 1.3,
      glowMaxSize: 230,
      // Matches roughly how long .drop-wrap.impact takes to fully fade (0.2s delay + 0.55s
      // fade = 0.75s) -- see the glowFadeDelay comment in playRaindrop() above.
      glowFadeDelay: 0.3,
      onImpact: () => {
        triggerSectionBloom(document.getElementById('work'), document.getElementById('workBloom'), mobileStage);
        revealPills();
      },
    });
  }

  // Watching #work (not the pills wrap itself) means this observer still fires on desktop,
  // where the pills wrap is display:none — the visibility check below is what actually gates
  // the entrance to mobile. threshold 0.5 plus the one-shot `mobileEntrancePlayed` flag (never
  // reset) is what keeps small scroll jitters near the section boundary from re-triggering it,
  // unlike desktop's ripple which deliberately resets on scroll-out.
  const workSectionEl = document.getElementById('work');
  if (workSectionEl) {
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && getComputedStyle(pillsWrap).display !== 'none') {
          playMobileEntrance();
        }
      });
    }, { threshold: 0.5 });
    entranceObserver.observe(workSectionEl);

    // #mobilePreviewWrap and #mobilePreviewCopy are both position:fixed (see style.css)
    // specifically so they stay put on screen regardless of what the pills around them are
    // doing -- but "stays put on screen" also means they don't automatically leave with the
    // rest of the section once you scroll past it, unlike everything else in #work. This hides
    // both the moment #work leaves the viewport and reshows them once you're back, without
    // replaying the one-shot entrance or re-picking a project -- setMobilePreview() already left
    // the right image/label/description in place, this just toggles the same .active classes
    // that reveal them.
    // rootMargin:-2px (not the default 0) -- with scroll-snap landing sections exactly
    // edge-to-edge, #work's bottom can end up sitting at EXACTLY 0px from the viewport top with
    // zero true overlap, which is an ambiguous boundary case for threshold:0 (observed reporting
    // isIntersecting:true with zero visible pixels). Shrinking the effective root by 2px removes
    // that ambiguity -- an exact touch no longer counts as an intersection.
    const previewVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          mobilePreviewWrap.classList.remove('active');
          if (mobilePreviewCopy) mobilePreviewCopy.classList.remove('active');
        } else if (activePill) {
          mobilePreviewWrap.classList.add('active');
          if (mobilePreviewCopy) mobilePreviewCopy.classList.add('active');
        }
      });
    }, { threshold: 0, rootMargin: '-2px' });
    previewVisibilityObserver.observe(workSectionEl);
  }
}

// --- Contact: listening-pulse visibility + background bloom ---
// The pulse animation itself is a plain CSS infinite loop (see .listen-ring in style.css) since
// it never triggers/resets like the hero or work-section ripples do -- the only thing JS needs
// to do here is fade it in/out with the section, so it isn't burning cycles (and isn't visible
// mid-fade into the section) while scrolled away. The background bloom (see triggerSectionBloom
// above) rides the exact same observer/threshold as the pulse itself -- tied to its trigger
// timing, not a separate one -- and originates from the pulse's own on-screen position, computed
// fresh each time in case the CTA row has reflowed (e.g. a viewport resize) since the last entry.
// (Contact briefly had its own raindrop stage instead of this -- reverted; the pulse-driven
// bloom is the intended treatment here, not a stand-in for one.)
const listenPulse = document.getElementById('listenPulse');
const contactSection = document.getElementById('contact');
const contactBloomEl = document.getElementById('contactBloom');
if (listenPulse && contactSection) {
  const listenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      listenPulse.classList.toggle('in-view', entry.isIntersecting);
      if (entry.isIntersecting) {
        triggerSectionBloom(contactSection, contactBloomEl, listenPulse);
      } else {
        resetSectionBloom(contactBloomEl);
      }
    });
  }, { threshold: 0.2 });
  listenObserver.observe(contactSection);
}

// Smooth scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach(function(link){
  link.addEventListener('click', function(e){
    var target = document.querySelector(link.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// --- Wheel-driven section resistance ---
// CSS scroll-snap-type is binary (snap or don't) — there's no way to express "resist a little,
// then commit" with it alone. This adds that on top: while scrolling freely INSIDE a section
// (one taller than the viewport, like About can be) is untouched, the moment the wheel would
// carry you PAST a section's edge, that transition is gated behind a small accumulated-delta
// threshold instead of firing on the first tick. Small/accidental nudges at a boundary do
// nothing; a sustained scroll crosses the threshold and commits to a smooth scroll into the
// next section — that's the "resist, then yank through" feel.
//
// Wheel-only deliberately: touch has no discrete "wheel tick" to gate the same way, and mobile
// already gets a clean single-gesture snap from the native CSS scroll-snap-type above. This
// doesn't touch that — it only ever intervenes on an actual `wheel` event.
(function () {
  var stops = Array.prototype.slice.call(document.querySelectorAll('.snap-section'));
  if (stops.length < 2) return;

  var THRESHOLD = 70;    // accumulated wheel delta (px) needed to commit to moving one stop —
                         // 150 held sections too hard (too much scrolling needed to get out)
  var IDLE_RESET = 220;  // ms of no wheel activity before the accumulator drops back to 0
  var LOCK_MS = 1200;    // wheel-input lock + scroll-snap-restore fallback ceiling (scrollend
                         // fires sooner in browsers that support it; this just has to safely
                         // outlast the longest realistic section-to-section smooth scroll)
  var EDGE_TOLERANCE = 2; // px slack for "is this section's edge at the viewport edge"

  var accum = 0;
  var idleTimer = null;
  var lockUntil = 0;

  function currentStopIndex() {
    var idx = 0;
    for (var i = 0; i < stops.length; i++) {
      if (stops[i].offsetTop <= window.scrollY + EDGE_TOLERANCE) idx = i;
    }
    return idx;
  }

  function atEdge(direction) {
    var rect = stops[currentStopIndex()].getBoundingClientRect();
    return direction > 0
      ? rect.bottom <= window.innerHeight + EDGE_TOLERANCE
      : rect.top >= -EDGE_TOLERANCE;
  }

  function goToStop(index) {
    index = Math.max(0, Math.min(stops.length - 1, index));
    var target = stops[index];
    // scroll-snap-stop:always on every .snap-section blocks ANY smooth scroll animation that
    // leaves one, programmatic or not — confirmed by testing that even a plain
    // window.scrollTo({top:500, behavior:'smooth'}) from mid-Work was fully rejected, not just
    // partially resisted. Same fix as the mobile tap-to-reveal scroll elsewhere in this file:
    // suspend snapping for the duration of this animation, then hand back control to CSS.
    //
    // Restoring on a fixed timeout alone isn't safe — a long hop (e.g. Work to Hero, ~820px)
    // can still be mid-animation past LOCK_MS, and re-enabling mandatory snap while a scroll is
    // still in flight yanks it back to wherever it was, undoing the whole move. `scrollend`
    // (Chrome/Firefox) restores right when the animation actually finishes instead; the timeout
    // is just the fallback for browsers without it (Safari), given a longer ceiling.
    var html = document.documentElement;
    html.style.scrollSnapType = 'none';
    lockUntil = Date.now() + LOCK_MS;

    var restored = false;
    function restoreSnap() {
      if (restored) return;
      restored = true;
      html.style.scrollSnapType = '';
    }
    window.addEventListener('scrollend', restoreSnap, { once: true });
    setTimeout(restoreSnap, LOCK_MS);

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.addEventListener('wheel', function (e) {
    if (Date.now() < lockUntil) { e.preventDefault(); return; }

    var direction = e.deltaY > 0 ? 1 : -1;

    if (!atEdge(direction)) {
      // Room to scroll freely within the current section — get out of the way entirely.
      accum = 0;
      clearTimeout(idleTimer);
      return;
    }

    e.preventDefault();
    accum += Math.abs(e.deltaY);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { accum = 0; }, IDLE_RESET);

    if (accum >= THRESHOLD) {
      accum = 0;
      goToStop(currentStopIndex() + direction);
    }
  }, { passive: false });
})();
