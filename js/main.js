// --- Work section: raindrop fall + ripple reveal, scroll-triggered, center-anchored hover preview ---
// 4 projects currently, arranged in an X (angles 45deg apart from cardinal).
// To add another, just add one object here — position/animation are computed from this list.
const projects = [
  { key:'nitefind', name:'Nitefind', hook:'too many options, not enough certainty', href:'case-studies/nitefind.html', angle:-45, radius:220, img:'img/previews/nitefind-tight.png' },
  { key:'smiteforge', name:'SmiteForge', hook:'one brand, two very different platforms', href:'case-studies/smiteforge.html', angle:45, radius:220, img:'img/previews/smiteforge-tight.png' },
  { key:'zentra', name:'Zentra', hook:'saving money without losing motivation', href:'case-studies/zentra.html', angle:135, radius:220, img:'img/previews/zentra-tight.png' },
  { key:'amun', name:'Amun', hook:'still being built', href:'case-studies/amun.html', angle:225, radius:220, img:'img/previews/amun-placeholder.png', isPlaceholder:true },
];

const stage = document.getElementById('rippleStage');
const dropWrap = document.getElementById('dropWrap');
const flash = document.getElementById('flash');

if (stage && dropWrap && flash) {
  projects.forEach(p => {
    const el = document.createElement('a');
    el.className = 'node';
    el.href = p.href;
    el.tabIndex = 0;
    el.innerHTML = `<div>${p.name}</div><div class="hook">${p.hook}</div>`;
    stage.appendChild(el);
    p.el = el;

    // Preview screen: real cropped project image (or Amun's honest placeholder),
    // with a per-project glow color layered on top. See HANDOFF.md for how
    // the crops were produced (auto-detected bbox against white background).
    const preview = document.createElement('div');
    preview.className = 'preview ' + p.key + (p.isPlaceholder ? ' is-placeholder' : '');
    preview.innerHTML = `<img src="${p.img}" alt=""><div class="preview-tag">${p.name}</div>`;
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

    timers.push(setTimeout(() => { dropWrap.classList.add('falling'); }, 30));

    timers.push(setTimeout(() => {
      dropWrap.classList.add('impact');
      flash.classList.add('flash');

      let delay = 0;
      [1, 2, 3, 4].forEach(() => {
        const ring = document.createElement('div');
        ring.className = 'ring';
        const r1 = 48 + Math.random() * 6, r2 = 48 + Math.random() * 6,
              r3 = 48 + Math.random() * 6, r4 = 48 + Math.random() * 6;
        ring.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}%`;
        stage.insertBefore(ring, stage.firstChild);
        timers.push(setTimeout(() => {
          ring.style.transition = 'width 1.5s ease-out, height 1.5s ease-out, opacity 1.5s ease-out, filter 1.5s ease-out, border-width 1.5s ease-out';
          ring.style.opacity = '0.55';
          ring.offsetHeight;
          ring.style.width = ring.style.height = (400 + Math.random() * 60) + 'px';
          ring.style.opacity = '0';
          ring.style.filter = 'blur(5px)';
          ring.style.borderWidth = '0.5px';
        }, delay));
        delay += 420;
      });

      projects.forEach((p, i) => {
        timers.push(setTimeout(() => {
          p.el.style.transform = `translate(-50%,-50%) ${targetTransform(p.angle, p.radius)} scale(1)`;
          p.el.classList.add('placed');
        }, i * 50));
      });
    }, 1220));
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
