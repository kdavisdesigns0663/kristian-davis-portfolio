const BANDS = {
  nitefind:   { rgb:'162,89,255' },
  smiteforge: { rgb:'224,184,74' },
  zentra:     { rgb:'79,191,130' },
  amun:       { rgb:'143,143,143' },
};

class Portfolio {
  init() {
    this.timers = [];
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.fall = 1;
    // The hero drop falls slower than the work cascade: it is the one moment the visitor
    // is asked to just watch, so it gets room to breathe.
    this.heroFall = 1.6;
    this.initHero();
    // Bands are put into their hidden state BEFORE the drop is wired: the reverse order lets
    // a fast observer reveal a band and then have initBands reset it to invisible.
    this.initBands();
    this.initDrop();
    this.initSpine();
    this.initContact();
    this.initDropdown();
    this.initAnchors();
    this.applyIncomingHash();
  }

  wait(fn, ms) { this.timers.push(setTimeout(fn, ms)); }

  observe(el, threshold, onIn, onOut) {
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { if (onIn) onIn(); } else if (onOut) onOut(); });
    }, { threshold: threshold });
    io.observe(el);
    (this.observers = this.observers || []).push(io);
  }

  // --- Hero: a drop lands on the waterline and the impact is what reveals the thesis. The
  // reflection beneath the line carries the disturbance, then settles into a slow idle. ---
  initHero() {
    const ghost = document.getElementById('heroGhost');
    const lines = Array.prototype.slice.call(document.querySelectorAll('#heroHeadline [data-line]'));
    const line = document.getElementById('waterline');
    const refl = document.getElementById('reflection');
    const stage = document.getElementById('heroDropStage');
    if (!lines.length || !stage) return;

    const reflLines = Array.prototype.slice.call(document.querySelectorAll('#reflection [data-refl]'));

    // Park the drop's landing point on the waterline's own centre line, so it vanishes exactly
     // where the line is created rather than a stray pixel below the headline block.
    const seatStage = function () {
      if (!line) return;
      stage.style.top = (line.offsetTop + line.offsetHeight / 2) + 'px';
    };
    seatStage();
    window.addEventListener('resize', seatStage);
    // Seating it once at init is not enough. On a cold load this runs while Space Grotesk is
    // still downloading, so the headline is measured in fallback metrics and the waterline is
    // read ~86px lower than where it finally lands (measured at 1280px). The stage kept that
    // stale seat and the drop hit well below the line. Re-seat when the fonts settle, and
    // again in startFall() below, which is the only moment the number actually has to be right.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(seatStage);
    // One phrase at a time. Constant pace in ems, so both read as the same sweep regardless of
    // width, and the reflection is driven off the same duration so each mirrored phrase surfaces
    // in step with the real one rather than fading in as a block.
    const wipe = function (i) {
      const l = lines[i];
      if (!l) return 0;
      const em = parseFloat(getComputedStyle(l).fontSize) || 16;
      const dur = l.getBoundingClientRect().width / (em * 6);
      [l, reflLines[i]].forEach(function (el) {
        if (!el) return;
        el.style.transitionDelay = '0s';
        el.style.transitionDuration = '0.14s, ' + dur + 's';
        el.style.opacity = '1';
        el.style.setProperty('--reveal', '100%');
      });
      return dur;
    };

    const play = () => {
      if (this.heroPlayed) return;
      this.heroPlayed = true;
      if (ghost) ghost.style.opacity = '0.4';

      if (this.reduced) {
        lines.forEach(function (l) { l.style.transition = 'opacity .4s ease'; l.style.opacity = '1'; l.style.setProperty('--reveal', '100%'); });
        line.style.opacity = '1'; line.style.transform = 'scaleX(1)';
        reflLines.forEach(function (el) { el.style.transition = 'opacity .4s ease'; el.style.opacity = '1'; el.style.setProperty('--reveal', '100%'); });
        return;
      }

      const wrap = stage.querySelector('[data-drop-wrap]');
      const flash = stage.querySelector('[data-flash]');

      const impact = () => {
        // Flattens into the surface and is gone in about a sixth of a second, at the same
        // moment the first ring is born.
        wrap.style.transition = 'transform .17s cubic-bezier(.22,.9,.3,1), opacity .15s ease-out .04s, filter .17s ease-out';
        wrap.style.transform = 'translate(-50%,4px) scale(2.4,0.06)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(1px)';
        flash.style.transition = 'transform .38s cubic-bezier(.16,1,.3,1), opacity .36s ease-out';
        flash.style.opacity = '1'; void flash.offsetWidth;
        flash.style.transform = 'translate(-50%,-50%) scale(9)';
        flash.style.opacity = '0';

        // The line spreads out of the point of impact. Layout geometry, not the bounding rect —
        // the line is still at scaleX(0) here, so its rect measures zero width.
        const lw = line.offsetWidth;
        const ox = Math.max(0, Math.min(lw, stage.offsetLeft - line.offsetLeft));
        const pct = lw ? (ox / lw) * 100 : 0;
        // transform-origin alone was not enough to SEE the line being born at the hit: the
        // stock gradient is brightest at the element's own left edge, so however the box was
        // scaled the visual weight sat at x=0 and it read as sweeping in from the left. The
        // bright stop is moved onto the hit instead. It survives the scale because the origin
        // and the stop are the same point of the box, so the core stays pinned to the impact
        // while the line grows outward from it in both directions.
        // Full-strength accent at the core, the same colour the purple phrase is set in and the
        // same colour the drop is, so the drop, the line and the words read as one material
        // rather than three. drop-shadow rather than box-shadow: box-shadow would trace the
        // element's box and hang a glow out over the stretch where the gradient is transparent,
        // whereas drop-shadow follows the painted alpha, so the halo only exists where there is
        // actually liquid, and it compresses with the scale into a bright point at the impact.
        const stop = v => Math.max(0, Math.min(100, v)).toFixed(1) + '%';
        line.style.background =
          'linear-gradient(90deg,' +
          ' transparent ' + stop(pct - 30) + ',' +
          ' rgba(var(--accent-rgb),.55) ' + stop(pct - 11) + ',' +
          ' rgba(var(--accent-rgb),1) ' + stop(pct) + ',' +
          ' rgba(var(--accent-rgb),.34) ' + stop(pct + 28) + ',' +
          ' transparent ' + stop(pct + 60) + ')';
        line.style.transformOrigin = ox.toFixed(1) + 'px 50%';
        line.style.transition = 'opacity .28s ease, transform 1.15s cubic-bezier(.12,.86,.16,1)';
        line.style.opacity = '1';
        line.style.transform = 'scaleX(1)';

        this.ripples(stage, 3, 640, 0);
        // The purple phrase is what the hit writes. The white one is already up by now — it is
        // what called the drop down in the first place.
        wipe(1);
        // The reflection surfaces disturbed, then settles.
        refl.style.animation = 'reflWobble 2.9s cubic-bezier(.22,1,.36,1)';
        this.wait(function () { refl.style.animation = 'reflIdle 11s ease-in-out infinite'; }, 2900);
      };

      // Fired by the fall's own transitionend, not a timer guessed from the duration: the old
      // heroFall*1000 + 300 left the drop sitting on the waterline for a third of a second
      // before anything happened, which is what broke the sense that the hit caused the text.
      // The timeout is only a fallback for a dropped/interrupted transitionend, and the guard
      // matters because impact() starts its own transform transition on the same element.
      const landOnce = () => {
        if (!this.pendingHero) return;
        this.pendingHero = null;
        clearTimeout(this.heroTimer);
        impact();
      };

      // The drop is not released until the white phrase has finished writing itself, so the
      // fall is armed here rather than at the top of play().
      const startFall = () => {
        // Last word on where the drop is aimed, taken after the headline has finished writing
        // itself and the layout has settled for good.
        seatStage();
        const dist = Math.round(window.innerHeight * 0.6);
        wrap.style.transition = 'none';
        wrap.style.transform = 'translate(-50%,' + -dist + 'px) scaleY(1)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(0px)';
        // No clip-path here. The drop inside is a square rotated 135deg, so its corners reach
        // size*sqrt(2) -- 15.56px for an 11px drop -- while this wrapper's own box is only 11px.
        // An inset(0) clip trimmed 2.28px off every corner, and the corner pointing up is the
        // tip, which is what makes it read as a raindrop rather than a blob.
        void wrap.offsetHeight;
        wrap.style.transition = 'transform ' + this.heroFall + 's cubic-bezier(.36,.06,.29,.99), opacity .3s ease';
        wrap.style.transform = 'translate(-50%,0px) scaleY(1.45)';
        wrap.style.opacity = '1';

        this.pendingHero = impact;
        wrap.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'transform') landOnce();
        });
        this.heroTimer = setTimeout(landOnce, this.heroFall * 1000 + 120);
        this.timers.push(this.heroTimer);
      };

      // The whole hero in order: a beat of nothing, the white phrase writes itself, and only
      // once it has landed does the drop fall. Everything purple waits for the hit.
      const INTRO_PAUSE = 0.45;
      this.wait(() => {
        const d0 = wipe(0);
        this.wait(startFall, d0 * 1000);
      }, INTRO_PAUSE * 1000);

      // Clicking mid-fall lands it now rather than making anyone wait.
      document.getElementById('hero').addEventListener('click', e => {
        if (!this.pendingHero || e.target.closest('a')) return;
        landOnce();
      });
    };
    this.heroPlay = play;
    play();
  }

  // --- Work: one drop works its way down the list. It lands on each project in turn, and
  // each impact is what brings that project into being. ---
  initDrop() {
    const section = document.getElementById('work');
    const stage = document.getElementById('dropStage');
    const wash = document.getElementById('workWash');
    const list = document.getElementById('bands');
    if (!section || !stage) return;
    const bands = Array.prototype.slice.call(document.querySelectorAll('[data-band]'));

    const finishAll = () => {
      list.style.opacity = '1';
      wash.style.transition = 'clip-path 1.7s cubic-bezier(.19,1,.22,1)';
      wash.style.clipPath = 'circle(150% at 50% 0%)';
      bands.forEach(function (b) { b.style.opacity = '1'; b.style.clipPath = 'inset(0 0 0% 0)'; });
      stage.querySelector('[data-drop-wrap]').style.opacity = '0';
      this.stepQueue = null;
    };

    const play = () => {
      if (this.workRevealed) return;
      this.workRevealed = true;
      if (this.reduced) { finishAll(); return; }

      const wrap = stage.querySelector('[data-drop-wrap]');
      const flash = stage.querySelector('[data-flash]');
      // Measured against the section's own box: the bands' offsetParent is #bands, not the
      // section, so offsetTop alone would be measuring from the wrong origin.
      const sTop = section.getBoundingClientRect().top;
      const centreOf = b => Math.round(b.getBoundingClientRect().top - sTop + b.offsetHeight / 2);

      const land = (y, i) => {
        wrap.style.transition = 'transform .16s cubic-bezier(.22,.9,.3,1), opacity .14s ease-out .03s, filter .16s ease-out';
        wrap.style.transform = 'translate(-50%,' + (y + 4) + 'px) scale(2.3,0.06)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(1px)';

        flash.style.transition = 'none';
        flash.style.top = y + 'px';
        flash.style.transform = 'translate(-50%,-50%) scale(1)';
        flash.style.opacity = '1';
        void flash.offsetWidth;
        flash.style.transition = 'transform .34s cubic-bezier(.16,1,.3,1), opacity .32s ease-out';
        flash.style.transform = 'translate(-50%,-50%) scale(7)';
        flash.style.opacity = '0';

        this.ripples(stage, 2, 480, y);
        this.revealBand(bands[i]);
        if (i === 0) {
          list.style.opacity = '1';
          wash.style.transition = 'clip-path 1.9s cubic-bezier(.19,1,.22,1)';
          wash.style.clipPath = 'circle(150% at 50% 0%)';
        }
      };

      const steps = [];
      let from = -Math.round(window.innerHeight * 0.55);
      bands.forEach((b, i) => {
        const y = centreOf(b);
        steps.push({ y: y, from: from, dur: i === 0 ? this.fall : Math.max(0.34, this.fall * 0.42), i: i });
        from = y;
      });
      this.stepQueue = steps.slice();

      const run = idx => {
        if (idx >= steps.length) { this.stepQueue = null; return; }
        const st = steps[idx];
        wrap.style.transition = 'none';
        wrap.style.transform = 'translate(-50%,' + st.from + 'px) scaleY(1)';
        wrap.style.filter = 'blur(0px)';
        wrap.style.opacity = '0';
        void wrap.offsetHeight;
        wrap.style.transition = 'transform ' + st.dur + 's cubic-bezier(.36,.06,.29,.99), opacity .2s ease';
        wrap.style.transform = 'translate(-50%,' + st.y + 'px) scaleY(1.45)';
        wrap.style.opacity = '1';
        this.wait(() => {
          land(st.y, st.i);
          this.stepQueue = steps.slice(idx + 1);
          this.wait(() => run(idx + 1), 250);
        }, st.dur * 1000);
      };
      run(0);
    };

    this.workPlay = play;
    // Anchored to the first band, not the section: the section's top edge sits near the fold,
    // so a low threshold on it fires while the visitor is still reading the hero and the whole
    // sequence plays to an empty room. The scroll check backs the observer up for the case
    // where a band is taller than the viewport; both paths go through the same guard.
    this.observe(bands[0] || section, 0.45, play, null);
    // getBoundingClientRect() inside a scroll handler forces a synchronous layout, so the check
    // is deferred to a rAF and coalesced: a burst of scroll events measures once per frame
    // instead of once per event. The listener still detaches the moment the work has played.
    let queued = false;
    const check = () => {
      queued = false;
      if (this.workRevealed) { window.removeEventListener('scroll', this.onWorkScroll); return; }
      const r = (bands[0] || section).getBoundingClientRect();
      if (r.top < window.innerHeight * 0.8 && r.bottom > 0) play();
    };
    this.onWorkScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(check);
    };
    window.addEventListener('scroll', this.onWorkScroll, { passive: true });
    check();

    // Clicking anywhere in the section finishes the sequence rather than making anyone wait.
    section.addEventListener('click', e => {
      if (!this.stepQueue) return;
      e.preventDefault();
      this.timers.forEach(clearTimeout);
      this.timers = [];
      finishAll();
    }, true);
  }

  // Rings are flattened: a ripple on a surface you are looking across is an ellipse.
  //
  // Two of the five animated properties are gone. `filter` used to run blur(0) -> blur(5px)
  // across the whole 1.5s, which makes the compositor re-run a Gaussian over a ring up to 640px
  // wide on every frame, for two or three overlapping rings at once -- by a distance the most
  // expensive thing in the sequence, and on a phone the one that showed. It is a constant now:
  // the ring is drawn soft and dissolves by fading, which is what the eye was reading anyway
  // while the opacity ran to zero underneath the blur. `border-width` went the same way, since
  // 3.2px to 0.5px is not legible under a fade-out and every step of it forced another layout.
  // Width and height stay animated on purpose: they keep the stroke a constant weight at every
  // size and the ring crisp, which scaling a transform cannot do.
  ripples(container, count, max, atY) {
    const y = atY || 0;
    let d = 0;
    for (let i = 0; i < count; i++) {
      const ring = document.createElement('div');
      const j = function () { return 48 + Math.random() * 6; };
      // Each successive ring carries less of the impact: thinner, fainter, shorter reach.
      const strength = 1 - i * 0.26;
      const dur = 1.5 * (1 + i * 0.12);
      ring.style.cssText = 'position:absolute;top:' + y + 'px;left:0;z-index:2;width:0;height:0;border:' +
        (0.8 + 1.5 * strength).toFixed(2) + 'px solid var(--accent);transform:translate(-50%,-50%) scaleY(0.16);opacity:0;' +
        'filter:blur(2.2px);border-radius:' + j() + '% ' + j() + '% ' + j() + '% ' + j() + '%';
      ring.dataset.ring = '';
      container.appendChild(ring);
      this.wait(function () {
        ring.style.transition = 'width ' + dur + 's cubic-bezier(.16,1,.3,1), height ' + dur +
          's cubic-bezier(.16,1,.3,1), opacity ' + dur + 's ease-out';
        ring.style.opacity = (0.55 * strength).toFixed(2); void ring.offsetHeight;
        ring.style.width = ring.style.height = (max * (1 - i * 0.16) + Math.random() * (max * 0.1)) + 'px';
        ring.style.opacity = '0';
      }, d);
      this.wait(function () { ring.remove(); }, d + dur * 1000 + 120);
      d += 170;
    }
  }

  revealBand(b) {
    if (!b) return;
    b.style.opacity = '1';
    b.style.clipPath = 'inset(0 0 0% 0)';
    if (this.reduced) return;
    const row = b.querySelector('[data-row]');
    row.style.animation = 'none'; void row.offsetWidth;
    row.style.animation = 'bandFall 1.15s cubic-bezier(.22,1,.36,1)';
    // The project's own colour flares down its left edge as the front passes, then recedes.
    const edge = b.querySelector('[data-edge]');
    edge.style.transition = 'transform .42s cubic-bezier(.3,.9,.4,1)';
    edge.style.transformOrigin = 'top';
    edge.style.transform = 'scaleY(1)';
    this.wait(function () {
      edge.style.transition = 'transform .75s cubic-bezier(.19,1,.22,1)';
      edge.style.transformOrigin = 'bottom';
      edge.style.transform = 'scaleY(0)';
      setTimeout(function () { edge.style.transformOrigin = 'top'; }, 760);
    }, 430);
  }

  initBands() {
    Array.prototype.slice.call(document.querySelectorAll('[data-band]')).forEach(b => {
      b.style.opacity = '0';
      b.style.clipPath = 'inset(0 0 100% 0)';
      b.style.transition = 'opacity .5s ease, clip-path .95s cubic-bezier(.19,1,.22,1)';

      // Amun has no href while its page is unbuilt, so it gets no pointer response at all:
      // flooding the row and lifting the screenshot promised a destination that is not there.
      // It still takes the reveal above, and revealBand() still flares its edge.
      if (!b.getAttribute('href')) return;

      const rgb = BANDS[b.dataset.band].rgb;
      const flood = b.querySelector('[data-flood]');
      const edge = b.querySelector('[data-edge]');
      const shot = b.querySelector('[data-shot]');
      const img = shot.querySelector('img');
      const row = b.querySelector('[data-row]');

      const set = function (on) {
        flood.style.transform = 'scaleX(' + (on ? 1 : 0) + ')';
        edge.style.transform = 'scaleY(' + (on ? 1 : 0) + ')';
        shot.style.transform = on ? 'scale(1.07) translateY(-3px)' : 'scale(1)';
        shot.style.boxShadow = on
          ? '0 26px 60px -16px rgba(' + rgb + ',.45), 0 0 0 1px rgba(' + rgb + ',.4)'
          : '0 18px 44px -14px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)';
        img.style.filter = on ? 'saturate(1) brightness(1)' : 'saturate(.82) brightness(.86)';
        row.style.transform = on ? 'translateX(9px)' : 'translateX(0)';
      };
      // Mouse only where a pointer can actually leave. On a touchscreen mouseenter fires on tap
      // and no mouseleave ever answers it, so the flood, the row shift and the lifted screenshot
      // stayed on after the tap, and came back looking stuck on a back-navigation.
      if (window.matchMedia('(hover:hover)').matches) {
        b.addEventListener('mouseenter', function () { set(true); });
        b.addEventListener('mouseleave', function () { set(false); });
      }
      b.addEventListener('focus', function () { set(true); });
      b.addEventListener('blur', function () { set(false); });
    });
  }

  // The spine answers "where am I" without a fixed list of links taking up space.
  //
  // The scroll handler used to read scrollHeight and innerHeight on every scroll event, which
  // forces a synchronous layout in the middle of the scroll -- the one place it costs the most,
  // because it happens on every frame of a gesture that is asking to look smooth. Neither
  // number changes while scrolling, so both are cached and refreshed on resize, and the write
  // is deferred to a rAF so a burst of scroll events still only moves the dot once per frame.
  initSpine() {
    const spine = document.getElementById('spine');
    const dot = document.getElementById('spineDot');
    if (!spine || !dot) return;
    const wide = window.matchMedia('(min-width:1100px)');
    let max = 0, queued = false;

    const measure = function () {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const paint = function () {
      queued = false;
      if (!wide.matches) { spine.style.display = 'none'; return; }
      spine.style.display = 'block';
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      dot.style.top = 'calc(14vh + ' + (p * 72) + 'vh)';
    };
    const schedule = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', function () { measure(); schedule(); });
    // The bands and the case-study images land after this runs, so the page gets taller than it
    // was at init and the dot would otherwise reach the bottom early.
    window.addEventListener('load', function () { measure(); schedule(); });
    measure();
    paint();
  }

  initContact() {
    const pulse = document.getElementById('listenPulse');
    const section = document.getElementById('contact');
    if (!pulse || !section || this.reduced) return;
    this.observe(section, 0.2, function () { pulse.style.opacity = '1'; }, function () { pulse.style.opacity = '0'; });
  }

  initDropdown() {
    const det = document.querySelector('nav details');
    if (!det) return;
    const menu = det.querySelector('ul');
    const summary = det.querySelector('summary');
    const caret = summary && summary.querySelector('span');
    if (caret) caret.style.transition = 'transform .3s cubic-bezier(.19,1,.22,1)';

    det.addEventListener('toggle', function () {
      if (caret) caret.style.transform = det.open ? 'translateY(1px) rotate(180deg)' : 'translateY(1px)';
      if (!det.open) return;
      menu.style.transition = 'none';
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px) scale(.97)';
      void menu.offsetHeight;
      menu.style.transition = 'opacity .2s ease, transform .32s cubic-bezier(.19,1,.22,1)';
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0) scale(1)';
    });

    const close = function () { if (det.open) det.open = false; };
    // Pointerdown covers mouse, touch and pen, so tapping out closes it on every device.
    document.addEventListener('pointerdown', function (e) { if (det.open && !det.contains(e.target)) close(); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && det.open) { close(); summary.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    window.addEventListener('scroll', close, { passive: true });
  }

  // Arriving from a project page with #about or #contact: re-apply the jump once laid out.
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

  // A programmatic jump can be dragged to the wrong section's snap point mid-flight, so
  // snapping is lifted for the duration of the jump only.
  suspendSnap(restoreAfter) {
    const html = document.documentElement;
    html.style.scrollSnapType = 'none';
    clearTimeout(this.snapTimer);
    this.snapTimer = setTimeout(function () { html.style.scrollSnapType = ''; }, restoreAfter || 260);
  }

  // KD in the nav returns the page to its opening state and replays every reveal.
  resetAll() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.stepQueue = null;
    window.scrollTo({ top: 0, behavior: 'instant' });

    const ghost = document.getElementById('heroGhost');
    if (ghost) ghost.style.opacity = '0';
    document.querySelectorAll('#heroHeadline [data-line]').forEach(function (l) {
      l.style.transition = 'none';
      l.style.opacity = '0';
      l.style.setProperty('--reveal', '-26%');
      l.style.transitionDelay = '0s';
      void l.offsetWidth;
      l.style.transition = 'opacity .15s ease, --reveal 2s linear';
    });
    const wl = document.getElementById('waterline');
    const rf = document.getElementById('reflection');
    if (wl) { wl.style.transition = 'none'; wl.style.opacity = '0'; wl.style.transform = 'scaleX(0)'; void wl.offsetWidth; wl.style.transition = 'opacity .5s ease, transform 1.5s cubic-bezier(.19,1,.22,1)'; }
    if (rf) {
      rf.style.animation = 'none';
      rf.querySelectorAll('[data-refl]').forEach(function (el) {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.setProperty('--reveal', '-26%');
        el.style.transitionDelay = '0s';
        void el.offsetWidth;
        el.style.transition = 'opacity .14s ease, --reveal 2s linear';
      });
    }
    document.querySelectorAll('#heroDropStage [data-ring]').forEach(function (r) { r.remove(); });
    this.heroPlayed = false;

    this.workRevealed = false;
    document.getElementById('bands').style.opacity = '0';
    const wash = document.getElementById('workWash');
    wash.style.transition = 'none';
    wash.style.clipPath = 'circle(0% at 50% 0%)';
    void wash.offsetWidth;
    document.querySelectorAll('[data-band]').forEach(function (b) {
      b.style.opacity = '0';
      b.style.clipPath = 'inset(0 0 100% 0)';
      b.querySelector('[data-row]').style.animation = 'none';
      b.querySelector('[data-edge]').style.transform = 'scaleY(0)';
    });
    const wrap = document.querySelector('#dropStage [data-drop-wrap]');
    wrap.style.transition = 'none';
    wrap.style.opacity = '0';
    wrap.style.filter = 'blur(0px)';
    document.querySelectorAll('#dropStage [data-ring]').forEach(function (r) { r.remove(); });

    const pulse = document.getElementById('listenPulse');
    if (pulse) pulse.style.opacity = '0';

    this.wait(() => {
      if (this.heroPlay) this.heroPlay();
      window.addEventListener('scroll', this.onWorkScroll, { passive: true });
    }, 60);
  }

  initAnchors() {
    const brand = document.querySelector('nav a[aria-label^="Kristian Davis"]');
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

document.addEventListener('DOMContentLoaded', function () {
  window.portfolio = new Portfolio();
  window.portfolio.init();
});
