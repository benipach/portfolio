/* ════════════════════════════════════════════════
   i18n — Language switching (no page reload)
   ════════════════════════════════════════════════ */

var currentLang = localStorage.getItem('lang') || 'es';

function applyLang(lang) {
  var t = TRANSLATIONS[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);

  /* <html> lang attribute */
  document.documentElement.lang = t.htmlLang;
  document.title = t.pageTitle;

  /* Nav */
  document.querySelector('.nav-logo').href = '#';
  setLink('#nav-link-about',    t.navAboutHref,   t.navAbout);
  setLink('#nav-link-projects', t.navProjHref,    t.navProjects);
  setLink('#nav-link-contact',  t.navContactHref, t.navContact);
  setLink('#mobile-link-about',    t.navAboutHref,   t.mobileAbout);
  setLink('#mobile-link-projects', t.navProjHref,    t.mobileProjects);
  setLink('#mobile-link-contact',  t.navContactHref, t.mobileContact);

  var hamburger = document.getElementById('nav-hamburger');
  if (hamburger) hamburger.setAttribute('aria-label', t.hamburgerLabel);

  /* Lang switcher: highlight active */
  document.querySelectorAll('.lang-opt').forEach(function(el) {
    el.classList.toggle('active', el.dataset.lang === lang);
  });

  /* Section IDs (needed for anchor links to work) */
  setId('.section-about',   t.sectionAboutId);
  setId('.section-projects', t.sectionProjId);
  setId('.section-contact',  t.sectionContactId);

  /* Hero */
  setText('.hero-eyebrow',  t.heroEyebrow);
  setText('.hero-desc',     t.heroDesc);
  setText('.race-bar-label', t.raceBarLabel);
  setText('.race-bar-pct-text', t.raceBarPct);
  setLink('.hero-cta-1', t.heroCta1Href, t.heroCta1);
  setLink('.hero-cta-2', t.heroCta2Href, t.heroCta2);

  /* About section */
  setText('.section-about .section-label', t.aboutLabel);
  setText('.section-about .section-title', t.aboutTitle);
  setText('.section-about .section-sub',   t.aboutSub);
  setText('#about-p1', t.aboutP1);
  setText('#about-p2', t.aboutP2);
  setText('#about-p3', t.aboutP3);

  /* Timeline */
  setText('#edu1-title',  t.edu1Title);
  setText('#edu1-degree', t.edu1Degree);
  setText('#edu1-date',   t.edu1Date);
  setText('#edu1-desc',   t.edu1Desc);
  setText('#exp1-title',  t.exp1Title);
  setText('#exp1-role',   t.exp1Role);
  setText('#exp1-date',   t.exp1Date);
  setText('#exp1-desc',   t.exp1Desc);

  /* Skills */
  setText('#skill-lang-label',   t.skillLangLabel);
  setText('#skill-db-label',     t.skillDbLabel);
  setText('#skill-tools-label',  t.skillToolsLabel);
  setText('#skill-ide-label',    t.skillIdeLabel);
  setText('#skill-spoken-label', t.skillSpokenLabel);
  setText('#skill-soft-label',   t.skillSoftLabel);
  setText('#skill-learn-label',  t.skillLearnLabel);
  setText('#soft-skill-1', t.softSkill1);
  setText('#soft-skill-2', t.softSkill2);
  setText('#soft-skill-3', t.softSkill3);
  setText('#soft-skill-4', t.softSkill4);
  setText('#soft-skill-5', t.softSkill5);
  setText('#soft-skill-6', t.softSkill6);
  setText('#spoken-lang-1', t.spokenLang1);
  setText('#spoken-lang-2', t.spokenLang2);

  /* Projects */
  setText('.section-projects .section-label', t.projLabel);
  setText('.section-projects .section-title', t.projTitle);
  setText('.section-projects .section-sub',   t.projSub);
  setText('#f1-badge',    t.f1Badge);
  setText('#f1-date',     t.f1Date);
  setText('#f1-desc',     t.f1Desc);
  setText('#f1-cta-text', t.f1Cta);
  setText('#f1-repo',     t.f1Repo);
  setText('#ecoluz-badge',    t.ecoluzBadge);
  setText('#ecoluz-date',     t.ecoluzDate);
  setText('#ecoluz-desc',     t.ecoluzDesc);
  setText('#ecoluz-cta-text', t.ecoluzCta);
  setText('#ecoluz-repo',     t.ecoluzRepo);

  /* Contact */
  setText('.section-contact .section-label', t.contactLabel);
  setText('.section-contact .section-title', t.contactTitle);
  setText('.section-contact .section-sub',   t.contactSub);

  /* Footer */
  setText('#footer-right', t.footerRight);
}

