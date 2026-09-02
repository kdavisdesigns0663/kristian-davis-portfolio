class Page {
  init() {
    // Before the nav guard below, which returns early on any page without a dropdown.
    this.initMotion();

    const det = document.querySelector('nav details');
    if (!det) return;
    this.det = det;
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
    this.onDocKey = e => { if (e.key === 'Escape' && det.open) { close(); if (summary) summary.focus(); } };
    document.addEventListener('keydown', this.onDocKey);
    if (menu) menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    this.onScrollClose = () => close();
    window.addEventListener('scroll', this.onScrollClose, { passive: true });
  }

  // An autoplaying <video loop> is untouched by the stylesheet's prefers-reduced-motion block,
  // which can only flatten CSS animations and transitions. This repo's rule is that every
  // animation answers a question the visitor is already asking, so a looping one has to be
  // stoppable by the same preference everything else here respects. The poster frame stays,
  // so the figure still shows the mark rather than going blank.
  //
  // Playback is driven from the viewport rather than from load. The Zentra loop sits five
  // sections down the page, and calling play() on it at DOMContentLoaded is asking a phone to
  // start a video that is thousands of pixels off screen. Mobile Safari declines that, the
  // rejected promise was being swallowed, and the poster stayed up for the whole visit -- the
  // mark never ran on a phone. An IntersectionObserver starts it when it is actually about to
  // be looked at and pauses it when it is not, which is also the version that does not burn
  // battery decoding frames nobody can see.
  //
  // Autoplay can still be refused outright: iOS in Low Power Mode blocks it for every video,
  // muted and inline included, and there is no media query that reports this. So a refusal arms
  // the next tap anywhere on the page to start it, and the video is click-to-play in its own
  // right. Silence beats a poster that never moves and never says why.
  initMotion() {
    const videos = Array.prototype.slice.call(document.querySelectorAll('video'));
    if (!videos.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let armed = false;

    const wake = () => {
      if (armed) return;
      armed = true;
      document.addEventListener('pointerdown', function go() {
        armed = false;
        document.removeEventListener('pointerdown', go);
        videos.forEach(function (v) {
          if (!reduce.matches && v.dataset.onscreen) { const p = v.play(); if (p) p.catch(function () {}); }
        });
      }, { passive: true });
    };

    const start = v => {
      if (reduce.matches || !v.dataset.onscreen || !v.paused) return;
      const p = v.play();
      if (p && p.catch) p.catch(wake);
    };

    // The browser's own autoplay is handed over to the observer below, so a video far down the
    // page is not decoded until it is nearly in view. The attribute stays in the markup: with
    // no JS at all, the browser's autoplay is the only thing that will ever start it.
    videos.forEach(function (v) { v.autoplay = false; });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          const v = e.target;
          if (e.isIntersecting) { v.dataset.onscreen = '1'; start(v); }
          else { delete v.dataset.onscreen; v.pause(); }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      videos.forEach(function (v) { io.observe(v); });
    } else {
      videos.forEach(function (v) { v.dataset.onscreen = '1'; start(v); });
    }

    // Tapping the loop itself is the direct way back if autoplay was refused.
    videos.forEach(function (v) {
      v.addEventListener('click', function () {
        if (reduce.matches) return;
        if (v.paused) { const p = v.play(); if (p) p.catch(function () {}); } else { v.pause(); }
      });
    });

    // Honour the preference being changed while the page is open, not only at load.
    const applyPref = () => {
      if (reduce.matches) videos.forEach(function (v) { v.pause(); v.currentTime = 0; });
      else videos.forEach(start);
    };
    reduce.addEventListener ? reduce.addEventListener('change', applyPref) : reduce.addListener(applyPref);
    applyPref();
  }
}

document.addEventListener('DOMContentLoaded', () => new Page().init());
