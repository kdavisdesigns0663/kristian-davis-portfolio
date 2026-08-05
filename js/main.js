const PROJ = {
  nitefind:   { rgb:'176,74,214', hook:'too many options, not enough certainty', img:'img/previews/nitefind-preview.jpg',   href:'case-studies/nitefind.html', angle:-45 },
  smiteforge: { rgb:'224,184,74', hook:'one brand, two very different platforms', img:'img/previews/smiteforge-preview.jpg', href:'case-studies/smiteforge.html', angle:45 },
  zentra:     { rgb:'79,191,130', hook:'saving money without losing motivation',  img:'img/previews/zentra-preview.jpg',     href:'case-studies/zentra.html', angle:135 },
  amun:       { rgb:'143,143,143',hook:'in progress, launching later this year',  img:'img/previews/amun-preview.jpg',       href:'case-studies/amun.html', angle:225 },
};

class Portfolio {
  constructor() { this.props = {}; }

  init() {
    this.timers = [];
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.applyProps();
    this.initHero();
    this.initWork();
    this.initMobile();
    this.initContact();
    this.initDropdown();
    this.initAnchors();
    this.onResize = () => { this.layoutNodes(); this.syncLayout(); };
    window.addEventListener('resize', this.onResize);
    this.syncLayout();
    this.applyIncomingHash();
    this.initScrollLock();
  }

  wait(fn, ms) { this.timers.push(setTimeout(fn, ms)); }