function setText(selector, value) {
  var el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function setLink(selector, href, text) {
  var el = document.querySelector(selector);
  if (!el) return;
  el.href = href;
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

function setId(selector, newId) {
  var el = document.querySelector(selector);
  if (el) el.id = newId;
}


/* ════════════════════════════════════════════════
   Helper: strip whitespace
   ════════════════════════════════════════════════ */
function getCleanText(el) {
  return el.textContent.replace(/\s+/g, ' ').trim();
}


/* ════════════════════════════════════════════════
   Typewriter
   ════════════════════════════════════════════════ */
function typeText(el, text, speed, onDone) {
  el.innerHTML = '';
  var cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.appendChild(cursor);
  var i = 0;
  function tick() {
    if (i >= text.length) {
      if (onDone) { cursor.remove(); onDone(); }
      else { setTimeout(function() { cursor.remove(); }, 1200); }
      return;
    }
    var ch = text[i++];
    ch === '\n'
      ? cursor.insertAdjacentHTML('beforebegin', '<br>')
      : cursor.insertAdjacentText('beforebegin', ch);
    setTimeout(tick, speed);
  }
  tick();
}


/* ════════════════════════════════════════════════
   Scroll reveal
   ════════════════════════════════════════════════ */
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });


/* ════════════════════════════════════════════════
   Section-heading typewriter (scroll-triggered)
   ════════════════════════════════════════════════ */
function speedFor(el) {
  if (el.classList.contains('section-title')) return 35;
  if (el.classList.contains('section-label')) return 22;
  return 10;
}

var twObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && !e.target.dataset.twDone) {
      e.target.dataset.twDone = '1';
      typeText(e.target, e.target.dataset.twText, speedFor(e.target), null);
      twObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-label, .section-title, .section-sub').forEach(function(el) {
  el.dataset.twText = getCleanText(el);
  el.innerHTML = '';
  twObs.observe(el);
});


/* ════════════════════════════════════════════════
   Hero typewriter (staggered on load)
   ════════════════════════════════════════════════ */
var eyebrow = document.querySelector('.hero-eyebrow');
var h1      = document.querySelector('h1');
var desc    = document.querySelector('.hero-desc');

var eyebrowText = getCleanText(eyebrow);
var descText    = getCleanText(desc);
eyebrow.innerHTML = '';
desc.innerHTML    = '';

setTimeout(function() { typeText(eyebrow, eyebrowText, 11, null); }, 1500);
setTimeout(function() { typeText(h1, 'Benicio\nPacheco.', 55, null); }, 250);
setTimeout(function() { typeText(desc, descText, 11, null); }, 1000);


/* ════════════════════════════════════════════════
   Hero exit: slides left on scroll
   ════════════════════════════════════════════════ */
(function() {
  var heroInner     = document.querySelector('.hero-inner');
  var heroContainer = document.querySelector('.hero-scroll-container');

  function onScroll() {
    var scrolled = window.scrollY;
    var range    = heroContainer.offsetHeight - window.innerHeight;
    if (scrolled <= 0) {
      heroInner.style.transform = '';
      heroInner.style.opacity   = '';
      return;
    }
    var progress = Math.min(scrolled / range, 1);
    heroInner.style.transform = 'translateX(' + (progress * 110) + '%)';
    heroInner.style.opacity   = String(Math.max(0, 1 - progress * 2.2));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ════════════════════════════════════════════════
   Hamburger menu
   ════════════════════════════════════════════════ */
(function() {
  var btn  = document.getElementById('nav-hamburger');
  var menu = document.getElementById('nav-mobile-menu');
  if (!btn || !menu) return;

  function openMenu() {
    menu.style.display = 'flex';
    requestAnimationFrame(function() {
      menu.classList.add('open');
      btn.classList.add('open');
    });
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.addEventListener('transitionend', function hide() {
      menu.style.display = 'none';
      menu.removeEventListener('transitionend', hide);
    });
  }

  btn.addEventListener('click', function() {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
})();


/* ════════════════════════════════════════════════
   Lang switcher — init & click handler
   ════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* Apply saved/default lang on load */
  applyLang(currentLang);

  /* Click on EN or ES */
  document.querySelectorAll('.lang-opt').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var lang = btn.dataset.lang;
      if (lang === currentLang) return;
      applyLang(lang);

      /* Re-trigger typewriter for any heading already typed */
      document.querySelectorAll('.section-label, .section-title, .section-sub').forEach(function(el) {
        if (el.dataset.twDone) {
          el.dataset.twText  = getCleanText(el);
          el.dataset.twDone  = '';
          el.innerHTML       = '';
          /* Re-observe so it fires on next intersection */
          twObs.observe(el);
          /* If already in viewport, fire immediately */
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.dataset.twDone = '1';
            typeText(el, el.dataset.twText, speedFor(el), null);
            twObs.unobserve(el);
          }
        }
      });
    });
  });
});

/* ════════════════════════════════════════════════
   Dark mode toggle
   Orden de prioridad: localStorage > prefers-color-scheme
   ════════════════════════════════════════════════ */
(function() {
  var btn  = document.getElementById('theme-toggle');
  var html = document.documentElement;

  /* applyTheme: actualiza clase, aria-label y (opcionalmente) guarda en localStorage */
  function applyTheme(dark, persist) {
    html.classList.toggle('dark', dark);
    if (btn) btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    if (persist) localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  /* Sincronizar aria-label con el estado actual del DOM
     (la clase .dark ya fue aplicada por el script inline del <head>) */
  applyTheme(html.classList.contains('dark'), false);

  /* Toggle manual: guardar elección del usuario */
  if (btn) {
    btn.addEventListener('click', function() {
      applyTheme(!html.classList.contains('dark'), true);
    });
  }

  /* Si el usuario cambia el tema del SO y no tiene preferencia guardada, seguirlo */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) applyTheme(e.matches, false);
  });
})();