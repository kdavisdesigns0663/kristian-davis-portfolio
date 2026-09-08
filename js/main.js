const BANDS = {
  nitefind:   { rgb:'160,107,255' },
  smiteforge: { rgb:'224,184,74' },
  zentra:     { rgb:'79,191,130' },
  amun:       { rgb:'143,143,143' },
};

class Portfolio {
  init() {
    this.timers = [];
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // WebKit -- Safari, and every browser on iOS -- parses `mask: url(#id)` and then does not
    // resolve a reference to an inline SVG <mask> on an HTML element. CSS.supports() reports
    // true for it, so the vendor string is the only honest test. Where it is true the ripple
    // runs off a radial-gradient front instead (rippleRevealGradient).
    this.noSvgMask = /apple/i.test(navigator.vendor || '');
    // One pace for both drops: the work drop derives its fall speed from heroFall (see
    // initDrop), so there is no second constant to keep in step with this one.
    this.heroFall = 2.9;
    this.initHero();
    // Bands are put into their hidden state BEFORE the drop is wired: the reverse order lets
    // a fast observer reveal a band and then have initBands reset it to invisible.
    this.initBands();
    this.initDrop();
    this.initSpine();
    this.initContact();
    this.initDropdown();
    this.initMobileNav();
    this.initNavReveal();
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
    const pool = document.getElementById('heroPool');
    const stage = document.getElementById('heroDropStage');
    if (!lines.length || !stage) return;

    // The hit sits 7% along the divider, not at its left end: that is where the line's bright
    // core is born and where the reflected light pools out of.
    const surface = document.getElementById('surface');
    const seatStage = function () {
      if (!line || !surface) return;
      stage.style.left = Math.round(line.offsetLeft + line.offsetWidth * 0.07) + 'px';
    };
    seatStage();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(seatStage);
    window.addEventListener('resize', seatStage);

    // Each phrase is revealed on its own cue: a constant pace in ems, so a long phrase and a
    // short one read as the same gesture. The pace is deliberately slow -- the mask creeps
    // across the words the way water spreads, and the cues overlap so the sequence never
    // resolves into separate steps.
    const EM_PER_SEC = 4.1;
    const durOf = function (i) {
      const l = lines[i];
      if (!l) return 0;
      const em = parseFloat(getComputedStyle(l).fontSize) || 16;
      return l.getBoundingClientRect().width / (em * EM_PER_SEC);
    };

    // Whether a segment continues the visual line the one before it is on. Measured, not read
    // off the markup: "People don't experience" and "your design." are two elements at every
    // width, but above 900px they share a line box and read as one line, and below it the
    // <br data-mob> puts them on separate rows. The eye follows rows, so the sweep has to.
    const sameRowAsPrev = function (i) {
      if (i <= 0) return false;
      const a = lines[i - 1].getBoundingClientRect();
      const b = lines[i].getBoundingClientRect();
      return Math.abs(a.top - b.top) < Math.min(a.height, b.height) * 0.5;
    };

    const wipe = function (i) {
      const l = lines[i];
      if (!l) return 0;
      const dur = durOf(i);
      l.style.transitionDelay = '0s';
      l.style.transitionTimingFunction = 'ease, linear';
      // A segment continuing a line is already mid-sweep the moment it starts, and preLight()
      // has already brought it up, so there is no opacity ramp left to run -- only the front
      // moves. Given a new line's .66s ramp instead, the join picked up a brightness step in
      // the middle of what should be one unbroken front.
      l.style.transitionDuration = (sameRowAsPrev(i) ? '0.001s, ' : '0.66s, ') + dur + 's';
      l.style.opacity = '1';
      l.style.setProperty('--reveal', '100%');
      return dur;
    };


    // The wavefront lights the last glyph before --reveal reaches 100%: the mask feathers 1.6em
    // ahead of the front, so the tail of each transition is empty travel. The next line is cued
    // when the front clears the last glyph, not when the transition ends -- that empty tail is
    // what read as a pause between lines.
    const FEATHER_EM = 1.6;
    const litAt = function (i) {
      const l = lines[i];
      if (!l) return 0;
      const em = parseFloat(getComputedStyle(l).fontSize) || 16;
      const w = l.getBoundingClientRect().width || 1;
      return durOf(i) * Math.max(0.4, 1 - (FEATHER_EM * em) / w);
    };

    // How long the front's soft edge takes to cross a segment. The mask feathers 1.6em ahead of
    // the hard front, and a mask cannot spill past the element it is on, so over the last 1.6em
    // of a segment that feather is progressively clipped by the box and the edge hardens.
    const featherTime = i => Math.max(0, durOf(i) - litAt(i));

    // Lighting a continuation segment before its own cue is what keeps the join invisible. The
    // segment sits at --reveal:0%, which is not "nothing": the mask is opaque at x=0 and fades
    // out over the next 1.6em, so its resting state IS the leading edge of the front. Fading it
    // up across exactly the window in which the previous segment is losing its feather hands the
    // soft edge from one element to the next. Without it the boundary snapped from a nearly hard
    // edge to a full 1.6em feather inside a single frame, which is visible at 60px type.
    const preLight = function (i) {
      const l = lines[i];
      if (!l || !sameRowAsPrev(i)) return;
      const lead = featherTime(i - 1);
      l.style.transitionDuration = lead.toFixed(3) + 's, 2s';
      l.style.transitionTimingFunction = 'linear, linear';
      l.style.opacity = '1';
    };

    const play = () => {
      if (this.heroPlayed) return;
      this.heroPlayed = true;
      if (ghost) ghost.style.opacity = '0.55';

      if (this.reduced) {
        // iOS sets prefers-reduced-motion for Low Power Mode as well as for Reduce Motion, so a
        // phone on a low battery lands here with no way to tell the two apart. This used to snap
        // the entire hero to its finished state, which read as the intro being broken rather than
        // as a preference being honoured -- and it is the same failure the email glow had.
        // The sequence still runs; it just runs in opacity alone. Nothing falls, spreads,
        // displaces or travels: the drop, the ripples, the pool bloom and the cascade are all
        // still skipped, and the lines are already at --reveal:100% so no wavefront crosses them.
        // The fades are Web Animations rather than transitions on purpose -- the global rule in
        // style.css collapses every transition-duration to .01ms, so a transition here would
        // snap and we would be back where we started.
        const STEP = 430;
        const fade = function (el, delay, dur) {
          if (!el) return;
          if (!el.animate) { el.style.opacity = '1'; return; }
          el.style.opacity = '0';
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: dur || 520, delay: delay, easing: 'ease', fill: 'forwards'
          });
        };
        lines.forEach(function (l, i) { l.style.setProperty('--reveal', '100%'); fade(l, 180 + i * STEP); });
        const afterLines = 180 + lines.length * STEP;
        // scaleX is set outright, not animated: a line drawing itself across the page is travel.
        if (line) { line.style.transform = 'scaleX(1)'; fade(line, afterLines, 420); }
        if (pool) {
          const lightRest = pool.querySelector('[data-pool-light]');
          if (lightRest) { lightRest.style.transform = 'none'; lightRest.style.opacity = '.6'; }
          fade(pool, afterLines + 120, 640);
        }
        this.wait(() => {
          this.heroHandoff(lines[lines.length - 1], pool);
          fade(document.querySelector('#heroSub p'), 0, 620);
        }, afterLines + 300);
        return;
      }

