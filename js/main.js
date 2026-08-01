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
  const { container, holdBeforeImpact, ringCount, ringStagger, ringDuration, ringMaxSize, onImpact, registerTimer } = opts;
  const reg = registerTimer || function(id){ return id; };

  const dropWrap = container.querySelector('.drop-wrap');
  const flash = container.querySelector('.impact-flash');
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
    el.innerHTML = `<div>${p.name}</div><div class="hook">${p.hook}</div>`;
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
      holdBeforeImpact: 1220,
      ringCount: 4,
      ringStagger: 420,
      ringDuration: 1.5,
      ringMaxSize: 400,
      registerTimer: (id) => timers.push(id),
      onImpact: () => {
        projects.forEach((p, i) => {
          timers.push(setTimeout(() => {
            p.el.style.transform = `translate(-50%,-50%) ${targetTransform(p.angle, p.radius)} scale(1)`;
            p.el.classList.add('placed');
          }, i * 50));
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

// --- Work section: mobile accordion fallback (below ~700px, see style.css) ---
// Same `projects` array as the desktop raindrop layout, just rendered as a
// tap-to-expand list instead of positioned around the ripple stage. Reuses
// playRaindrop above at a smaller scale for the open animation.
const accordion = document.getElementById('workAccordion');
if (accordion) {
  // Drop falls from the header seam into the preview box, landing at its
  // center ~300ms in — the panel's own expand runs 500ms, so it keeps
  // growing for a couple hundred ms after the drop lands. Ripple plays from
  // that landing point, and the bloom (CSS transition-delay .28s, just
  // before impact at 300ms) scales up from the same center.
  function playMiniRipple(stageEl) {
    playRaindrop({
      container: stageEl,
      holdBeforeImpact: 300,
      ringCount: 2,
      ringStagger: 160,
      ringDuration: 0.8,
      ringMaxSize: 150,
    });
  }

  projects.forEach(p => {
    const item = document.createElement('div');
    item.className = 'work-item';

    const header = document.createElement('button');
    header.className = 'work-item-header';
    header.type = 'button';
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML = `<span><span class="name">${p.name}</span><span class="hook">${p.hook}</span></span><span class="chevron">v</span>`;

    const panel = document.createElement('div');
    panel.className = 'work-item-panel';
    panel.innerHTML = `
      <div class="work-item-preview-stage">
        <div class="drop-wrap"><div class="drop-shape"></div></div>
        <div class="impact-flash"></div>
        <div class="preview ${p.key} work-item-preview-bloom"><div class="bar"></div><div class="body"><span style="width:70%"></span><span style="width:45%"></span></div></div>
      </div>
      <a class="work-item-btn mono" href="${p.href}">view project</a>
    `;
    const stage = panel.querySelector('.work-item-preview-stage');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      accordion.querySelectorAll('.work-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.work-item-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        playMiniRipple(stage);
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
