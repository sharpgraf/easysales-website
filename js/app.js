(function () {
  const STORAGE_KEY = 'easysales.lang';
  const supported = ['ru', 'et', 'en'];

  function setLanguage(lang) {
    if (!supported.includes(lang)) lang = 'ru';
    const dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.lang = lang === 'et' ? 'et' : lang;

    // Update <title> per language
    const titles = {
      ru: 'EasySales — простая CRM для малого бизнеса',
      et: 'EasySales — lihtne CRM väikeettevõtetele',
      en: 'EasySales — simple CRM for small business'
    };
    document.title = titles[lang] || titles.ru;

    // Translate all [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Update lang switcher state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function init() {
    // Year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Initial language
    let initial = 'ru';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && supported.includes(saved)) initial = saved;
      else {
        const browser = (navigator.language || 'ru').slice(0, 2);
        if (supported.includes(browser)) initial = browser;
      }
    } catch (_) {}
    setLanguage(initial);

    // Bind language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });

    // Mobile nav toggle
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Fake form submit feedback
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const note = form.querySelector('.form-note');
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = langOkMessage(document.documentElement.lang);
        if (note) {
          const thanks = {
            ru: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
            et: 'Täname! Võtame sinuga peagi ühendust.',
            en: 'Thanks! We will get back to you shortly.'
          };
          note.textContent = thanks[document.documentElement.lang] || thanks.ru;
        }
        setTimeout(() => { btn.disabled = false; btn.textContent = original; form.reset(); }, 3000);
      });
    }
  }

  function langOkMessage(lang) {
    return { ru: 'Отправляем…', et: 'Saadame…', en: 'Sending…' }[lang] || 'Sending…';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
