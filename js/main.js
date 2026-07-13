const navLinks = Array.from(document.querySelectorAll('.site-nav a'));

function setActiveNav() {
  const sections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  let active = null;
  const offset = window.innerHeight * 0.32;

  sections.forEach(({ link, target }) => {
    if (target.getBoundingClientRect().top <= offset) {
      active = link;
    }
  });

  navLinks.forEach((link) => link.classList.toggle('is-active', link === active));
}

setActiveNav();
window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', setActiveNav);
