document.documentElement.classList.add('js');
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
   Hero exit: slides right on scroll (sticky)
   ════════════════════════════════════════════════ */
(function() {
  var heroInner     = document.querySelector('.hero-inner');
  var heroContainer = document.querySelector('.hero-scroll-container');
  if (!heroInner || !heroContainer) return;

  function onScroll() {
    var scrolled = window.scrollY;
    /* runway = espacio sticky disponible: container - viewport */
    var range = heroContainer.offsetHeight - window.innerHeight;
    if (scrolled <= 0) {
      heroInner.style.transform = '';
      heroInner.style.opacity   = '';
      return;
    }
    var progress = Math.min(scrolled / range, 1);
    heroInner.style.transform = 'translateX(' + (progress * 210) + '%)';
    heroInner.style.opacity   = String(Math.max(0, 1 - progress * 2));
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

/* ════════════════════════════════════════════════
   Scroll reveal — refined entrance animations
   ════════════════════════════════════════════════ */
(function() {
  function setDelay(selector, step, maxDelay) {
    document.querySelectorAll(selector).forEach(function(el, index) {
      var delay = Math.min(index * step, maxDelay);
      el.style.setProperty('--reveal-delay', delay + 'ms');
    });
  }

  function initScrollReveal() {
    var revealEls = Array.from(document.querySelectorAll('.reveal'));
    if (!revealEls.length) return;

    setDelay('.section-about > .reveal', 80, 220);
    setDelay('.section-projects > .reveal', 80, 220);
    setDelay('.section-contact > .reveal', 80, 220);
    setDelay('.timeline .timeline-item.reveal', 120, 260);
    setDelay('.skills-grid .skill-category.reveal', 65, 420);
    setDelay('.projects-grid .project-card.reveal', 120, 240);
    setDelay('.contact-links .contact-item.reveal', 90, 220);
    setDelay('footer .reveal', 80, 160);

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -10% 0px'
    });

    revealEls.forEach(function(el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', initScrollReveal);
})();