      const wrap = stage.querySelector('[data-drop-wrap]');
      const flash = stage.querySelector('[data-flash]');

      const impact = () => {
        // Flattens into the surface and is gone in about a sixth of a second, at the same
        // moment the first ring is born.
        wrap.style.transition = 'transform .34s cubic-bezier(.3,.7,.3,1), opacity .3s ease-out .06s, filter .34s ease-out';
        wrap.style.transform = 'translate(-50%,4px) scale(2.4,0.06)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(1px)';
        flash.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .74s ease-out';
        flash.style.opacity = '1'; void flash.offsetWidth;
        flash.style.transform = 'translate(-50%,-50%) scale(9)';
        flash.style.opacity = '0';

        // The line is born AT the hit and spreads out of it in both directions. Layout geometry,
        // not the bounding rect: the line is still at scaleX(0) here, so its rect has no width.
        // The gradient's bright core is moved onto the impact too -- the stock gradient is
        // brightest at the element's own left edge, so however the box was scaled the visual
        // weight sat at x=0 and it read as sweeping in from the left.
        const lw = line.offsetWidth;
        const ox = Math.max(0, Math.min(lw, stage.offsetLeft - line.offsetLeft));
        const pct = lw ? (ox / lw) * 100 : 0;
        const stop = v => Math.max(0, Math.min(100, v)).toFixed(1) + '%';
        line.style.background =
          'linear-gradient(90deg,' +
          ' transparent ' + stop(pct - 30) + ',' +
          ' rgba(var(--accent-rgb),.55) ' + stop(pct - 11) + ',' +
          ' rgba(var(--accent-rgb),1) ' + stop(pct) + ',' +
          ' rgba(var(--accent-rgb),.34) ' + stop(pct + 28) + ',' +
          ' transparent ' + stop(pct + 60) + ')';
        line.style.transformOrigin = ox.toFixed(1) + 'px 50%';
        line.style.transition = 'opacity .6s ease, transform 2.2s cubic-bezier(.14,.8,.16,1)';
        line.style.opacity = '1';
        line.style.transform = 'scaleX(1)';
        this.ripples(stage, 4, 660, 0, 1.8);
        // The payoff arrives with the impact, not before it. Indexed off lines.length, not
        // hardcoded: the headline was four spans when this was written and is three now.
        const payoff = wipe(lines.length - 1);
        // Once the payoff has finished writing, it steps back and the light moves onto the sub
        // copy -- the sequence reads decisions, then what the decisions are for.
        this.wait(() => this.heroHandoff(lines[lines.length - 1], pool), payoff * 1000 + 620);
        // The impact spreads light across the surface: see poolBloom.
        this.poolBloom(pool);
      };

      const drop = () => {
        const dist = Math.round(window.innerHeight * 0.6);
        wrap.style.transition = 'none';
        wrap.style.transform = 'translate(-50%,' + -dist + 'px) scaleY(1)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(0px)';
        void wrap.offsetHeight;
        wrap.style.transition = 'transform ' + this.heroFall + 's cubic-bezier(.42,.05,.34,1), opacity .6s ease';
        wrap.style.transform = 'translate(-50%,0px) scaleY(1.45)';
        wrap.style.opacity = '1';

        this.pendingHero = impact;
        this.heroTimer = setTimeout(() => { this.pendingHero = null; impact(); }, this.heroFall * 1000 + 200);
        this.timers.push(this.heroTimer);
      };

