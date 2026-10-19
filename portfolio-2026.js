(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const themeButton = $('theme-toggle');
  const updateTheme = theme => {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0b1930' : '#f5f8fe';
  };
  try { const stored = localStorage.getItem('saumya-portfolio-theme'); if (stored === 'light' || stored === 'dark') updateTheme(stored); } catch (_) { /* Storage is optional. */ }
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    updateTheme(theme);
    try { localStorage.setItem('saumya-portfolio-theme', theme); } catch (_) { /* Continue without persistence. */ }
  });

  const menu = $('mobile-nav'), menuButton = $('menu-toggle');
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menu.hidden = !open; });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus(); } });

  const dialog = $('overview-dialog');
  [$('overview-open'), $('overview-open-footer')].forEach(button => button.addEventListener('click', () => dialog.showModal()));
  $('overview-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => { const visible = filter === 'all' || card.dataset.category.split(' ').includes(filter); card.hidden = !visible; if (visible) count++; });
    $('project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
  }));

  const scenarios = {
    late: { records: [['ARRIVAL 01', 'Version 1', '$100.00'], ['ARRIVAL 02', 'Version 2', '$120.00'], ['ARRIVAL 03', 'Version 1', '$100.00']], highlight: 1, label: 'SAFE TO SERVE', value: 'Version 2 · $120.00 USD', reason: 'A late older version does not replace the correction.' },
    conflict: { records: [['ARRIVAL 01', 'Version 1', '$100.00'], ['ARRIVAL 02', 'Version 1', '$130.00']], highlight: -1, label: 'REVIEW REQUIRED', value: 'Conflicting evidence · quarantined', reason: 'Different amounts at the same business version require review; arrival time does not settle the conflict.' }
  };
  document.querySelectorAll('[data-mini]').forEach(button => button.addEventListener('click', () => {
    const scenario = scenarios[button.dataset.mini];
    document.querySelectorAll('[data-mini]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const fragment = document.createDocumentFragment();
    scenario.records.forEach((record, index) => { const row = document.createElement('div'); if (index === scenario.highlight) row.className = 'event-highlight'; record.forEach((text, column) => { const cell = document.createElement(column === 1 ? 'strong' : 'span'); cell.textContent = text; row.append(cell); }); fragment.append(row); });
    $('mini-events').replaceChildren(fragment);
    $('mini-label').textContent = scenario.label; $('mini-value').textContent = scenario.value; $('mini-reason').textContent = scenario.reason;
  }));

  const decisions = {
    source: ['01 / UNDERSTAND THE SOURCE', 'Arrival time is not business truth.', 'Define what a record identifies, where it came from and which fields determine its business meaning. A fresh file can still contain an old trade version.', 'What guarantees does the source actually make about identity and ordering?', 'Experience lens: financial-data integration and reconciliation.'],
    validate: ['02 / VALIDATE THE HISTORY', 'Make exceptions visible.', 'Separate exact replays from contradictory payloads. Check money, currency and status explicitly. A passed ingestion job is not the same as validated business data.', 'What should block the pipeline, and what needs a review queue?', 'Experience lens: data-quality checks, reporting validation and exception handling.'],
    state: ['03 / RECONSTRUCT STATE', 'Preserve the lifecycle.', 'Resolve the latest validated business state before filtering. Dropping cancelled events too early can make a superseded active record appear current.', 'Could this transformation silently revive a cancelled trade?', 'Experience lens: derivatives trade lifecycles and reconciliation.'],
    context: ['04 / MAKE CONTEXT INSPECTABLE', 'Carry evidence into the answer.', 'An AI handoff should retain identity, version, status and provenance. Missing or conflicting evidence should produce an explicit ineligible decision, rather than an invented value.', 'Can a reviewer trace the answer back to a validated record?', 'Current exploration: synthetic evidence packets for AI. This is not a claim of production LLM deployment.']
  };
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-step]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const fields = ['step-overline', 'step-title', 'step-copy', 'step-question', 'step-connection'];
    decisions[button.dataset.step].forEach((value, index) => { $(fields[index]).textContent = value; });
  }));

  $('copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('https://saumya-saumya.github.io/'); $('copy-status').textContent = 'Portfolio link copied.'; }
    catch (_) { $('copy-status').textContent = 'Portfolio link: https://saumya-saumya.github.io/'; }
  });
  let scheduled = false;
  const updateProgress = () => { const scrollable = document.documentElement.scrollHeight - innerHeight; $('reading-progress').style.width = `${scrollable > 0 ? Math.min(100, scrollY / scrollable * 100) : 0}%`; scheduled = false; };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => { if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); }); }, { rootMargin: '-20% 0px -55% 0px' });
    ['work', 'experience', 'approach', 'about'].forEach(id => observer.observe($(id)));
  }
})();
