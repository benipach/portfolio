/* ════════════════════════════════════════════════
   Storage helpers (localStorage can throw in private mode)
   ════════════════════════════════════════════════ */
function readStorage(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}


/* ════════════════════════════════════════════════
   i18n — Language switching (no page reload)
   ════════════════════════════════════════════════ */

var currentLang = TRANSLATIONS[readStorage('lang')] ? readStorage('lang') : 'en';

function applyLang(lang) {
  var t = TRANSLATIONS[lang];
  if (!t) return;
  currentLang = lang;
  writeStorage('lang', lang);

  /* <html> lang attribute */
  document.documentElement.lang = t.htmlLang;
  document.title = t.pageTitle;

  /* Nav (the section ids are fixed in English, so only the text changes) */
  setLabel('#nav-link-about',    t.navAbout);
  setLabel('#nav-link-projects', t.navProjects);
  setLabel('#nav-link-contact',  t.navContact);
  setLabel('#mobile-link-about',    t.mobileAbout);
  setLabel('#mobile-link-projects', t.mobileProjects);
  setLabel('#mobile-link-contact',  t.mobileContact);

  var nav = document.querySelector('.nav');
  if (nav) nav.setAttribute('aria-label', t.navLabel);

  /* Lang switcher: highlight active (the underline slides via data-active in CSS) */
  document.querySelectorAll('.lang-opt').forEach(function(el) {
    var active = el.dataset.lang === lang;
    el.classList.toggle('active', active);
    el.setAttribute('aria-pressed', String(active));
  });
  var switcher = document.querySelector('.lang-switcher');
  if (switcher) switcher.setAttribute('data-active', lang);

  /* Hero */
  setText('.hero-eyebrow', t.heroEyebrow);
  setText('.hero-desc',    t.heroDesc);
  setText('.hero-status',  t.heroStatus);
  setLabel('.hero-cta-1', t.heroCta1);
  setLabel('.hero-cta-2', t.heroCta2);
  setLabel('#hero-resume', t.heroResume);
  var resume = document.getElementById('hero-resume');
  if (resume) resume.setAttribute('href', t.resumeFile);

  /* About section */
  setText('.section-about .section-label', t.aboutLabel);
  setText('.section-about .section-title', t.aboutTitle);
  setText('.section-about .section-sub',   t.aboutSub);

  /* Elements marked with data-i18n="key" (projects, description, background, skills) */
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var value = t[el.getAttribute('data-i18n')];
    if (value !== undefined) el.textContent = value;
  });

  /* Durations ("5 years 8 months") are written in the active language */
  updateDurations(t);

  /* Projects */
  setText('.section-projects .section-label', t.projLabel);
  setText('.section-projects .section-title', t.projTitle);
  setText('.section-projects .section-sub',   t.projSub);

  /* Contact */
  setText('.section-contact .section-label', t.contactLabel);
  setText('.section-contact .section-title', t.contactTitle);
  setText('.section-contact .section-sub',   t.contactSub);


  /* Labels that depend on state */
  syncMenuLabel();
  syncThemeLabel();
}