      // One sweep, top to bottom. Each line is cued the moment the front above it clears its
      // last glyph, minus a small overlap, so the wavefront never stops travelling. The drop is
      // released early enough that its impact lands exactly on the last line's cue.
      const OVERLAP = 90;
      // "People don't experience your design." is a complete sentence; the second one starts on
      // the next line. The wavefront holds at that boundary instead of overlapping into it, so
      // the two statements land as two statements.
      const SENTENCE_PAUSE = 420;
      // Which cue the hold falls on is read off the markup: [data-sentence-end] marks the last
      // segment of "...your design.", so re-breaking the headline moves the pause with it.
      const endIdx = lines.findIndex(function (l) { return l.hasAttribute('data-sentence-end'); });
      const pauseAt = endIdx < 0 ? 1 : endIdx + 1;
      seatStage();
      // Driven by how many lines there actually are. This was a hardcoded run of four, so
      // merging "People don't experience" and "your design." into one line left the last cue
      // pointing past the end of the list and the drop scheduled against a cue that no longer
      // existed. Nothing here needs editing again if the headline is re-broken.
      const last = lines.length - 1;
      const at = [850];
      for (let i = 1; i <= last; i++) {
        if (sameRowAsPrev(i)) {
          // Continuing the same visual line, so the join has to be exact: the next segment
          // starts as the front leaves the previous one, timed on the front itself (durOf) and
          // not on when its last glyph lit (litAt). Neither the 90ms overlap nor the sentence
          // pause belongs here -- both are written for a front moving to a NEW row, and on a
          // shared row an overlap puts a second front on a line that already has one. That is
          // what made "your design." light up while "People don't experience" was still being
          // written, with a gap between them: two fronts on one line, not one crossing it.
          // The pace is em/sec and the font size is shared, so the front speed carries over
          // the join unchanged and the two segments read as one sweep.
          at[i] = at[i - 1] + durOf(i - 1) * 1000;
        } else {
          at[i] = at[i - 1] + Math.max(0, litAt(i - 1) * 1000 + (i === pauseAt ? SENTENCE_PAUSE : -OVERLAP));
        }
      }
      // The impact is the one cue that does NOT overlap: the hit has to land as the word above
      // it ("...your") finishes, so the last cue runs off the full sweep of the line before it
      // plus a short beat, rather than starting 90ms early like the lines in the middle do.
      at[last] = at[last - 1] + durOf(last - 1) * 1000 + 110;
      for (let i = 0; i < last; i++) {
        const idx = i;
        // The stage is re-seated on the cue before the impact, when the layout above the
        // waterline has stopped moving.
        this.wait(function () { if (idx === last - 1) seatStage(); wipe(idx); }, at[idx]);
        // A continuation is brought up across the window in which the segment before it is
        // losing its feather, so the soft edge is handed over rather than re-created.
        if (sameRowAsPrev(idx)) {
          this.wait(function () { preLight(idx); }, Math.max(0, at[idx] - featherTime(idx - 1) * 1000));
        }
      }
      // The payoff is written by impact(), so if it continues a line its pre-light has to be
      // scheduled here rather than in the loop above, which stops short of it.
      if (sameRowAsPrev(last)) {
        this.wait(function () { preLight(last); }, Math.max(0, at[last] - featherTime(last - 1) * 1000));
      }
      // impact() writes the last line, so the fall is scheduled backwards from its cue.
      this.wait(drop, Math.max(0, at[last] - this.heroFall * 1000 - 200));

