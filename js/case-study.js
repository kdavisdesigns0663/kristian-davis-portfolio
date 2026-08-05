class Page {
  init() {
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
}

document.addEventListener('DOMContentLoaded', () => new Page().init());
