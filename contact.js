/* ============================================================
   TOMOWO — Contact form
   Client validation + FormSubmit AJAX submission.
   Works on static hosting (GitHub Pages); no backend required.
   ============================================================ */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var card = document.getElementById('formCard');
  var btn = document.getElementById('submitBtn');
  var btnLabel = btn ? btn.querySelector('.btn-label') : null;
  var errorBox = document.getElementById('formError');

  // ↓↓↓ Where submissions are emailed. Change this address if needed. ↓↓↓
  var TO_EMAIL = 'tomowo.takagake@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + encodeURIComponent(TO_EMAIL);

  var isEN = function () { return document.documentElement.getAttribute('data-lang') === 'en'; };

  function fieldOf(input) { return input.closest('[data-field]'); }

  function validateField(input) {
    var wrap = fieldOf(input);
    if (!wrap) return true;
    var ok = true;
    var v = (input.value || '').trim();
    if (input.hasAttribute('required') && !v) ok = false;
    if (ok && input.type === 'email' && v) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    wrap.classList.toggle('invalid', !ok);
    return ok;
  }

  // live-clear errors as the user fixes them
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      var wrap = fieldOf(el);
      if (wrap && wrap.classList.contains('invalid')) validateField(el);
    });
    el.addEventListener('blur', function () { if ((el.value || '').trim()) validateField(el); });
  });

  function setLoading(on) {
    if (!btn) return;
    btn.disabled = on;
    if (btnLabel) {
      btnLabel.innerHTML = on
        ? (isEN() ? 'Sending…' : '送信中…')
        : '<span class="l-jp">送信する</span><span class="l-en">Send message</span>';
    }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (errorBox) errorBox.classList.remove('show');

    // honeypot — silently succeed for bots
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) { card.classList.add('sent'); return; }

    // validate all required fields
    var firstBad = null;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (el) {
      var ok = validateField(el);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }

    setLoading(true);

    var data = new FormData(form);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function () {
        card.classList.add('sent');
        try { window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }); } catch (e) {}
      })
      .catch(function () {
        setLoading(false);
        if (errorBox) errorBox.classList.add('show');
      });
  });
})();
