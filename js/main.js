// --- Work section: ripple reveal, scroll-triggered, center-anchored hover preview ---
// 4 projects currently. To add another, just add one object here — nothing else
// needs to change, position/animation are computed from this list.
const projects = [
  { key:'nitefind', name:'Nitefind', hook:'too many options, not enough certainty', href:'case-studies/nitefind.html', angle:-90, radius:220 },
  { key:'smiteforge', name:'SmiteForge', hook:'one brand, two very different platforms', href:'case-studies/smiteforge.html', angle:0, radius:220 },
  { key:'zentra', name:'Zentra', hook:'saving money without losing motivation', href:'case-studies/zentra.html', angle:90, radius:220 },
  { key:'amun', name:'Amun', hook:'still being built', href:'case-studies/amun.html', angle:180, radius:220 },
];

const stage = document.getElementById('rippleStage');
if (stage) {
  const cx = 300, cy = 300;
  function place(el, angle, radius) {
    const rad = angle * Math.PI / 180;
    el.style.left = (cx + radius * Math.cos(rad)) + 'px';
    el.style.top = (cy + radius * Math.sin(rad)) + 'px';
    el.style.transform = (angle > -45 && angle < 135) ? 'translate(0,-50%)' : 'translate(-100%,-50%)';
  }

  projects.forEach(p => {
    const el = document.createElement('a');
    el.className = 'node';
    el.href = p.href;
    el.innerHTML = `<div>${p.name}</div><div class="hook">${p.hook}</div>`;
    place(el, p.angle, p.radius);
    stage.appendChild(el);
    p.el = el;

    // Preview screen still placeholder color blocks — swap for real cropped
    // screenshots once available, per HANDOFF.md open item.
    const preview = document.createElement('div');
    preview.className = 'preview ' + p.key;
    preview.innerHTML = `<div class="bar"></div><div class="body"><span style="width:70%"></span><span style="width:45%"></span></div>`;
    stage.appendChild(preview);
    p.preview = preview;

    el.addEventListener('mouseenter', () => { stage.classList.add('hovering'); preview.classList.add('active'); });
    el.addEventListener('mouseleave', () => { stage.classList.remove('hovering'); preview.classList.remove('active'); });
    el.addEventListener('focus', () => { stage.classList.add('hovering'); preview.classList.add('active'); });
    el.addEventListener('blur', () => { stage.classList.remove('hovering'); preview.classList.remove('active'); });
  });

  let rippleHasPlayed = false;
  function playRipple() {
    if (rippleHasPlayed) return;
    rippleHasPlayed = true;
    let delay = 200;
    [1, 2, 3].forEach(() => {
      const ring = document.createElement('div');
      ring.className = 'ring';
      stage.insertBefore(ring, stage.firstChild);
      setTimeout(() => {
        ring.style.transition = 'width 1.3s ease-out, height 1.3s ease-out, opacity 1.3s ease-out';
        ring.style.opacity = '0.5';
        requestAnimationFrame(() => {
          ring.style.width = ring.style.height = '440px';
          ring.style.opacity = '0';
        });
      }, delay);
      delay += 220;
    });
    projects.forEach((p, i) => {
      setTimeout(() => {
        p.el.style.transition = 'opacity 0.6s ease';
        p.el.style.opacity = '1';
      }, 450 + i * 170);
    });
  }

  // Watch the SECTION (guaranteed full-viewport via scroll-snap), not just the
  // inner stage — this is what makes the trigger reliable. See HANDOFF.md.
  const workSection = document.getElementById('work');
  const rippleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) playRipple(); });
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
