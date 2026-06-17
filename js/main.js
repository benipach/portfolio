/* ── Helper: strip whitespace ── */
function getCleanText(el) {
    return el.textContent.replace(/\s+/g, ' ').trim();
}

/* ── Base typewriter function ── */
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

/* ── Scroll reveal (cards, blocks) ── */
var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

/* ── Typewriter for section headings (scroll-triggered) ── */
function speedFor(el) {
    if (el.classList.contains('section-title')) return 35;
    if (el.classList.contains('section-label')) return 22;
    return 10; /* section-sub — long text, goes fast */
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

/* ── Hero: all three start together, staggered ── */
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

/* ── Hero exit: slides left on scroll ── */
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

/* ── Language switcher ── */
(function () {
  var btn = document.getElementById('lang-switcher');
  if (!btn) return;

  // Detect current lang from pathname: /en/... or /es/...
  function currentLang() {
    return /\/es\//i.test(window.location.pathname) ? 'es' : 'en';
  }

  // Mark active option
  var lang = currentLang();
  btn.querySelectorAll('.lang-opt').forEach(function (el) {
    el.classList.toggle('active', el.dataset.lang === lang);
  });

  btn.addEventListener('click', function () {
    var next = currentLang() === 'en' ? 'es' : 'en';
    // Navigate to sibling folder preserving hash
    window.location.href = '../' + next + '/index.html' + window.location.hash;
  });
})();

/* ── Hamburger menu ── */
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