(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- compare v2016 ⇄ v2026, then merge ---- */
  const box = document.getElementById('diff');
  const tabs = box.querySelectorAll('.branches button');
  const merge = document.getElementById('merge');
  tabs.forEach(t => t.addEventListener('click', () => {
    if (merge.disabled) return;
    tabs.forEach(x => x.setAttribute('aria-selected', x === t));
    box.dataset.v = t.dataset.v === '2016' ? '2016' : '';
  }));
  merge.addEventListener('click', () => {
    box.dataset.v = 'merged';
    tabs.forEach(x => x.setAttribute('aria-selected', x.dataset.v === '2026'));
    merge.textContent = '✓ Merged · fast-forward';
    merge.disabled = true;
    document.getElementById('rev').textContent = '10.1';
  });

  /* ---- reveal on scroll ---- */
  const els = document.querySelectorAll('.sec-h, .c, .row, .spec, .refs li, .figures > div, .award');
  els.forEach(e => e.classList.add('rv'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  els.forEach(e => io.observe(e));

  /* ---- odometer the figures ---- */
  const nums = document.querySelectorAll('[data-count]');
  const no = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    no.unobserve(e.target);
    if (reduce) return;
    const end = +e.target.dataset.count; let i = 0;
    const tick = () => { e.target.textContent = String(i).padStart(2, '0'); if (i++ < end) setTimeout(tick, 900 / end); };
    tick();
  }), { threshold: .6 });
  nums.forEach(n => no.observe(n));

  /* ---- publish to regions, reveal contact ---- */
  const btn = document.getElementById('pubBtn');
  const regions = [...document.querySelectorAll('#regions li')];
  const contact = document.getElementById('contact');
  btn.addEventListener('click', () => {
    btn.disabled = true; btn.textContent = 'Publishing…';
    regions.forEach((r, i) => {
      setTimeout(() => { r.classList.add('busy'); r.querySelector('span').textContent = 'in progress'; }, reduce ? 0 : i * 380);
      setTimeout(() => {
        r.classList.remove('busy'); r.classList.add('done');
        r.querySelector('span').textContent = `published · ${(120 + Math.random() * 260 | 0)}ms`;
        if (i === regions.length - 1) { btn.textContent = '✓ Published'; contact.classList.add('live'); }
      }, reduce ? 0 : i * 380 + 700);
    });
  });
})();
