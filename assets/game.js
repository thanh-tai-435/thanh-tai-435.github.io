// Playful layer for the portfolio. Everything degrades gracefully: with JS off the page is a normal static site.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toast = (msg) => {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
  };

  // theme toggle (saved choice wins over the OS setting)
  try { const s = localStorage.getItem('theme'); if (s) root.dataset.theme = s; } catch (e) {}
  const tb = $('.theme-btn');
  if (tb) tb.addEventListener('click', () => {
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = cur === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // XP bar = scroll progress
  const xp = $('.xp i');
  const upd = () => { const h = root.scrollHeight - innerHeight; if (xp) xp.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; };
  addEventListener('scroll', upd, { passive: true }); upd();

  // typewriter status line
  const tw = $('.typed');
  if (tw && !calm) {
    const L = ['explaining black-box models', 'taming messy spreadsheets', 'designing data platforms', 'reading the coffee market so you do not have to', 'looking for a research lab'];
    let i = 0, j = 0, del = false;
    (function tick() {
      const w = L[i]; j += del ? -1 : 1; tw.textContent = w.slice(0, j);
      let d = del ? 28 : 55;
      if (!del && j === w.length) { del = true; d = 1500; } else if (del && j === 0) { del = false; i = (i + 1) % L.length; d = 350; }
      setTimeout(tick, d);
    })();
  }

  // clickable avatar
  const lines = [
    'Hello. Please mind the data quality.',
    'I read model explanations the way others read reviews.',
    'Currently seeking: a lab, a dataset, a reasonable deadline.',
    'Yes, I always check the confusion matrix first.',
    'Tip: try the Konami code. The wheat is generous.'
  ];
  let k = 0;
  const sb = $('.scene-btn'), bub = $('.bubble');
  if (sb && bub) sb.addEventListener('click', () => {
    k = (k + 1) % lines.length; bub.textContent = lines[k];
    sb.classList.remove('hop'); void sb.offsetWidth; sb.classList.add('hop');
  });

  // quest-log filters
  const fs = $$('.filter'), cards = $$('.project[data-cat]');
  fs.forEach(b => b.addEventListener('click', () => {
    fs.forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    cards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
  }));

  // scroll reveal
  if ('IntersectionObserver' in window && !calm) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .1 });
    $$('.project,.interest-grid article,.timeline article,.stat,.skill-row').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  // copy email
  const cp = $('[data-copy]');
  if (cp) cp.addEventListener('click', (e) => {
    if (!navigator.clipboard) return; // falls back to the mailto link
    e.preventDefault();
    navigator.clipboard.writeText(cp.dataset.copy).then(() => toast('Email copied. Reply expected within one sprint.'), () => { location.href = cp.href; });
  });

  // Konami code: wheat rain
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  addEventListener('keydown', (e) => {
    pos = (e.key === code[pos] || e.key.toLowerCase() === code[pos]) ? pos + 1 : (e.key === code[0] ? 1 : 0);
    if (pos < code.length) return;
    pos = 0; toast('Cheat code accepted. Wheat rain enabled.');
    if (calm) return;
    for (let n = 0; n < 40; n++) {
      const g = document.createElement('i'); g.className = 'grain';
      g.style.left = Math.random() * 100 + 'vw';
      g.style.animationDuration = 2 + Math.random() * 2.5 + 's';
      g.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.append(g); setTimeout(() => g.remove(), 6000);
    }
  });

  console.log('%cHello, recruiter. Source: github.com/thanh-tai-435', 'font:14px monospace;color:#f2c94c;background:#14201a;padding:6px');
})();
