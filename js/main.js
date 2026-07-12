/* One dataset drives the hero plot and the project cards, so a project's colour
   in the chart and on its card can never drift apart. */

const FIELDS = [
  { name: 'NLP', color: 'var(--cat-nlp)' },
  { name: 'Machine learning', color: 'var(--cat-ml)' },
  { name: 'Visualization', color: 'var(--cat-viz)' },
  { name: 'Big data', color: 'var(--cat-bigdata)' },
  { name: 'Reinforcement learning', color: 'var(--cat-rl)' }
];

const STACKS = ['Python', 'Java', 'JavaScript'];

const PROJECTS = [
  {
    name: 'Resume Entity Recognition',
    year: 2019, stack: 'Python', field: 'NLP',
    blurb: 'Named entity recognition over resumes in spaCy, so a candidate can be read at a glance instead of end to end.',
    repo: 'https://github.com/Suchismitha-Vedala/Entity-Recognition-In-Resumes-SpaCy'
  },
  {
    name: 'VAE Text Generation',
    year: 2018, stack: 'Python', field: 'NLP',
    blurb: 'A variational autoencoder that learns a continuous latent space over sentences, then samples new ones out of it.',
    repo: 'https://github.com/Suchismitha-Vedala/VAE-Text-Generation'
  },
  {
    name: 'Reinforcement Learning in Grid World',
    year: 2018, stack: 'Python', field: 'Reinforcement learning',
    blurb: 'An agent finding its way through a grid by value iteration and Q-learning, with the policy drawn as it converges.',
    repo: 'https://github.com/Suchismitha-Vedala/Reinforcement-Learning-in-Grid-World'
  },
  {
    name: 'Opinion Spam Detection',
    year: 2017, stack: 'Python', field: 'Machine learning',
    blurb: 'Separating planted reviews from real ones — the difference between opinion and manufactured opinion.',
    repo: 'https://github.com/Suchismitha-Vedala/Opinion-Spam-Detection'
  },
  {
    name: 'Sentiment Analysis of CNET Reviews',
    year: 2017, stack: 'Python', field: 'NLP',
    blurb: 'Scoring user reviews to surface what people actually think of a product, rather than what the star rating says.',
    repo: 'https://github.com/Suchismitha-Vedala/Sentiment-Analysis'
  },
  {
    name: 'K-Means Clustering on Hadoop',
    year: 2017, stack: 'Java', field: 'Big data',
    blurb: 'K-means over Amazon review data, distributed as MapReduce jobs so the clustering scales past one machine.',
    repo: 'https://github.com/Suchismitha-Vedala/K-means-clustering-using-Hadoop'
  },
  {
    name: 'Parallel Coordinates Visualization',
    year: 2017, stack: 'JavaScript', field: 'Visualization',
    blurb: 'High-dimensional data threaded across many axes in D3, so patterns between variables show up all at once. The chart at the top of this page is its descendant.',
    repo: 'https://github.com/Suchismitha-Vedala/Parallel-Coordinates-Visualization-using-D3.js'
  },
  {
    name: 'Boolean Search Engine',
    year: 2016, stack: 'Java', field: 'NLP',
    blurb: 'An inverted index and boolean query engine for text mining, built from the ground up in Java.',
    repo: 'https://github.com/Suchismitha-Vedala/Boolean-Search-Engine-Text-Mining'
  }
];

const CAREER = [
  { role: 'Statistics & Data Science Engineer', org: 'Canary Systems Inc. — Tucson, AZ', from: 2018, to: 2026.2, kind: 'work' },
  { role: 'Instructional Assistant', org: 'C.T. Bauer College of Business, UH', from: 2017, to: 2018, kind: 'work' },
  { role: 'Data Analyst', org: 'American International Group — Houston, TX', from: 2017, to: 2017.45, kind: 'work' },
  { role: 'MS, Computer Science', org: 'University of Houston', from: 2016, to: 2018, kind: 'study' },
  { role: 'Data Scientist, Research Assistant', org: 'C.T. Bauer College of Business, UH', from: 2016, to: 2017, kind: 'work' },
  { role: 'Software Developer', org: 'F9 Technologies — Visakhapatnam, India', from: 2014, to: 2014.55, kind: 'work' },
  { role: 'B.Tech, Computer Science', org: 'GITAM University', from: 2012, to: 2016, kind: 'study' }
];