      // Clicking mid-fall lands it now rather than making anyone wait.
      document.getElementById('hero').addEventListener('click', e => {
        if (!this.pendingHero || e.target.closest('a')) return;
        clearTimeout(this.heroTimer);
        const fn = this.pendingHero;
        this.pendingHero = null;
        fn();
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
      bands.forEach(function (b) {
        b.dataset.landed = '1';
        b.style.opacity = '1';
        b.style.clipPath = 'inset(0 0 0% 0)';
      });
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
        // The same impact as the hero's, at the same durations. This used to flatten in .16s and
        // flash in .34s against the hero's .34s and .8s, which is most of why the work section
        // read as a faster, lighter animation on a page whose opening is deliberately slow.
        wrap.style.transition = 'transform .34s cubic-bezier(.3,.7,.3,1), opacity .3s ease-out .06s, filter .34s ease-out';
        wrap.style.transform = 'translate(-50%,' + (y + 4) + 'px) scale(2.4,0.06)';
        wrap.style.opacity = '0';
        wrap.style.filter = 'blur(1px)';

        flash.style.transition = 'none';
        flash.style.top = y + 'px';
        flash.style.transform = 'translate(-50%,-50%) scale(1)';
        flash.style.opacity = '1';
        void flash.offsetWidth;
        flash.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .74s ease-out';
        flash.style.transform = 'translate(-50%,-50%) scale(9)';
        flash.style.opacity = '0';

        // Two rings reaching 480px at single speed read as a click, not as something landing in
        // water. The hero's set is four at 660 and 1.8x slower; the first hit here is that hit
        // exactly. The drop has spent some of itself by the time it reaches the bands below, so
        // those get one ring fewer and less reach, and the whole set tightens on the same curve
        // as the falls -- rings that still took 2.7s to spread while bands were landing every
        // 0.6s would pile up on each other instead of reading as one hit after another.
        const t = tempoAt(i);
        this.ripples(stage, i === 0 ? 4 : 3, i === 0 ? 660 : 570, y, (i === 0 ? 1.8 : 1.65) * t);
        this.revealBand(bands[i], t);
        if (i === 0) {
          list.style.opacity = '1';
          wash.style.transition = 'clip-path 1.9s cubic-bezier(.19,1,.22,1)';
          wash.style.clipPath = 'circle(150% at 50% 0%)';
        }
      };

      // The page gets quicker as you go down it. The hero is the slowest thing on the site on
      // purpose: it is the introduction and it has the visitor's whole attention. By the work
      // section they are scrolling rather than watching, so the drop enters faster than the hero
      // falls and then gains on every band -- the first project lands deliberately, the last one
      // snaps in, and the section as a whole accelerates under you.
      //
      // Running the work drop at the hero's exact fall speed was tried on 2026-09-05 and reverted
      // the same day. It was consistent and it was wrong: the sequence took 11.5s with the last
      // band at 11.2s, and the section sat empty long enough to read as broken rather than as
      // slow. Speed is not the thing that carries across the page; the impact, the easing and the
      // ring set are, and those still match the hero exactly. Only the clock is different.
      const ENTRY = 1.15;   // the fall into the first band, whatever distance it has to cover
      const GAIN = 0.76;    // each fall after it, and its beat and its rings, against the last
      const FLOOR = 0.34;
      const tempoAt = i => Math.pow(GAIN, i);

      // Where the drop enters. 0.6vh above the first band is the hero's own distance, but the
      // section is only part-scrolled when this fires, so that point is often still on screen --
      // measured at 1440x900 it sat 259px down the viewport, and the drop appeared out of nothing
      // in mid-air instead of falling in. Whichever is higher wins: that, or just above the
      // viewport's top edge. The entrance is timed rather than paced for the same reason the
      // sequence is not speed-matched: how far the drop has to fall to get on screen is an
      // accident of where the visitor stopped scrolling, and it should not set how long they wait
      // to see the first project.
      const steps = [];
      let from = Math.min(centreOf(bands[0]) - Math.round(window.innerHeight * 0.6),
                          -Math.round(sTop) - 60);
      bands.forEach((b, i) => {
        const y = centreOf(b);
        steps.push({ y: y, from: from, dur: Math.max(FLOOR, ENTRY * tempoAt(i)), i: i });
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
        // The hero's fall curve, not a near-copy of it: .36,.06,.29,.99 and .42,.05,.34,1 are
        // close enough to look like a typo and far enough apart to feel like a different weight.
        wrap.style.transition = 'transform ' + st.dur + 's cubic-bezier(.42,.05,.34,1), opacity .6s ease';
        wrap.style.transform = 'translate(-50%,' + st.y + 'px) scaleY(1.45)';
        wrap.style.opacity = '1';
        this.wait(() => {
          land(st.y, st.i);
          this.stepQueue = steps.slice(idx + 1);
          // The beat rides the same curve as everything else, so the sequence tightens as a whole
          // rather than speeding up while still pausing the same length between hits.
          this.wait(() => run(idx + 1), Math.round(320 * tempoAt(idx)));
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
    // is coalesced into a rAF: a burst of scroll events measures once per frame, not once per
    // event. The listener still detaches the moment the work has played.
    let queuedWork = false;
    const check = () => {
      queuedWork = false;
      if (!this.workRevealed) {
        const r = (bands[0] || section).getBoundingClientRect();
        if (r.top < window.innerHeight * 0.8 && r.bottom > 0) play();
        return;
      }
      // The sequence runs at the hero's fall speed now, which is slow enough to be outrun: at
      // 1440x900 the last band lands 11.2s in, and a visitor scrolling briskly would reach rows
      // the drop has not got to yet and find them blank. Any band already scrolled past is
      // revealed where it stands; the drop carries on to the ones below, and revealBand marks the
      // band so its arrival does not replay the settle a second time.
      if (!this.stepQueue) { window.removeEventListener('scroll', this.onWorkScroll); return; }
      const mid = window.innerHeight * 0.5;
      bands.forEach(b => { if (b.getBoundingClientRect().bottom < mid) this.revealBand(b); });
    };
    this.onWorkScroll = () => { if (queuedWork) return; queuedWork = true; requestAnimationFrame(check); };
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

  // The handoff. "decisions." has landed and been read; it steps back to about two thirds of
  // its brightness, the pool under the divider settles further, and a violet wash comes up
  // behind the sub copy, which lifts a few percent. Nothing moves -- only where the light is.
  // Drives one ripple front: the disc inside an SVG mask grows out of the impact side while the
  // fractal turbulence displacing its edge is re-seeded every frame and its scale decays. That
  // is where the noise lives -- the boundary crawls and breaks up as it travels, and the type it
  // uncovers is never touched. Deceleration is in the easing, energy loss in the displacement.
  // Geometry shared by both fronts, so the SVG path and the gradient path spread identically.
  // Everything is returned in ems, not pixels: the payoff word is 64px on a desktop and 29px on
  // a phone, so a front described in fixed pixels is a different gesture at each end -- a 38px
  // feather is half a line up here and most of a line down there. That is most of why the ripple
  // read as one animation on a desktop and another thing entirely on a phone.
  rippleFront(el, cxPct, cyPct) {
    const box = el.getBoundingClientRect();
    const cx = box.width * cxPct;
    const cy = box.height * cyPct;
    return {
      cx: cx, cy: cy,
      em: parseFloat(getComputedStyle(el).fontSize) || 16,
      reach: Math.hypot(Math.max(cx, box.width - cx), Math.max(cy, box.height - cy)) + 48
    };
  }

  // A spreading front decelerates, but the cubic ease-out this used to run left at three times
  // its average speed and then crawled for most of the duration: a lurch, then a stall, which is
  // what read as rough rather than fluid. Quadratic leaves at twice and is still travelling when
  // it arrives, which is much closer to how a disturbance actually crosses water.
  rippleEase(t) { return 1 - Math.pow(1 - t, 2.05); }

  // Same front, same clock, no SVG. The disc is cut out of a radial-gradient mask whose feather
  // stays soft the whole way across -- a narrowing feather hardens the edge as it travels, which
  // is the opposite of what a wave does. Five stops rather than three: a single .6 midpoint put a
  // visible band in the falloff, and on a phone that band was the most legible part of the effect.
  rippleRevealGradient(el, cxPct, cyPct, dur, em0, em1) {
    const f = this.rippleFront(el, cxPct, cyPct);
    el.style.opacity = '1';
    const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const rad = this.rippleEase(t) * f.reach;
      const fe = Math.max(6, (em0 + (em1 - em0) * t) * f.em);
      const px = n => n.toFixed(1) + 'px';
      this.setMask(el, 'radial-gradient(circle ' + px(rad + fe) + ' at ' + px(f.cx) + ' ' + px(f.cy) +
        ', #000 0px' +
        ', #000 ' + px(Math.max(0, rad - fe * 1.15)) +
        ', rgba(0,0,0,.88) ' + px(Math.max(0, rad - fe * 0.72)) +
        ', rgba(0,0,0,.58) ' + px(Math.max(0, rad - fe * 0.34)) +
        ', rgba(0,0,0,.24) ' + px(rad) +
        ', rgba(0,0,0,.06) ' + px(rad + fe * 0.55) +
        ', transparent ' + px(rad + fe) + ')');
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  rippleReveal(el, maskIds, filterId, cxPct, cyPct, dur, em0, em1) {
    if (this.noSvgMask) { this.rippleRevealGradient(el, cxPct, cyPct, dur, em0, em1); return; }
    el.style.opacity = '1';
    const f = this.rippleFront(el, cxPct, cyPct);
    const fronts = [];
    maskIds.forEach(function (id) {
      const mask = document.getElementById(id);
      if (!mask) return;
      mask.querySelectorAll('circle').forEach(function (c) {
        c.setAttribute('cx', f.cx);
        c.setAttribute('cy', f.cy);
        fronts.push({ c: c, inner: c.hasAttribute('data-front-inner') });
      });
    });
    const filter = document.getElementById(filterId);
    const disp = filter && filter.querySelector('[data-disp]');
    const turb = filter && filter.querySelector('[data-turb]');
    const blur = filter && filter.querySelector('feGaussianBlur');
    if (!fronts.length) return;
    // The authored stdDeviation is in pixels like everything else was, so it softened a phone's
    // edge four times as much, relative to the type, as a desktop's. Tie it to the em too.
    if (blur) blur.setAttribute('stdDeviation', (0.13 * f.em).toFixed(2));
    // The authored frequency is cached on first run and drifted from that, never from the live
    // attribute: the run leaves it lowered, so reading it back would make every replay start
    // slacker than the last.
    if (turb && !turb.dataset.bf0) turb.dataset.bf0 = turb.getAttribute('baseFrequency') || '0.018 0.052';
    const bf = ((turb && turb.dataset.bf0) || '0.018 0.052').split(/\s+/).map(parseFloat);

    const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const rad = this.rippleEase(t) * f.reach;
      fronts.forEach(function (fr) {
        // The trailing edge of the blurred band closes up to the front by the end, so no
        // annulus of the soft copy is left showing under the sharp layer.
        const lag = 0.9 * f.em * (1 - Math.pow(t, 2));
        fr.c.setAttribute('r', Math.max(0, fr.inner ? rad - lag : rad).toFixed(1));
      });
      if (disp) disp.setAttribute('scale', ((em0 + (em1 - em0) * t) * f.em).toFixed(2));
      // The seed is held. feTurbulence regenerates its entire noise field on every integer seed,
      // so advancing it ~120 times across the run replaced the distortion every couple of frames:
      // that is static, not water, and it is what made the edge boil. One field, pushed harder or
      // softer by the decaying displacement and drifting slowly in frequency, moves the way a
      // disturbed surface does -- the shape stays coherent while the energy leaves it.
      if (turb) {
        turb.setAttribute('baseFrequency',
          (bf[0] * (1 - 0.26 * t)).toFixed(5) + ' ' + ((bf[1] || bf[0]) * (1 - 0.32 * t)).toFixed(5));
      }
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Both spellings, always. WebKit reads the prefixed property for a mask that points at an
  // inline SVG <mask>; the unprefixed one is what Firefox reads. The package set only `mask:`,
  // and the elements it set it on are hidden until the mask fills -- so on an engine that
  // ignored it, the hero's sub copy was a paragraph left at opacity 0 with nothing to reveal it.
  setMask(el, value) {
    el.style.mask = value;
    el.style.webkitMask = value;
    el.style.webkitMaskImage = value === 'none' ? 'none' : value;
  }

  heroHandoff(word, pool) {
    const white = word && word.querySelector('[data-cascade]');
    const edge = word && word.querySelector('[data-cascade-edge]');
    const p = document.querySelector('#heroSub p');
    if (this.reduced) {
      // No ripple for reduced motion: the end state, applied at once. The masks are dropped
      // rather than filled, so nothing depends on a frame loop having run.
      if (white) { this.setMask(white, 'none'); white.style.opacity = '1'; }
      if (edge) edge.style.display = 'none';
      if (p) { p.style.opacity = '1'; this.setMask(p, 'none'); }
      return;
    }
    // The word takes the strongest disturbance: it is closest to the impact. Its sharp layer and
    // the blurred band riding behind it share one front, so the edge is soft while it passes and
    // crisp once it has. The divider keeps its purple -- the colour is moving down, not leaving.
    if (edge && this.noSvgMask) edge.style.display = 'none';
    // Durations are the ripple's own, deliberately longer than the wipe that precedes it: the
    // wipe is writing and wants a reading pace, the ripple is water crossing a surface and wants
    // to be watched. Slowing the front was the fix for "too rough" alongside the easing and the
    // held seed -- the wipe (EM_PER_SEC) is untouched.
    const WORD_MS = 3800, SUB_MS = 4400;
    if (white) {
      // Displacement and feather in ems, so the front is the same gesture at 29px as at 64px.
      this.rippleReveal(white, ['rippleWord', 'rippleWordEdge'], 'rippleEdge', 0.5, 0, WORD_MS, 0.63, 0.20);
      // The front reaches the far corner at `reach`, and the mask has done its job by then.
      // Dropping it is also the backstop: rippleReveal bails early if the <mask> is missing,
      // and a mask an engine cannot resolve hides the element instead of revealing it, so
      // nothing here may leave content depending on a frame loop that might not have run.
      this.wait(function () { if (edge) edge.style.display = 'none'; }, WORD_MS);
      this.wait(() => this.setMask(white, 'none'), WORD_MS + 60);
    }
    // Most of the energy is gone by the time the wave reaches the sub copy: a wider, gentler
    // noise and a slower front. It was masked out entirely until now and arrives in purple --
    // the colour the word just gave up.
    this.wait(() => {
      if (!p) return;
      p.style.opacity = '1';
      this.rippleReveal(p, ['rippleSub'], 'rippleEdgeSoft', 0.26, -0.10, SUB_MS, 1.75, 0.62);
      this.wait(() => this.setMask(p, 'none'), SUB_MS + 60);
    }, 1150);
    const light = pool && pool.querySelector('[data-pool-light]');
    if (light && light.animate) {
      light.animate([{ opacity: .6 }, { opacity: .4 }], { duration: 1400, easing: 'ease', fill: 'forwards' });
    }
  }

  // Energy from the hit spreading across a wet surface, then settling. The light is scaled out
  // of the impact point (transform-origin:left center), overshoots slightly in brightness and
  // rests at 60% of its peak -- it never fades away, so the sub copy keeps sitting inside a
  // faint violet atmosphere. The shallow ring is the impact itself: it expands mostly sideways,
  // because the surface is being viewed nearly edge-on.
  poolBloom(pool) {
    if (!pool) return;
    pool.style.opacity = '1';
    const light = pool.querySelector('[data-pool-light]');
    const ring = pool.querySelector('[data-pool-ripple]');
    const EASE = 'cubic-bezier(.16,1,.3,1)';

    if (light && light.animate) {
      light.animate([
        { offset: 0,    transform: 'scaleX(.05)', opacity: 0,   easing: EASE },
        { offset: 0.13, transform: 'scaleX(.17)', opacity: .72, easing: EASE },
        { offset: 0.39, transform: 'scaleX(.68)', opacity: .95, easing: EASE },
        { offset: 0.72, transform: 'scaleX(.97)', opacity: 1,   easing: 'ease-out' },
        { offset: 1,    transform: 'none',        opacity: .6 }
      ], { duration: 1800, fill: 'forwards' });
    } else if (light) {
      light.style.transform = 'none';
      light.style.opacity = '.6';
    }

    if (ring && ring.animate) {
      const w = Math.max(110, Math.min(150, pool.offsetWidth * 0.24));
      ring.animate([
        { offset: 0,    width: '10px', height: '2px',  opacity: .2 },
        { offset: 0.28, opacity: .28 },
        { offset: 1,    width: w.toFixed(0) + 'px', height: '17px', opacity: 0 }
      ], { duration: 950, easing: EASE, fill: 'none' });
    }
  }

  // Rings are flattened: a ripple on a surface you are looking across is an ellipse.
  ripples(container, count, max, atY, slow) {
    const y = atY || 0;
    const s = slow || 1;
    let d = 0;
    for (let i = 0; i < count; i++) {
      const ring = document.createElement('div');
      const j = function () { return 48 + Math.random() * 6; };
      // Each successive ring carries less of the impact: thinner, fainter, shorter reach.
      const strength = 1 - i * 0.26;
      const dur = 1.5 * s * (1 + i * 0.12);
      // `filter` used to run blur(0) -> blur(5px) across the whole life of the ring, which makes
      // the compositor re-run a Gaussian over a ring up to 640px wide on every frame, for two or
      // three overlapping rings at once. By a distance the most expensive thing in the sequence,
      // and on a phone the one that showed. It is a constant now: the ring is drawn soft and
      // dissolves by fading, which is what the eye was reading anyway while the opacity ran to
      // zero underneath the blur. `border-width` went the same way -- 3.2px to 0.5px is not
      // legible under a fade-out and every step of it forced another layout. Width and height
      // stay animated on purpose: they keep the stroke a constant weight at every size.
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
      d += 170 * s;
    }
  }

  // `t` is the work sequence's tempo at this band, 1 for the first and smaller for each one
  // after. The settle and the edge flare ride it too, so a band that lands quickly also settles
  // quickly -- otherwise the drop accelerates away and leaves the same slow settle behind it,
  // which reads as the animation lagging rather than as the page picking up. The scroll catch-up
  // calls this with no tempo, and a band the visitor has already scrolled past gets the full one.
  revealBand(b, t) {
    if (!b || b.dataset.landed) return;
    b.dataset.landed = '1';
    b.style.opacity = '1';
    b.style.clipPath = 'inset(0 0 0% 0)';
    if (this.reduced) return;
    const k = t || 1;
    const row = b.querySelector('[data-row]');
    row.style.animation = 'none'; void row.offsetWidth;
    row.style.animation = 'bandFall ' + (1.15 * k).toFixed(2) + 's cubic-bezier(.22,1,.36,1)';
    // The project's own colour flares down its left edge as the front passes, then recedes.
    const edge = b.querySelector('[data-edge]');
    edge.style.transition = 'transform ' + (0.42 * k).toFixed(2) + 's cubic-bezier(.3,.9,.4,1)';
    edge.style.transformOrigin = 'top';
    edge.style.transform = 'scaleY(1)';
    this.wait(function () {
      const back = 0.75 * k;
      edge.style.transition = 'transform ' + back.toFixed(2) + 's cubic-bezier(.19,1,.22,1)';
      edge.style.transformOrigin = 'bottom';
      edge.style.transform = 'scaleY(0)';
      setTimeout(function () { edge.style.transformOrigin = 'top'; }, back * 1000 + 10);
    }, 430 * k);
  }

  initBands() {
    Array.prototype.slice.call(document.querySelectorAll('[data-band]')).forEach(b => {
      // data-landed is revealBand's guard, so it belongs with the rest of the hidden state:
      // leaving it set here would make a band ignore the drop that is supposed to reveal it.
      delete b.dataset.landed;
      b.style.opacity = '0';
      b.style.clipPath = 'inset(0 0 100% 0)';
      b.style.transition = 'opacity .5s ease, clip-path .95s cubic-bezier(.19,1,.22,1)';

      const rgb = BANDS[b.dataset.band].rgb;
      const flood = b.querySelector('[data-flood]');
      const edge = b.querySelector('[data-edge]');
      const shot = b.querySelector('[data-shot]');
      const img = shot.querySelector('img');
      const row = b.querySelector('[data-row]');
      const cta = b.querySelector('[data-cta]');
      const arrow = b.querySelector('[data-arrow]');
      const dim = b.dataset.band === 'amun';

      const set = function (on) {
        flood.style.transform = 'scaleX(' + (on ? 1 : 0) + ')';
        edge.style.transform = 'scaleY(' + (on ? 1 : 0) + ')';
        shot.style.transform = on ? 'scale(1.07) translateY(-3px)' : 'scale(1)';
        shot.style.boxShadow = on
          ? '0 26px 60px -16px rgba(' + rgb + ',.45), 0 0 0 1px rgba(' + rgb + ',.4)'
          : '0 18px 44px -14px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)';
        img.style.filter = on ? 'saturate(1) brightness(1)' : (dim ? 'saturate(.62) brightness(.78)' : 'saturate(.82) brightness(.86)');
        row.style.transform = on ? 'translateX(9px)' : 'translateX(0)';
        if (cta) cta.style.gap = on ? '13px' : '8px';
        if (arrow) arrow.style.transform = on ? 'translate(2px,-2px)' : 'translate(0,0)';
      };
      // Amun has no href while its page is unbuilt, so it gets no pointer response at all:
      // flooding the row and lifting the screenshot promised a destination that is not there.
      // It still takes the reveal above, and revealBand() still flares its edge.
      if (!b.getAttribute('href')) return;
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
  initSpine() {
    const spine = document.getElementById('spine');
    const dot = document.getElementById('spineDot');
    if (!spine || !dot) return;
    // scrollHeight and innerHeight were read on every scroll event, forcing a synchronous
    // layout on every frame of the one gesture that most needs to stay smooth. Neither changes
    // while scrolling, so both are cached and refreshed on resize, and the write is deferred to
    // a rAF so a burst of scroll events still only moves the dot once per frame.
    const wide = window.matchMedia('(min-width:1100px)');
    let max = 0, queued = false;
    const measure = function () { max = document.documentElement.scrollHeight - window.innerHeight; };
    const paint = function () {
      queued = false;
      if (!wide.matches) { spine.style.display = 'none'; return; }
      spine.style.display = 'block';
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      dot.style.top = 'calc(14vh + ' + (p * 72) + 'vh)';
    };
    const schedule = function () { if (queued) return; queued = true; requestAnimationFrame(paint); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', function () { measure(); schedule(); });
    // Images land after this runs, so the page gets taller than it was at init.
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
      menu.style.transition = 'opacity .5s cubic-bezier(.19,1,.22,1), transform .5s cubic-bezier(.19,1,.22,1)';
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0) scale(1)';
    });

    const close = function () { if (det.open) det.open = false; };
    // Pointerdown covers mouse, touch and pen, so tapping out closes it on every device.
    document.addEventListener('pointerdown', function (e) { if (det.open && !det.contains(e.target)) close(); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && det.open) { close(); summary.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    window.addEventListener('scroll', function () {
      if (window.matchMedia('(min-width:901px)').matches) close();
    }, { passive: true });
  }

  // Mobile: the whole nav collapses into one dropdown. The project list stays a <details>
  // inside it, so it reads as a second menu nested in the first.
  initMobileNav() {
    const nav = document.querySelector('nav');
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!nav || !btn || !menu) return;

    const set = open => {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) { const d = menu.querySelector('details'); if (d) d.open = false; }
    };
    set(false);

    btn.addEventListener('click', () => set(nav.getAttribute('data-open') !== 'true'));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('pointerdown', e => {
      if (nav.getAttribute('data-open') === 'true' && !nav.contains(e.target)) set(false);
    }, true);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') { set(false); btn.focus(); }
    });
    window.matchMedia('(min-width:901px)').addEventListener('change', () => set(false));
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

  // Scroll snapping was removed from the stylesheet -- the page is one continuous scroll now,
  // so there is nothing to suspend around a programmatic jump. Kept as a no-op because the
  // anchor and incoming-hash paths both still call it.
  suspendSnap() {}

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
      l.style.animation = 'none';
      l.style.setProperty('--reveal', '0%');
      l.style.transitionDelay = '0s';
      void l.offsetWidth;
      l.style.transition = 'opacity .15s ease, --reveal 2s linear';
    });
    document.querySelectorAll('#surface mask circle').forEach(function (c) { c.setAttribute('r', '0'); });
    const wl = document.getElementById('waterline');
    const rf = document.getElementById('heroPool');
    if (wl) { wl.style.transition = 'none'; wl.style.opacity = '0'; wl.style.transform = 'scaleX(0)'; void wl.offsetWidth; wl.style.transition = 'opacity .5s ease, transform 1.5s cubic-bezier(.19,1,.22,1)'; }
    if (rf) {
      rf.style.opacity = '0';
      rf.querySelectorAll('*').forEach(function (el) {
        if (el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); });
      });
      const lt = rf.querySelector('[data-pool-light]');
      if (lt) { lt.style.transform = 'scaleX(.05)'; lt.style.opacity = '0'; }
    }
    // Back to the pre-handoff state: the sub copy hidden and re-masked, the payoff's cascade
    // layers re-masked. `lines` is local to initHero() and is not in scope here -- reading it
    // threw a ReferenceError that aborted the rest of this method, so the work section stayed
    // blank and the hero never replayed. Only the tweaks panel's Replay button calls resetAll,
    // which is why it went unnoticed.
    const subP = document.querySelector('#heroSub p');
    if (subP) { subP.style.opacity = '0'; this.setMask(subP, 'url(#rippleSub)'); }
    const payoffLine = document.querySelector('#heroHeadline [data-line]:last-of-type');
    if (payoffLine) {
      payoffLine.style.animation = 'none';
      const w = payoffLine.querySelector('[data-cascade]');
      const e = payoffLine.querySelector('[data-cascade-edge]');
      if (w) { w.style.opacity = '0'; this.setMask(w, 'url(#rippleWord)'); }
      if (e) { e.style.display = ''; e.style.opacity = '0'; this.setMask(e, 'url(#rippleWordEdge)'); }
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
      delete b.dataset.landed;
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

  // The bar is absent on load so the hero reads as one uninterrupted view; it arrives once the
  // visitor has left the hero behind.
  initNavReveal() {
    const nav = document.getElementById('siteNav');
    const hero = document.getElementById('hero');
    if (!nav || !hero) return;
    let shown = null;
    const sync = () => {
      const past = window.scrollY > hero.offsetHeight * 0.72;
      if (past === shown) return;
      shown = past;
      nav.setAttribute('data-shown', past ? 'true' : 'false');
      if (!past) nav.setAttribute('data-open', 'false');
    };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  initAnchors() {
    // The brand used to reset and replay the whole page on click. It now behaves like any other
    // link to the top of the page.
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

document.addEventListener('DOMContentLoaded', function () { new Portfolio().init(); });
