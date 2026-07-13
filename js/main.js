const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const canvas = document.querySelector('[data-system-canvas]');

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

function drawSystemCanvas() {
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);

  const center = { x: rect.width / 2, y: rect.height * 0.48 };
  const nodes = [
    { x: rect.width * 0.2, y: rect.height * 0.2 },
    { x: rect.width * 0.8, y: rect.height * 0.2 },
    { x: rect.width * 0.16, y: rect.height * 0.5 },
    { x: rect.width * 0.84, y: rect.height * 0.5 },
    { x: rect.width * 0.28, y: rect.height * 0.79 },
    { x: rect.width * 0.72, y: rect.height * 0.79 },
  ];

  context.lineWidth = 1;
  nodes.forEach((node, index) => {
    const gradient = context.createLinearGradient(center.x, center.y, node.x, node.y);
    gradient.addColorStop(0, 'rgba(101, 228, 198, 0.58)');
    gradient.addColorStop(1, index % 2 ? 'rgba(157, 183, 255, 0.18)' : 'rgba(232, 196, 108, 0.18)');
    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.bezierCurveTo(center.x, node.y, node.x, center.y, node.x, node.y);
    context.stroke();
  });

  context.strokeStyle = 'rgba(247, 242, 232, 0.08)';
  for (let radius = 90; radius < Math.min(rect.width, rect.height) * 0.56; radius += 70) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.stroke();
  }
}

setHeaderState();
drawSystemCanvas();

window.addEventListener('scroll', setHeaderState, { passive: true });
window.addEventListener('resize', drawSystemCanvas);