const NS = 'http://www.w3.org/2000/svg';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, attrs = {}, text) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

const fieldColor = (name) => (FIELDS.find((f) => f.name === name) || {}).color || 'var(--ink)';

/* ---------- Signature: parallel coordinates ---------- */

function drawPlot() {
  const svg = document.getElementById('pc');
  const frame = document.getElementById('plot-frame');
  const readout = document.getElementById('readout');
  if (!svg) return;

  const TOP = 60;
  const BOT = 340;
  const AX = [
    { x: 140, name: 'Year' },
    { x: 470, name: 'Stack' },
    { x: 800, name: 'Field' }
  ];

  const YEARS = [2019, 2018, 2017, 2016];
  const yYear = (y) => BOT - ((y - 2016) / 3) * (BOT - TOP);
  const yBand = (i, n) => TOP + (i * (BOT - TOP)) / (n - 1);
  const yStack = (s) => yBand(STACKS.indexOf(s), STACKS.length);
  const yField = (f) => yBand(FIELDS.findIndex((x) => x.name === f), FIELDS.length);

  AX.forEach((a, i) => {
    const g = el('g', { class: 'pc-axis' });
    g.appendChild(el('line', { x1: a.x, y1: TOP - 14, x2: a.x, y2: BOT + 14 }));
    g.appendChild(el('text', {
      x: a.x,
      y: 32,
      class: 'pc-axis-name',
      'text-anchor': i === 0 ? 'start' : i === 1 ? 'middle' : 'end'
    }, a.name));
    svg.appendChild(g);
  });

  // One polyline per project. A touch of jitter keeps identical segments pickable.
  const lines = [];
  PROJECTS.forEach((p, i) => {
    const j = (i % 2 === 0 ? 1 : -1) * (i % 3) * 1.6;
    const pts = [
      [AX[0].x, yYear(p.year) + j],
      [AX[1].x, yStack(p.stack) + j],
      [AX[2].x, yField(p.field) + j]
    ];
    const color = fieldColor(p.field);

    const path = el('polyline', {
      class: 'pc-line',
      points: pts.map((q) => q.join(',')).join(' '),
      stroke: color,
      tabindex: '0',
      role: 'button',
      'aria-label': `${p.name} — ${p.year}, ${p.stack}, ${p.field}`
    });
    svg.appendChild(path);

    const dots = pts.map((q) =>
      svg.appendChild(el('circle', { class: 'pc-node', cx: q[0], cy: q[1], r: 3.5, fill: color }))
    );

    lines.push({ path, dots, project: p });

    if (!reduced) {
      const len = path.getTotalLength ? path.getTotalLength() : 900;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)';
      dots.forEach((d) => {
        d.style.opacity = '0';
        d.style.transition = 'opacity .4s';
      });
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
        dots.forEach((d) => { d.style.opacity = '1'; });
      }, 220 + i * 95);
    }
  });

  const focus = (i) => {
    if (i === null) {
      frame.removeAttribute('data-focus');
      readout.textContent = 'Hover a line to name the project.';
      readout.dataset.active = 'false';
      lines.forEach((l) => {
        l.path.classList.remove('is-on');
        l.dots.forEach((d) => d.classList.remove('is-on'));
      });
      return;
    }
    frame.setAttribute('data-focus', '');
    lines.forEach((x, k) => {
      x.path.classList.toggle('is-on', k === i);
      x.dots.forEach((d) => d.classList.toggle('is-on', k === i));
    });
    const p = lines[i].project;
    readout.textContent = `${p.name} · ${p.year} · ${p.stack} · ${p.field}`;
    readout.dataset.active = 'true';
  };

  lines.forEach((l, i) => {
    const on = () => focus(i);
    const off = () => focus(null);
    l.path.addEventListener('mouseenter', on);
    l.path.addEventListener('focus', on);
    l.path.addEventListener('mouseleave', off);
    l.path.addEventListener('blur', off);

    const go = () => {
      const card = document.getElementById(`card-${i}`);
      if (card) card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    };
    l.path.addEventListener('click', go);
    l.path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });

  // Ticks are drawn last, on a solid chip, so a line can never strike through a label.
  const tick = (x, y, label, anchor) => {
    const g = el('g', { class: 'pc-tick' });
    g.appendChild(el('line', { x1: x - 4, y1: y, x2: x + 4, y2: y }));

    const tx = anchor === 'end' ? x - 12 : x + 12;
    const w = label.length * 6.7 + 10;
    g.appendChild(el('rect', {
      class: 'pc-chip',
      x: anchor === 'end' ? tx - w + 5 : tx - 5,
      y: y - 9,
      width: w,
      height: 18,
      rx: 2
    }));
    g.appendChild(el('text', { x: tx, y: y + 4, 'text-anchor': anchor }, label));

    svg.appendChild(g);
  };

  YEARS.forEach((y) => tick(AX[0].x, yYear(y), String(y), 'end'));
  STACKS.forEach((s) => tick(AX[1].x, yStack(s), s, 'start'));
  FIELDS.forEach((f) => tick(AX[2].x, yField(f.name), f.name, 'start'));

  // Cards reuse this, so hovering a card lights its line in the plot.
  window.__pcFocus = focus;
}

