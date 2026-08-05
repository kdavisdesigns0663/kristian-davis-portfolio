// Links screen. One pulse on the primary link: the only job this screen has is telling
// a visitor which of the three destinations is the real one.
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ring = document.getElementById('ring1');
  if (!ring) return;
  setTimeout(() => { ring.style.animation = 'linkRing 2.6s cubic-bezier(.16,1,.3,1) 2'; }, 500);
});