function setText(selector, value) {
  var el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setLabel(selector, text) {
  var el = document.querySelector(selector);
  if (!el) return;
  /* preserve child nodes (SVG icons) — only update text node */
  var textNode = Array.from(el.childNodes).find(function(n) {
    return n.nodeType === Node.TEXT_NODE && n.textContent.trim();
  });
  if (textNode) {
    textNode.textContent = text;
  } else {
    el.prepend(document.createTextNode(text));
  }
}


/* ════════════════════════════════════════════════
   Background — duration of each stage ("5 years 8 months")
   Counts months like LinkedIn: start and end month both included.
   If the end hasn't arrived yet, it counts up to the current month.
   ════════════════════════════════════════════════ */
function updateDurations(t) {
  var now = new Date();
  var currentMonth = now.getFullYear() * 12 + now.getMonth(); /* months since year 0 */

  function toMonths(value) { /* "2021-03" -> months since year 0 */
    var parts = value.split('-');
    return parseInt(parts[0], 10) * 12 + parseInt(parts[1], 10) - 1;
  }

  function unit(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  document.querySelectorAll('.path-duration').forEach(function(el) {
    var start = toMonths(el.getAttribute('data-start'));
    var end = Math.min(toMonths(el.getAttribute('data-end')), currentMonth);
    var total = Math.max(end - start + 1, 1);
    var years = Math.floor(total / 12);
    var months = total % 12;

    if (el.getAttribute('data-unit') === 'years') {
      /* Calendar years only, both ends included (school: 2021 to 2026 = 6 years) */
      var calendarYears = Math.floor(end / 12) - Math.floor(start / 12) + 1;
      el.textContent = unit(calendarYears, t.durYear, t.durYears);
    } else {
      var parts = [];
      if (years) parts.push(unit(years, t.durYear, t.durYears));
      if (months) parts.push(unit(months, t.durMonth, t.durMonths));
      el.textContent = parts.join(' ');
    }

    /* Once the end date has passed, hide the "In progress" / "Current" chip */
    var item = el.closest('.path-item');
    var status = item && item.querySelector('.path-status');
    if (status) status.hidden = toMonths(el.getAttribute('data-end')) < currentMonth;
  });
}


/* ════════════════════════════════════════════════
   Hamburger menu
   ════════════════════════════════════════════════ */
var menuBtn = document.getElementById('nav-hamburger');
var menu    = document.getElementById('nav-mobile-menu');

function syncMenuLabel() {
  if (!menuBtn) return;
  var t = TRANSLATIONS[currentLang];
  var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-label', isOpen ? t.hamburgerClose : t.hamburgerOpen);
}

(function() {
  if (!menuBtn || !menu) return;
  var hideTimer;

  function openMenu() {
    clearTimeout(hideTimer);
    menu.hidden = false;
    requestAnimationFrame(function() { menu.classList.add('open'); });
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    syncMenuLabel();
  }

  function closeMenu() {
    menu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    syncMenuLabel();
    /* matches the 150ms opacity transition in CSS */
    hideTimer = setTimeout(function() { menu.hidden = true; }, 160);
  }

  menuBtn.addEventListener('click', function() {
    menuBtn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuBtn.focus();
    }
  });

  /* Close the mobile menu if the viewport grows past the breakpoint */
  window.matchMedia('(min-width: 761px)').addEventListener('change', function(e) {
    if (e.matches && !menu.hidden) closeMenu();
  });
})();


/* ════════════════════════════════════════════════
   Dark mode toggle
   Default is light; the user's manual choice is saved.
   ════════════════════════════════════════════════ */
var themeBtn = document.getElementById('theme-toggle');

function syncThemeLabel() {
  if (!themeBtn) return;
  var t = TRANSLATIONS[currentLang];
  var dark = document.documentElement.classList.contains('dark');
  themeBtn.setAttribute('aria-label', dark ? t.themeToLight : t.themeToDark);
}

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (themeBtn) {
  themeBtn.addEventListener('click', function() {
    var root = document.documentElement;
    var dark = !root.classList.contains('dark');

    function apply() {
      root.classList.toggle('dark', dark);
      writeStorage('theme', dark ? 'dark' : 'light');
      syncThemeLabel();
    }

    /* the new icon spins in (see .theme-switching in CSS) */
    root.classList.add('theme-switching');
    setTimeout(function() { root.classList.remove('theme-switching'); }, 650);

    /* Without View Transitions (or with reduced motion), switch instantly */
    if (!document.startViewTransition || reduceMotion.matches) {
      apply();
      return;
    }

    /* The new theme grows as a circle from the center of the button */
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(apply).ready.then(function() {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 600, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  });
}


/* ════════════════════════════════════════════════
   Hover effects — lines and fills that always finish
   The line under links and the fill of buttons grow from the left
   and leave through the right. If the mouse leaves halfway, the line
   first finishes drawing and only then erases; if it comes back while
   erasing, it waits for the erase to end and draws again. That way it
   never jumps mid-way. CSS draws the states: .fx-left anchors the line
   on the left, .fx-on makes it full (see styles.css).
   ════════════════════════════════════════════════ */
(function() {
  var FALLBACK_MS = 800; /* in case transitionend never fires (e.g. the element gets hidden) */

  document.querySelectorAll('.btn, .text-link, .nav-links a').forEach(function(el) {
    var state = 'idle'; /* idle → drawing → drawn → erasing → idle */
    var wanted = false; /* mouse over it, or keyboard focus */
    var timer;

    function draw() {
      state = 'drawing';
      el.classList.add('fx-left', 'fx-on');
      waitForEnd();
    }

    function erase() {
      state = 'erasing';
      /* At full size, moving the anchor to the right is invisible: then it shrinks toward it */
      el.classList.remove('fx-left', 'fx-on');
      waitForEnd();
    }

    function waitForEnd() {
      clearTimeout(timer);
      timer = setTimeout(finished, FALLBACK_MS);
    }

    function finished() {
      clearTimeout(timer);
      if (state === 'drawing') {
        state = 'drawn';
        if (!wanted) erase();
      } else if (state === 'erasing') {
        state = 'idle';
        if (wanted) draw();
      }
    }

    function enter() {
      wanted = true;
      if (state === 'idle') draw();
    }

    function leave() {
      wanted = false;
      if (state === 'drawn') erase();
    }

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('focus', function() { if (el.matches(':focus-visible')) enter(); });
    el.addEventListener('blur', leave);

    /* Only the line or the fill counts: not the text color, the arrow or the press effect */
    el.addEventListener('transitionend', function(e) {
      if (e.target !== el) return;
      var isLine = e.propertyName === 'background-size';
      var isFill = e.propertyName === 'transform' && e.pseudoElement === '::before';
      if (isLine || isFill) finished();
    });
  });
})();


/* ════════════════════════════════════════════════
   Contact — copy email
   Uses the clipboard; if the browser blocks it, selects the
   address so it can be copied by hand. Shows a short message.
   ════════════════════════════════════════════════ */
(function() {
  var btn     = document.getElementById('copy-email');
  var status  = document.getElementById('copy-status');
  var address = document.getElementById('contact-address');
  if (!btn || !status) return;
  var hideTimer;

  function show(key) {
    status.textContent = TRANSLATIONS[currentLang][key];
    status.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() { status.classList.remove('is-visible'); }, 2400);
  }

  function selectAddress() {
    if (!address) return;
    var range = document.createRange();
    range.selectNodeContents(address);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    show('contactSelected');
  }

  btn.addEventListener('click', function() {
    var email = btn.getAttribute('data-email');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function() { show('contactCopied'); }, selectAddress);
    } else {
      selectAddress();
    }
  });
})();


/* ════════════════════════════════════════════════
   Lang switcher — init & click handler
   (this script is deferred, so the DOM is ready)
   ════════════════════════════════════════════════ */
applyLang(currentLang);

/* The page was hidden while it was still in English (see the script in <head>) */
document.documentElement.classList.remove('i18n-pending');

/* Enable the sliding underline only after the first paint,
   so it doesn't animate when the page loads in Spanish */
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    var switcher = document.querySelector('.lang-switcher');
    if (switcher) switcher.classList.add('is-ready');
  });
});

document.querySelectorAll('.lang-opt').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (btn.dataset.lang !== currentLang) applyLang(btn.dataset.lang);
  });
});
