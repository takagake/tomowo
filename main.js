/* ============================================================
   TOMOWO LP — interactions
   ============================================================ */
(function () {
  const root = document.documentElement;
  root.classList.add('js');
  const LS_THEME = 'tomowo_theme';
  const LS_LANG = 'tomowo_lang';

  /* ---------- restore saved prefs ---------- */
  const savedTheme = localStorage.getItem(LS_THEME);
  if (savedTheme && ['a', 'b', 'c'].includes(savedTheme)) root.setAttribute('data-theme', savedTheme);
  const savedLang = localStorage.getItem(LS_LANG);
  if (savedLang && ['jp', 'en'].includes(savedLang)) root.setAttribute('data-lang', savedLang);

  /* ---------- direction switcher ---------- */
  const swButtons = document.querySelectorAll('.switcher button[data-go]');
  function syncTheme() {
    const t = root.getAttribute('data-theme');
    swButtons.forEach(b => b.classList.toggle('active', b.dataset.go === t));
  }
  swButtons.forEach(b => b.addEventListener('click', () => {
    root.setAttribute('data-theme', b.dataset.go);
    localStorage.setItem(LS_THEME, b.dataset.go);
    syncTheme();
  }));
  syncTheme();

  /* ---------- language toggle ---------- */
  const langButtons = document.querySelectorAll('.lang-toggle button[data-lang]');
  function syncLang() {
    const l = root.getAttribute('data-lang');
    root.setAttribute('lang', l === 'en' ? 'en' : 'ja');
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  }
  langButtons.forEach(b => b.addEventListener('click', () => {
    root.setAttribute('data-lang', b.dataset.lang);
    localStorage.setItem(LS_LANG, b.dataset.lang);
    syncLang();
  }));
  syncLang();

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- reveal on scroll (position-based; robust in all environments) ---------- */
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  function revealVisible() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('in');
        reveals.splice(i, 1);
      }
    }
  }
  revealVisible();
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible, { passive: true });
  window.addEventListener('load', () => { revealVisible(); setTimeout(revealVisible, 200); });
  setTimeout(revealVisible, 300);
  /* failsafe: never leave content hidden */
  setTimeout(() => { document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in')); }, 2200);

  /* ---------- smooth anchor (account for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      ev.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- collapsible career timeline ---------- */
  const tl = document.querySelector('.timeline .tl');
  const tlBtn = document.querySelector('[data-tl-toggle]');
  if (tl && tlBtn) {
    tl.classList.add('is-collapsed');
    tlBtn.addEventListener('click', () => {
      const collapsed = tl.classList.toggle('is-collapsed');
      tlBtn.setAttribute('aria-expanded', String(!collapsed));
      if (collapsed) {
        const y = document.querySelector('.timeline').getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        setTimeout(revealVisible, 50);
      }
    });
  }
})();
