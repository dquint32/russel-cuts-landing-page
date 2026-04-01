/* =============================================================
   scripts.js — Russell Cuts & Tattoo
   Progressive enhancement only. No frameworks.
   All contact info / Zelle details visible without JS.
   ============================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. LANGUAGE TOGGLE
     Sets body class; hides/shows .lang-en / .lang-es elements.
     Active state preserved in sessionStorage.
  ----------------------------------------------------------- */
  const btnEN = document.getElementById('btnEN');
  const btnES = document.getElementById('btnES');

  function setLang(lang) {
    const isES = lang === 'es';
    document.body.classList.toggle('lang-es-active', isES);
    document.documentElement.setAttribute('lang', isES ? 'es' : 'en');

    if (btnEN) {
      btnEN.classList.toggle('lang-btn--active', !isES);
      btnEN.setAttribute('aria-pressed', String(!isES));
    }
    if (btnES) {
      btnES.classList.toggle('lang-btn--active', isES);
      btnES.setAttribute('aria-pressed', String(isES));
    }

    try { sessionStorage.setItem('rctt_lang', lang); } catch (_) {}
  }

  // Restore saved lang preference
  let savedLang = 'en';
  try { savedLang = sessionStorage.getItem('rctt_lang') || 'en'; } catch (_) {}
  setLang(savedLang);

  if (btnEN) btnEN.addEventListener('click', () => setLang('en'));
  if (btnES) btnES.addEventListener('click', () => setLang('es'));


  /* -----------------------------------------------------------
     2. MOBILE NAV HAMBURGER
  ----------------------------------------------------------- */
  const burger  = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open', !expanded);
    });

    // Close nav when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        burger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  }


  /* -----------------------------------------------------------
     3. SMOOTH SCROLL for anchor links
     (CSS scroll-behavior covers most cases; this handles edge cases)
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* -----------------------------------------------------------
     4. ACTIVE NAV HIGHLIGHT on scroll (IntersectionObserver)
  ----------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, { rootMargin: '-50% 0px -45% 0px' });

    sections.forEach(s => io.observe(s));
  }

}); // end DOMContentLoaded
