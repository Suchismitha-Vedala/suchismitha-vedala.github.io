const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));

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

function setActiveNav() {
  const sections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  let active = sections[0]?.link;
  const offset = window.innerHeight * 0.32;

  sections.forEach(({ link, target }) => {
    if (target.getBoundingClientRect().top <= offset) {
      active = link;
    }
  });

  navLinks.forEach((link) => link.classList.toggle('is-active', link === active));
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
setActiveNav();

window.addEventListener('scroll', () => {
  setHeaderState();
  setActiveNav();
}, { passive: true });

window.addEventListener('resize', setActiveNav);
