// --- Hero: headline lines liquid-reveal on load (see style.css for the transition/textRipple
// values — softened and slowed from an earlier version that reused .ripple-stage .node's
// timing exactly, which read as words slamming in rather than a calm ripple at headline
// scale). Staggered in reading order via inline transition-delay/animation-delay set here,
// computed from each line's position among its siblings. The 1.8s gap is deliberate — enough
// to actually read line one before line two starts materializing, not just a beat between them.
// Fires once via IntersectionObserver (hero is the first section, so this effectively means
// "on load") and never resets — this is not a scroll-repeat effect like the work-section ripple.
const heroSection = document.getElementById('hero');
if (heroSection) {
  const heroLines = heroSection.querySelectorAll('.headline > div');
  let heroPlayed = false;
  function playHeroReveal() {
    if (heroPlayed) return;
    heroPlayed = true;
    heroLines.forEach((line, i) => {
      const delay = (i * 1.8) + 's';
      line.style.transitionDelay = delay;
      line.classList.add('placed');
      const inner = line.querySelector('.line-inner');
      if (inner) inner.style.animationDelay = delay;
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
const projects = [
  { key:'nitefind', name:'Nitefind', hook:'too many options, not enough certainty', href:'case-studies/nitefind.html', angle:-45, radius:220 },
  { key:'smiteforge', name:'SmiteForge', hook:'one brand, two very different platforms', href:'case-studies/smiteforge.html', angle:45, radius:220 },
  { key:'zentra', name:'Zentra', hook:'saving money without losing motivation', href:'case-studies/zentra.html', angle:135, radius:220 },
  { key:'amun', name:'Amun', hook:'still being built', href:'case-studies/amun.html', angle:225, radius:220 },
];

// Shared drop-fall + ripple mechanic, used by both the desktop stage and the
// mobile accordion (just at different scale/timing). `container` must have a
// .drop-wrap > .drop-shape, an .impact-flash, and is where .ring elements get
// inserted. Correctness notes carried over from getting this working:
// - falling must be REMOVED before impact is added — leaving both classes on
//   at once means two same-specificity rules fight over `transition`/`opacity`,
//   which is what silently broke the drop on desktop.
// - rings must start at explicit width/height:0 (in CSS) and get a forced
//   reflow (ring.offsetHeight) between setting the transition and setting the
//   target size, or the browser won't animate the change at all.
function playRaindrop(opts) {
  const { container, holdBeforeImpact, ringCount, ringStagger, ringDuration, ringMaxSize, glowDuration, glowMaxSize, onImpact, registerTimer } = opts;
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
      glow.style.transition = 'none';
      glow.style.width = glow.style.height = '0px';
      glow.style.opacity = '0';
      glow.offsetHeight;
      glow.style.transition = `width ${glowDuration}s ease-out, height ${glowDuration}s ease-out, opacity ${glowDuration}s ease-out`;
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
        ring.style.transition = `width ${ringDuration}s ease-out, height ${ringDuration}s ease-out, opacity ${ringDuration}s ease-out, filter ${ringDuration}s ease-out, border-width ${ringDuration}s ease-out`;
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

    // Preview screen still placeholder color blocks — swap for real cropped
    // screenshots once available, per HANDOFF.md open item.
    const preview = document.createElement('div');
    preview.className = 'preview ' + p.key;
    preview.innerHTML = `<div class="bar"></div><div class="body"><span style="width:70%"></span><span style="width:45%"></span></div>`;
    stage.appendChild(preview);
    p.preview = preview;

    const on = () => { stage.classList.add('hovering'); preview.classList.add('active'); };
    const off = () => { stage.classList.remove('hovering'); preview.classList.remove('active'); };
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    el.addEventListener('focus', on);
    el.addEventListener('blur', off);
  });

  function targetTransform(angle, radius) {
    const rad = angle * Math.PI / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
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
    dropWrap.classList.remove('falling', 'impact');
    dropWrap.style.opacity = '0';
    flash.classList.remove('flash');
    stage.querySelectorAll('.ring').forEach(r => r.remove());
    projects.forEach(p => {
      p.el.classList.remove('placed');
      p.el.style.transform = 'translate(-50%,-50%) scale(0.3)';
    });
  }

  function playSequence() {
    if (played) return;
    played = true;
    playRaindrop({
      container: stage,
      holdBeforeImpact: 2200,
      ringCount: 4,
      ringStagger: 580,
      ringDuration: 2.3,
      ringMaxSize: 420,
      glowDuration: 1,
      glowMaxSize: 260,
      registerTimer: (id) => timers.push(id),
      onImpact: () => {
        projects.forEach((p, i) => {
          timers.push(setTimeout(() => {
            p.el.style.transform = `translate(-50%,-50%) ${targetTransform(p.angle, p.radius)} scale(1)`;
            p.el.classList.add('placed');
          }, i * 90));
        });
      },
    });
  }

  // Watch the SECTION (guaranteed full-viewport via scroll-snap) so the trigger
  // is reliable, and reset on exit so scrolling back replays the sequence.
  const workSection = document.getElementById('work');
  const rippleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) playSequence();
      else resetSequence();
    });
  }, { threshold: 0.9 });
  if (workSection) rippleObserver.observe(workSection);
}

// --- Work section: mobile accordion (below ~700px, see style.css) ---
// Same `projects` array as the desktop raindrop layout, rendered as a
// tap-to-expand list. The whole thing is one causal chain rather than
// independent animations: drop falls -> impact -> ripple expands -> the
// dropdown materializes out of that same ripple (clip-path circle-reveal
// anchored at the impact point, not a blur/fade). Tapping a project doesn't
// spawn another falling drop — instead a small ripple opens from the center
// of the tapped header (spawnTapRipple) and the preview materializes the
// same way the dropdown did, just faster and anchored at the tap instead of
// the drop.
const accordion = document.getElementById('workAccordion');
const mobileStage = document.getElementById('workMobileStage');
if (accordion) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Filled in as each work-item is built below; playMobileEntrance() reads this once the
  // entrance actually fires, by which point the forEach loop has already run.
  const headerTexts = [];

  // Single reusable expanding-ring element, kept separate from playRaindrop's
  // multi-ring impact sequence since this always fires from a fixed point
  // (the tapped header) rather than a falling drop. Same reflow-before-
  // transition requirement as the rings in playRaindrop applies here too.
  function spawnTapRipple(ripple, { maxSize = 130, duration = 0.7 } = {}) {
    ripple.style.transition = 'none';
    ripple.style.width = ripple.style.height = '0px';
    ripple.style.opacity = '0';
    ripple.offsetHeight;
    ripple.style.transition = `width ${duration}s cubic-bezier(.19,1,.22,1), height ${duration}s cubic-bezier(.19,1,.22,1), opacity ${duration}s ease`;
    ripple.style.opacity = '0.5';
    ripple.offsetHeight;
    ripple.style.width = ripple.style.height = maxSize + 'px';
    ripple.style.opacity = '0';
  }

  let mobileEntrancePlayed = false;
  function playMobileEntrance() {
    if (mobileEntrancePlayed) return;
    mobileEntrancePlayed = true;

    if (prefersReducedMotion || !mobileStage) {
      accordion.classList.add('revealed');
      headerTexts.forEach(t => t.classList.add('placed'));
      return;
    }

    // holdBeforeImpact must match the .falling transition duration in CSS
    // (1.6s) so impact/ripple/reveal all trigger the instant the drop lands.
    playRaindrop({
      container: mobileStage,
      holdBeforeImpact: 1600,
      ringCount: 2,
      ringStagger: 380,
      ringDuration: 0.95,
      ringMaxSize: 300,
      glowDuration: 0.85,
      glowMaxSize: 230,
      onImpact: () => {
        accordion.classList.add('revealed');
        // Starts once the bloom is already underway (0.3s in) rather than racing it, then
        // ripples through the project names one at a time instead of them all appearing
        // together the instant the clip-path finishes expanding.
        headerTexts.forEach((t, i) => {
          const delay = (0.3 + i * 0.22) + 's';
          t.style.transitionDelay = delay;
          t.classList.add('placed');
          const inner = t.querySelector('.header-text-inner');
          if (inner) inner.style.animationDelay = delay;
        });
      },
    });
  }

  // Watching #work (not the accordion itself) means this observer still
  // fires on desktop, where the accordion is display:none — the visibility
  // check below is what actually gates the entrance to mobile. threshold
  // 0.5 plus the one-shot `mobileEntrancePlayed` flag (never reset) is what
  // keeps small scroll jitters near the section boundary from re-triggering
  // it, unlike desktop's ripple which deliberately resets on scroll-out.
  const workSectionEl = document.getElementById('work');
  if (workSectionEl) {
    const entranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && getComputedStyle(accordion).display !== 'none') {
          playMobileEntrance();
        }
      });
    }, { threshold: 0.5 });
    entranceObserver.observe(workSectionEl);
  }

  projects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'work-item';
    const panelId = 'work-panel-' + p.key;

    const header = document.createElement('button');
    header.className = 'work-item-header';
    header.type = 'button';
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', panelId);
    header.innerHTML = `<span class="header-text"><span class="header-text-inner"><span class="name">${p.name}</span><span class="hook">${p.hook}</span></span></span><span class="chevron">v</span>`;
    headerTexts.push(header.querySelector('.header-text'));
    const tapRipple = document.createElement('span');
    tapRipple.className = 'tap-ripple';
    header.appendChild(tapRipple);

    const panel = document.createElement('div');
    panel.className = 'work-item-panel';
    panel.id = panelId;
    panel.innerHTML = `
      <div class="work-item-preview-stage">
        <div class="preview ${p.key} work-item-preview-bloom"><div class="bar"></div><div class="body"><span style="width:70%"></span><span style="width:45%"></span></div></div>
      </div>
      <a class="work-item-btn mono" href="${p.href}">view project</a>
    `;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      accordion.querySelectorAll('.work-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.work-item-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');

        // The preview materializes on its own (pure CSS, driven by .open) —
        // this ripple is purely the visible "cause": it establishes that the
        // tap is what's generating the reveal below, same relationship the
        // falling drop has to the dropdown's entrance.
        if (!prefersReducedMotion) {
          spawnTapRipple(tapRipple);
        }

        // Scroll the preview into view only if it would land below the
        // fold. The open panel's height is a known fixed value (CSS
        // max-height:340px), so this can be computed immediately instead
        // of waiting for the expand transition to finish.
        const headerRect = header.getBoundingClientRect();
        const expectedBottom = headerRect.bottom + 340;
        if (expectedBottom > window.innerHeight) {
          // scroll-snap-type:mandatory on <html> hijacks a plain scrollBy
          // here and snaps straight to the next section instead of making
          // the small in-section nudge we want, so it's suspended for the
          // duration of this scroll and restored once it settles.
          const html = document.documentElement;
          const prevSnap = html.style.scrollSnapType;
          html.style.scrollSnapType = 'none';
          window.scrollBy({ top: expectedBottom - window.innerHeight + 24, behavior: 'smooth' });
          clearTimeout(header._snapRestoreTimer);
          header._snapRestoreTimer = setTimeout(() => {
            html.style.scrollSnapType = prevSnap;
          }, 650);
        }
      }
    });

    item.appendChild(header);
    item.appendChild(panel);
    accordion.appendChild(item);
  });
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