/* ---------- Career on a time axis ---------- */

function drawGantt() {
  const svg = document.getElementById('gantt');
  if (!svg) return;

  const X0 = 320;
  const X1 = 880;
  const T0 = 2012;
  const T1 = 2026.5;
  const x = (t) => X0 + ((t - T0) / (T1 - T0)) * (X1 - X0);

  const grid = el('g', { class: 'g-grid' });
  for (let y = T0; y <= 2026; y += 2) {
    grid.appendChild(el('line', { x1: x(y), y1: 44, x2: x(y), y2: 372 }));
    grid.appendChild(el('text', { x: x(y), y: 394, 'text-anchor': 'middle' }, String(y)));
  }
  svg.appendChild(grid);

  CAREER.forEach((r, i) => {
    const cy = 70 + i * 46;
    const g = el('g', { class: 'g-row' });

    g.appendChild(el('text', { x: 300, y: cy - 1, 'text-anchor': 'end', class: 'g-role' }, r.role));
    g.appendChild(el('text', { x: 300, y: cy + 14, 'text-anchor': 'end', class: 'g-org' }, r.org));

    g.appendChild(el('rect', {
      class: `g-bar${r.kind === 'study' ? ' is-study' : ''}`,
      x: x(r.from),
      y: cy - 7,
      width: Math.max(x(r.to) - x(r.from), 7),
      height: 14,
      rx: 1
    }));

    svg.appendChild(g);
  });
}

/* ---------- Project cards ---------- */

function drawCards() {
  const host = document.getElementById('cards');
  if (!host) return;

  PROJECTS.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card reveal';
    card.id = `card-${i}`;
    card.style.setProperty('--cat', fieldColor(p.field));
    card.innerHTML = `
      <span class="card-field">${p.field}</span>
      <h3>${p.name}</h3>
      <p>${p.blurb}</p>
      <div class="card-foot">
        <span>${p.year} · ${p.stack}</span>
        <a href="${p.repo}">View code →</a>
      </div>`;
    card.addEventListener('mouseenter', () => window.__pcFocus && window.__pcFocus(i));
    card.addEventListener('mouseleave', () => window.__pcFocus && window.__pcFocus(null));
    host.appendChild(card);
  });
}

/* ---------- Reveals ---------- */

function watch() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      if (e.target.id === 'barchart') e.target.classList.add('is-drawn');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, #barchart').forEach((n) => io.observe(n));
}

drawPlot();
drawGantt();
drawCards();
watch();