  applyProps() {
    const hex = this.props.accent;
    if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      document.documentElement.style.setProperty('--accent', hex);
      document.documentElement.style.setProperty('--accent-rgb', r+','+g+','+b);
    }
    this.fall = Math.max(0.5, Number(this.props.fallSpeed) || 1);
    if (this.props.showGhostWords === false) {
      document.querySelectorAll('#page [aria-hidden="true"]').forEach(el => {
        if (el.style.webkitTextStroke || el.style.getPropertyValue('-webkit-text-stroke')) el.style.display = 'none';
      });
    }
  }

  // --- Hero: one continuous left-to-right wipe per line, chained within a phrase ---
  initHero() {
    const hero = document.getElementById('hero');
    const ghost = document.getElementById('heroGhost');
    const lines = Array.from(document.querySelectorAll('#heroHeadline [data-line]'));
    if (!hero || !lines.length) return;

    const play = () => {
      if (this.heroPlayed) return;
      this.heroPlayed = true;
      ghost.style.opacity = '0.35';
      if (this.reduced) {
        lines.forEach(l => { l.style.transition = 'opacity .4s ease'; l.style.opacity = '1'; l.style.setProperty('--reveal','100%'); });
        return;
      }
      // One phrase is one thought: the reveal edge holds a constant pace measured in ems, so
      // it reads as a single continuous sweep across both lines regardless of their length or
      // type size. The only break is the deliberate pause between the two phrases.
      const EM_PER_SEC = 8, PHRASE_PAUSE = 1.2;
      let delay = 1, prev = null;
      lines.forEach(line => {
        const phrase = line.dataset.line;
        const em = parseFloat(getComputedStyle(line).fontSize) || 16;
        const dur = line.getBoundingClientRect().width / (em * EM_PER_SEC);
        if (prev !== null && phrase !== prev) delay += PHRASE_PAUSE;
        line.style.transitionDelay = delay + 's';
        line.style.transitionDuration = '0.15s, ' + dur + 's';
        line.style.opacity = '1';
        line.style.setProperty('--reveal', '100%');
        delay += dur;
        prev = phrase;
      });
    };
    this.heroPlay = play;
    this.observe(hero, 0.4, play, null);
    // Safety net: if the observer never fires, the headline must not stay invisible.
    this.wait(play, 2500);
  }

  observe(el, threshold, onIn, onOut) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { if (onIn) onIn(); } else if (onOut) onOut(); });
    }, { threshold });
    io.observe(el);
    (this.observers = this.observers || []).push(io);
    return io;
  }

  // --- Work (desktop): names and card land with the section; the drop passes THROUGH them ---
  initWork() {
    const stage = document.getElementById('rippleStage');
    const section = document.getElementById('work');
    if (!stage || !section) return;
    this.stage = stage;
    this.nodes = Array.from(stage.querySelectorAll('[data-node]'));
    this.card = document.getElementById('stageCard');
    this.cta = document.getElementById('stageCta');
    this.layoutNodes();

    const bloom = document.getElementById('workBloom');

    // The drop causes the reveal: nothing blooms until impact.
    // One tempo across the whole reveal: card, wash and rings all resolve inside ~1.6s of
    // impact, so it reads as a single spreading event rather than four overlapping ones.
    const openCard = () => {
      this.card.style.transition = 'clip-path 1s cubic-bezier(.19,1,.22,1), filter .5s ease';
      this.card.style.clipPath = 'circle(150% at 50% 50%)';
      bloom.style.transition = 'clip-path 1.6s cubic-bezier(.19,1,.22,1)';
      bloom.style.clipPath = 'circle(150% at 50% 50%)';
    };
    const showNodes = base => this.nodes.forEach((n, i) => this.wait(() => { n.style.opacity = '1'; }, base + i * 70));

    const play = () => {
      if (this.workPlayed) return;
      this.workPlayed = true;
      if (this.reduced) { openCard(); showNodes(0); return; }
      this.playDrop(stage, {
        fall: this.fall, ringCount: 3, ringStagger: 170, ringDuration: 1.5, ringMax: 470,
        glowDuration: 1, glowMax: 280,
        onImpact: () => {
          openCard();
          this.card.style.animation = 'none';
          void this.card.offsetWidth;
          this.card.style.animation = 'cardRippleD 1.2s cubic-bezier(.22,1,.36,1)';
          showNodes(100);
          this.nodes.forEach((n, i) => this.wait(() => {
            const inner = n.querySelector('[data-inner]');
            inner.style.animation = 'none';
            void inner.offsetWidth;
            inner.style.animation = 'textRipple 1.1s cubic-bezier(.22,1,.36,1)';
          }, 170 + i * 70));
        },
      });
    };
    this.workPlay = play;
    this.observe(section, 0.15, play, null);
    // An intersection callback only fires on an edge, which a reset-then-scroll-back can
    // miss. A cheap scroll check makes the replay deterministic.
    this.onWorkScroll = () => {
      if (this.isMobile ? this.mobilePlayed : this.workPlayed) return;
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        if (this.isMobile) { if (this.playMobile) this.playMobile(); }
        else play();
      }
    };
    window.addEventListener('scroll', this.onWorkScroll, { passive: true });
    section.addEventListener('click', e => {
      if (this.fastForward()) e.preventDefault();
    }, true);

    // Hover / focus, delegated. The active item is never dimmed, including when it is the
    // focused one — the old CSS :not(:hover) rule dimmed exactly the element it was showing.
    const set = key => {
      if (this.activeKey === key) return;
      this.activeKey = key;
      this.nodes.forEach(n => {
        const k = n.dataset.node;
        n.style.opacity = (key && k !== key) ? '0.25' : '1';
        n.style.color = (key && k === key) ? 'rgb(' + PROJ[k].rgb + ')' : '#e9e7df';
        const inner = n.querySelector('[data-inner]');
        if (inner) inner.style.transform = (key && k === key) ? 'scale(1.08)' : 'scale(1)';
      });
      this.card.style.filter = key ? 'brightness(0.75)' : 'none';
      if (this.cta) {
        const p = key ? PROJ[key] : null;
        this.cta.style.opacity = key ? '1' : '0';
        this.cta.style.pointerEvents = key ? 'auto' : 'none';
        this.cta.style.transform = 'translate(-50%,' + (key ? this.ctaOffset : this.ctaOffset + 12) + 'px)';
        if (p) {
          this.cta.href = p.href;
          this.cta.style.borderColor = 'rgba(' + p.rgb + ',0.85)';
          this.cta.setAttribute('aria-label', 'View the ' + key + ' case study');
        }
      }
      stage.querySelectorAll('[data-preview]').forEach(p => {
        const on = p.dataset.preview === key;
        const shot = p.querySelector('[data-shot]');
        const ring = p.querySelector('[data-ring]');
        const shim = p.querySelector('[data-shimmer]');
        const glow = p.querySelector('[data-glowback]');
        const rgb = PROJ[p.dataset.preview].rgb;
        if (glow) glow.style.opacity = on ? '1' : '0';
        p.style.opacity = on ? '1' : '0';
        p.style.transform = 'translate(-50%,-50%) translateY(' + (on ? this.groupShift : this.groupShift + 16) + 'px) scale(' + (on ? 1 : 0.92) + ')';
        p.style.width = on ? this.previewW + 'px' : '56px';
        p.style.height = on ? this.previewH + 'px' : '121px';
        shot.style.boxShadow = on ? '0 0 90px 14px rgba(' + rgb + ',0.4)' : '0 0 0 0 rgba(' + rgb + ',0)';
        ring.style.opacity = on ? '1' : '0';
        if (on) {
          ring.style.animation = 'none'; void ring.offsetWidth;
          ring.style.animation = 'ringSpin 1.3s cubic-bezier(.19,1,.22,1) 1 forwards';
          shim.style.animation = 'none'; void shim.offsetWidth;
          shim.style.animation = 'previewShimmer 1.1s cubic-bezier(.19,1,.22,1) .2s 1';
        }
      });
    };
    // The active preview persists: it only changes when another project takes over.
    this.nodes.forEach(n => {
      const k = n.dataset.node;
      n.addEventListener('mouseenter', () => set(k));
      n.addEventListener('focus', () => set(k));
    });
  }

  initDropdown() {
    const det = document.querySelector('nav details');
    if (!det) return;
    const menu = det.querySelector('ul');
    const summary = det.querySelector('summary');
    const caret = summary && summary.querySelector('span');

    det.addEventListener('toggle', () => {
      if (caret) caret.style.transform = det.open ? 'translateY(1px) rotate(180deg)' : 'translateY(1px)';
      if (!det.open || !menu) return;
      menu.style.transition = 'none';
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px) scale(.97)';
      void menu.offsetHeight;
      menu.style.transition = 'opacity .2s ease, transform .32s cubic-bezier(.19,1,.22,1)';
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0) scale(1)';
    });
    if (caret) caret.style.transition = 'transform .3s cubic-bezier(.19,1,.22,1)';

    const close = () => { if (det.open) det.open = false; };
    // Pointerdown covers mouse, touch and pen, so tapping out closes it on every device.
    this.onDocPointer = e => { if (det.open && !det.contains(e.target)) close(); };
    document.addEventListener('pointerdown', this.onDocPointer, true);
    this.onDocKey = e => {
      if (e.key === 'Escape' && det.open) { close(); if (summary) summary.focus(); }
    };
    document.addEventListener('keydown', this.onDocKey);
    menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    this.onDocScrollClose = () => close();
    window.addEventListener('scroll', this.onDocScrollClose, { passive: true });
  }

  layoutNodes() {
    if (!this.stage || !this.nodes) return;
    const r = this.stage.getBoundingClientRect();
    if (!r.width) return;
    const rx = r.width * 0.373, ry = r.height * 0.428;
    this.nodes.forEach(n => {
      const a = PROJ[n.dataset.node].angle * Math.PI / 180;
      n.style.transform = 'translate(-50%,-50%) translate(' + (rx * Math.cos(a)) + 'px,' + (ry * Math.sin(a)) + 'px)';
    });
    // The preview and its CTA read as one group, so the image sits above centre to make
    // room for the button underneath it.
    this.previewW = Math.round(Math.min(190, r.height * 0.32));
    this.previewH = Math.round(this.previewW * 498 / 230);
    this.groupShift = -30;
    this.ctaOffset = this.groupShift + Math.round(this.previewH / 2) + 18;
    if (this.cta && this.activeKey) this.cta.style.transform = 'translate(-50%,' + this.ctaOffset + 'px)';
  }

  // Shared drop + ripple. Rings must start at an explicit 0 size and get a forced reflow
  // between setting the transition and the target size, or the browser will not animate them.
  playDrop(container, o) {
    const wrap = container.querySelector('[data-drop-wrap]');
    const flash = container.querySelector('[data-flash]');
    const glow = container.querySelector('[data-glow]');
    if (!wrap) return;
    container.querySelectorAll('[data-ring]').forEach(r => { if (!r.closest('[data-preview]') && r.id !== 'mobileRing') r.remove(); });

    // The fall is a transform, not `top`: transitioning `top` between a viewport unit and a
    // percentage is not interpolable, and the drop teleported to the centre instead of falling.
    const endTop = Math.round(container.getBoundingClientRect().height / 2);
    const dist = Math.round(window.innerHeight * 0.9) + endTop;
    this.dropEndTop = endTop;
    wrap.style.transition = 'none';
    wrap.style.top = endTop + 'px';
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateX(-50%) translateY(' + -dist + 'px) scaleY(1)';
    wrap.style.filter = 'blur(0px)';
    void wrap.offsetHeight;
    wrap.style.transition = 'transform ' + o.fall + 's cubic-bezier(.36,.06,.29,.99), opacity .25s ease';
    wrap.style.transform = 'translateX(-50%) translateY(0px) scaleY(1.4)';
    wrap.style.opacity = '1';
    wrap.style.transform = 'translateX(-50%) scaleY(1.4)';

    const impact = () => {
      // A real drop does not drift away, it flattens into the surface and is gone in about a
      // sixth of a second. It has to vanish as the first ring is born, or the ring stops
      // reading as something the drop caused.
      wrap.style.transition = 'transform .17s cubic-bezier(.22,.9,.3,1), opacity .15s ease-out .04s, filter .17s ease-out';
      wrap.style.transform = 'translateX(-50%) translateY(5px) scale(2.2,0.06)';
      wrap.style.opacity = '0';
      wrap.style.filter = 'blur(1px)';

      flash.style.transition = 'transform .36s cubic-bezier(.16,1,.3,1), opacity .34s ease-out';
      flash.style.opacity = '1'; void flash.offsetWidth;
      flash.style.transform = 'translate(-50%,-50%) scale(7)';
      flash.style.opacity = '0';

      if (glow) {
        glow.style.transition = 'none';
        glow.style.width = glow.style.height = '0px';
        glow.style.opacity = '0';
        void glow.offsetHeight;
        glow.style.transition = 'width ' + o.glowDuration + 's cubic-bezier(.16,1,.3,1), height ' + o.glowDuration + 's cubic-bezier(.16,1,.3,1), opacity ' + o.glowDuration + 's ease-out .3s';
        glow.style.opacity = '0.4'; void glow.offsetHeight;
        glow.style.width = glow.style.height = o.glowMax + 'px';
        glow.style.opacity = '0';
      }

      let d = 0;
      for (let i = 0; i < o.ringCount; i++) {
        const ring = document.createElement('div');
        const j = () => 48 + Math.random() * 6;
        ring.setAttribute('data-ring', 'ripple');
        // Each successive ring carries less of the impact: thinner, fainter, shorter reach.
        const strength = 1 - i * 0.26;
        const dur = o.ringDuration * (1 + i * 0.12);
        ring.style.cssText = 'position:absolute;top:50%;left:50%;z-index:2;width:0;height:0;border:' + (1 + 2.2 * strength).toFixed(2) + 'px solid var(--accent);transform:translate(-50%,-50%);opacity:0;filter:blur(0px);border-radius:' + j() + '% ' + j() + '% ' + j() + '% ' + j() + '%';
        container.insertBefore(ring, container.firstChild);
        this.wait(() => {
          ring.style.transition = 'width ' + dur + 's cubic-bezier(.16,1,.3,1), height ' + dur + 's cubic-bezier(.16,1,.3,1), opacity ' + dur + 's ease-out, filter ' + dur + 's ease-out, border-width ' + dur + 's ease-out';
          ring.style.opacity = (0.6 * strength).toFixed(2); void ring.offsetHeight;
          const size = o.ringMax * (1 - i * 0.16) + Math.random() * o.ringMax * 0.1;
          ring.style.width = ring.style.height = size + 'px';
          ring.style.opacity = '0';
          ring.style.filter = 'blur(5px)';
          ring.style.borderWidth = '0.5px';
        }, d);
        this.wait(() => ring.remove(), d + dur * 1000 + 100);
        d += o.ringStagger;
      }
      if (o.onImpact) o.onImpact();
    };
    // Held so a click can land the drop early instead of waiting out the fall.
    this.pendingImpact = impact;
    this.impactTimer = setTimeout(() => {
      this.pendingImpact = null;
      this.impactTimer = null;
      impact();
    }, o.fall * 1000);
    this.timers.push(this.impactTimer);
  }

  // Clicking mid-fall lands the drop now; the reveal it causes runs at full speed.
  fastForward() {
    if (!this.pendingImpact) return false;
    clearTimeout(this.impactTimer);
    const fn = this.pendingImpact;
    this.pendingImpact = null;
    this.impactTimer = null;
    const wrap = document.querySelector((this.isMobile ? '#mobileDropStage' : '#rippleStage') + ' [data-drop-wrap]');
    if (wrap) {
      wrap.style.transition = 'none';
      wrap.style.top = (this.dropEndTop || 0) + 'px';
      wrap.style.transform = 'translateX(-50%) translateY(0px) scaleY(1.4)';
      wrap.style.opacity = '1';
      void wrap.offsetHeight;
    }
    fn();
    return true;
  }

  // --- Work (mobile): pills + one shared preview. The drop anchor lives inside the card,
  // so it lands on the card's real centre instead of the section's geometric centre. ---
  initMobile() {
    const wrap = document.getElementById('workMobile');
    const pills = Array.from(document.querySelectorAll('[data-pill]'));
    if (!wrap || !pills.length) return;
    this.mobileWrap = wrap;

    const img = document.getElementById('mobilePreviewImg');
    const shot = document.getElementById('mobileShot');
    const ring = document.getElementById('mobileRing');
    const desc = document.getElementById('mobileDesc');
    const link = document.getElementById('mobileLink');
    const copy = document.getElementById('mobileCopy');

    const select = key => {
      if (this.mobileKey === key) return;
      const fresh = !this.mobileKey;
      this.mobileKey = key;
      const p = PROJ[key];
      pills.forEach(b => {
        const on = b.dataset.pill === key;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.color = on ? '#e9e7df' : '#a09c92';
        b.style.borderColor = on ? 'rgba(' + p.rgb + ',0.9)' : '#3a3a38';
        b.style.background = on ? 'rgba(' + p.rgb + ',0.14)' : 'none';
        b.style.boxShadow = on ? '0 0 20px -4px rgba(' + p.rgb + ',0.55)' : 'none';
      });
      link.href = p.href;
      const apply = () => {
        img.src = p.img;
        desc.textContent = p.hook;
        img.style.opacity = '1';
        desc.style.opacity = '1';
        shot.style.opacity = '1';
        shot.style.transform = 'scale(1)';
        shot.style.boxShadow = '0 0 50px 6px rgba(' + p.rgb + ',0.3)';
        ring.style.background = 'conic-gradient(from 0deg, transparent 0%, rgba(' + p.rgb + ',.9) 10%, #fff 18%, rgba(' + p.rgb + ',.9) 26%, transparent 42%, transparent 100%)';
        ring.style.opacity = '1';
        ring.style.animation = 'none'; void ring.offsetWidth;
        ring.style.animation = 'ringSpin 1.3s cubic-bezier(.19,1,.22,1) 1 forwards';
        copy.style.opacity = '1';
      };
      if (fresh) { apply(); }
      else {
        img.style.opacity = '0';
        desc.style.opacity = '0';
        clearTimeout(this.swapTimer);
        this.swapTimer = setTimeout(apply, 180);
      }
    };
    pills.forEach(b => b.addEventListener('click', () => select(b.dataset.pill)));

    const card = document.getElementById('mobileCard');
    const dropStage = document.getElementById('mobileDropStage');
    const bloom = document.getElementById('workBloom');
    const section = document.getElementById('work');

    const openMobileCard = () => {
      card.style.transition = 'clip-path 1s cubic-bezier(.19,1,.22,1)';
      card.style.clipPath = 'circle(150% at 50% 50%)';
      bloom.style.transition = 'clip-path 1.6s cubic-bezier(.19,1,.22,1)';
      bloom.style.clipPath = 'circle(150% at 50% 50%)';
    };

    this.playMobile = () => {
      if (this.mobilePlayed) return;
      this.mobilePlayed = true;
      if (this.reduced) { openMobileCard(); select('nitefind'); return; }
      this.playDrop(dropStage, {
        fall: Math.min(this.fall, 1.1), ringCount: 3, ringStagger: 160, ringDuration: 1.2,
        ringMax: 340, glowDuration: 1, glowMax: 240,
        onImpact: () => {
          openMobileCard();
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'cardRippleM 1.2s cubic-bezier(.22,1,.36,1)';
          this.wait(() => select('nitefind'), 120);
        },
      });
    };
    if (section) this.observe(section, 0.15, () => { if (this.isMobile) this.playMobile(); }, null);
  }

  // One layout switch, so the desktop sequence never runs behind display:none on a phone.
  syncLayout() {
    const mobile = window.matchMedia('(max-width:700px)').matches;
    if (mobile === this.isMobile) return;
    this.isMobile = mobile;
    if (this.stage) this.stage.style.display = mobile ? 'none' : 'block';
    if (this.mobileWrap) this.mobileWrap.style.display = mobile ? 'flex' : 'none';
    if (mobile && this.playMobile) {
      const r = document.getElementById('work').getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) this.playMobile();
    }
    if (!mobile) this.layoutNodes();
  }

  initContact() {
    const pulse = document.getElementById('listenPulse');
    const section = document.getElementById('contact');
    if (!pulse || !section || this.reduced) return;
    this.observe(section, 0.2, () => { pulse.style.opacity = '1'; }, () => { pulse.style.opacity = '0'; });
  }

  // Arriving from a project page with #about or #contact: the DC mounts after the browser
  // has already given up on the hash, so the jump has to be re-applied once laid out.
  applyIncomingHash() {
    const id = (window.location.hash || '').slice(1);
    if (!id) return;
    const t = document.getElementById(id);
    if (!t) return;
    // 'auto' resolves to the CSS scroll-behavior (smooth here), which lands mid-animation.
    const jump = () => { this.suspendSnap(); window.scrollTo({ top: t.offsetTop, behavior: 'instant' }); };
    jump();
    requestAnimationFrame(jump);
    this.wait(jump, 120);
    this.wait(jump, 400);
  }

  // Every section snaps, which means a programmatic jump can be dragged to the wrong
  // section's snap point mid-flight. Snapping is lifted for the duration of the jump only.
  suspendSnap(restoreAfter) {
    const html = document.documentElement;
    html.style.scrollSnapType = 'none';
    clearTimeout(this.snapTimer);
    const restore = () => { html.style.scrollSnapType = ''; };
    this.snapTimer = setTimeout(restore, restoreAfter || 260);
    this.timers.push(this.snapTimer);
  }

  // --- Forced section-to-section scroll, wheel (desktop) and touch (mobile) ---
  // CSS scroll-snap-type:mandatory was tried here and measurably broke scrolling instead of
  // fixing it: A/B tested against proximity with identical synthetic wheel input, mandatory got
  // permanently stuck at the first section boundary (0px of further scroll across 40+ events)
  // while proximity scrolled the full page freely every time. Whatever the underlying engine
  // reason, relying on native mandatory snap to "lock" mobile isn't safe here. This instead
  // intercepts wheel/touch input directly, the same way the site used to handle desktop wheel
  // scrolling: while there's room left to scroll WITHIN the current section, native scrolling is
  // untouched (this is what lets #about, which runs to roughly 1800px tall on a phone, scroll
  // through freely); the moment input would carry you PAST a section's own edge, that default is
  // prevented and gated behind an accumulated-distance threshold instead of firing immediately,
  // then committed with one scrollIntoView. Small/accidental nudges at a boundary do nothing; a
  // sustained wheel spin or a real swipe crosses the threshold and locks the next section in.
  initScrollLock() {
    const stops = ['hero', 'work', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    if (stops.length < 2) return;

    const WHEEL_THRESHOLD = 70, TOUCH_THRESHOLD = 60, IDLE_RESET = 220, LOCK_MS = 1200, EDGE_TOL = 2;
    let wheelAccum = 0, wheelIdleTimer = null, lockUntil = 0;

    const currentStopIndex = () => {
      let idx = 0;
      for (let i = 0; i < stops.length; i++) if (stops[i].offsetTop <= window.scrollY + EDGE_TOL) idx = i;
      return idx;
    };
    const atEdge = direction => {
      const rect = stops[currentStopIndex()].getBoundingClientRect();
      return direction > 0 ? rect.bottom <= window.innerHeight + EDGE_TOL : rect.top >= -EDGE_TOL;
    };
    // No animation on mobile (instant lock, per the owner's explicit ask) -- desktop keeps the
    // smooth glide it already had.
    const goToStop = index => {
      this.suspendSnap(LOCK_MS);
      lockUntil = Date.now() + LOCK_MS;
      stops[index].scrollIntoView({ behavior: this.isMobile ? 'instant' : 'smooth', block: 'start' });
    };

    window.addEventListener('wheel', e => {
      if (Date.now() < lockUntil) { e.preventDefault(); return; }
      const direction = e.deltaY > 0 ? 1 : -1;
      const target = currentStopIndex() + direction;
      // Past the first/last stop: nothing to lock into, so don't intercept at all -- let the
      // browser's own end-of-page behavior (or bounce) happen rather than forcing a re-commit to
      // the section we're already resting in.
      if (target < 0 || target >= stops.length || !atEdge(direction)) {
        wheelAccum = 0; clearTimeout(wheelIdleTimer); return;
      }
      e.preventDefault();
      wheelAccum += Math.abs(e.deltaY);
      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(() => { wheelAccum = 0; }, IDLE_RESET);
      if (wheelAccum >= WHEEL_THRESHOLD) { wheelAccum = 0; goToStop(target); }
    }, { passive: false });

    // Touch has no discrete "tick" to gate the way a wheel event does, so direction and distance
    // both come from comparing the current touch point against where the gesture started.
    // touchLockedDirection is decided once, on the gesture's first move, and held for the rest of
    // it -- recomputing it every event let a finger that wavers mid-swipe reset atEdge() against
    // the wrong direction and either drop the gesture or fight the user.
    let touchStartY = null, touchLockedDirection = 0;
    window.addEventListener('touchstart', e => {
      if (Date.now() < lockUntil) return;
      touchStartY = e.touches[0].clientY;
      touchLockedDirection = 0;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      // Locked (a stop was just committed): keep intercepting every remaining touchmove in THIS
      // gesture, not just the one that triggered goToStop -- without this, the finger is still
      // physically dragging and the browser resumes native scrolling on top of the programmatic
      // jump the instant this handler stops calling preventDefault, overshooting past the section
      // scrollIntoView just landed on.
      if (Date.now() < lockUntil) { e.preventDefault(); return; }
      if (touchStartY === null) return;
      const delta = touchStartY - e.touches[0].clientY; // finger up = scrolling down = direction 1
      const direction = delta > 0 ? 1 : -1;
      if (!touchLockedDirection) touchLockedDirection = direction;
      const target = currentStopIndex() + touchLockedDirection;
      // Past the first/last stop, or room left in the current section: don't intercept, let it
      // scroll natively (see the matching comment on the wheel handler above).
      if (target < 0 || target >= stops.length || !atEdge(touchLockedDirection)) return;
      e.preventDefault();
      if (Math.abs(delta) >= TOUCH_THRESHOLD) {
        touchStartY = null;
        touchLockedDirection = 0;
        goToStop(target);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => { touchStartY = null; touchLockedDirection = 0; }, { passive: true });
  }

  // KD in the nav returns the page to its opening state and replays every reveal.
  resetAll() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.pendingImpact = null;
    this.impactTimer = null;
    clearTimeout(this.swapTimer);

    window.scrollTo({ top: 0, behavior: 'instant' });

    // hero
    const ghost = document.getElementById('heroGhost');
    if (ghost) ghost.style.opacity = '0';
    document.querySelectorAll('#heroHeadline [data-line]').forEach(l => {
      l.style.transition = 'none';
      l.style.opacity = '0';
      l.style.setProperty('--reveal', '0%');
      l.style.transitionDelay = '0s';
      void l.offsetWidth;
      l.style.transition = 'opacity .15s ease, --reveal 2s linear';
    });
    this.heroPlayed = false;

    // work, both layouts
    this.workPlayed = false;
    this.mobilePlayed = false;
    this.activeKey = null;
    this.mobileKey = null;
    const bloom = document.getElementById('workBloom');
    [bloom, this.card, document.getElementById('mobileCard')].forEach(el => {
      if (!el) return;
      el.style.transition = 'none';
      el.style.animation = 'none';
      el.style.clipPath = 'circle(0% at 50% 50%)';
      void el.offsetWidth;
    });
    if (this.card) this.card.style.filter = 'none';
    if (this.nodes) this.nodes.forEach(n => {
      n.style.opacity = '0';
      n.style.color = '#e9e7df';
      const inner = n.querySelector('[data-inner]');
      if (inner) { inner.style.animation = 'none'; inner.style.transform = 'scale(1)'; }
    });
    if (this.cta) { this.cta.style.opacity = '0'; this.cta.style.pointerEvents = 'none'; }
    document.querySelectorAll('#rippleStage [data-preview]').forEach(p => {
      p.style.opacity = '0';
      const g = p.querySelector('[data-glowback]');
      const r = p.querySelector('[data-ring]');
      if (g) g.style.opacity = '0';
      if (r) r.style.opacity = '0';
    });
    document.querySelectorAll('[data-ring="ripple"]').forEach(r => r.remove());
    ['#rippleStage', '#mobileDropStage'].forEach(sel => {
      const w = document.querySelector(sel + ' [data-drop-wrap]');
      if (!w) return;
      w.style.transition = 'none';
      w.style.top = -Math.round(window.innerHeight * 0.9) + 'px';
      w.style.opacity = '0';
      w.style.transform = 'translateX(-50%) translateY(0px) scaleY(1)';
      w.style.filter = 'blur(0px)';
      void w.offsetHeight;
    });
    // mobile stack
    const shot = document.getElementById('mobileShot');
    const mring = document.getElementById('mobileRing');
    const copy = document.getElementById('mobileCopy');
    if (shot) { shot.style.opacity = '0'; shot.style.transform = 'scale(.96)'; shot.style.boxShadow = 'none'; }
    if (mring) mring.style.opacity = '0';
    if (copy) copy.style.opacity = '0';
    document.querySelectorAll('[data-pill]').forEach(b => {
      b.setAttribute('aria-pressed', 'false');
      b.style.color = '#a09c92';
      b.style.borderColor = '#3a3a38';
      b.style.background = 'none';
      b.style.boxShadow = 'none';
    });

    // contact
    const pulse = document.getElementById('listenPulse');
    if (pulse) pulse.style.opacity = '0';

    // replay from the top; the work observer re-fires when it next scrolls into view
    this.wait(() => {
      this.heroPlayed = false;
      if (this.heroPlay) this.heroPlay();
      // A reset that lands with the work section still on screen gets no fresh
      // intersection callback, so replay it directly in that case.
      const w = document.getElementById('work');
      if (!w) return;
      const r = w.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        if (this.isMobile) { if (this.playMobile) this.playMobile(); }
        else if (this.workPlay) this.workPlay();
      }
    }, 60);
  }

  initAnchors() {
    const brand = document.querySelector('nav a[aria-label="Kristian Davis, home"]');
    if (brand) brand.addEventListener('click', e => { e.preventDefault(); this.resetAll(); });
    window.addEventListener('hashchange', () => this.applyIncomingHash());
    document.querySelectorAll('#page a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        this.suspendSnap(this.reduced ? 260 : 1100);
        window.scrollTo({ top: t.offsetTop, behavior: this.reduced ? 'instant' : 'smooth' });
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new Portfolio().init());
