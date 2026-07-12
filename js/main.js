const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');

function setHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}

function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) closeNav();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });
