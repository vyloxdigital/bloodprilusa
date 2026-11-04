/* ═══════════════════════════════════════════════════════════════════
   BloodPril — main.js  |  bloodprilusa.vercel.app
   Sticky nav · Mobile menu · Fade-in · Counter animation · Rating bars · Scroll-top
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

(function () {

  /* ── 1. STICKY / HIDE-ON-SCROLL NAV ─────────────────────────────── */
  const nav        = document.getElementById('nav');
  const SOLID_Y    = 60;
  const HIDE_DELTA = 80;
  let lastY = 0;
  let ticking = false;

  function onScroll () {
    const y = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Solid background
        if (y > SOLID_Y) {
          nav.classList.add('nav-solid');
        } else {
          nav.classList.remove('nav-solid');
        }
        // Hide on scroll-down, reveal on scroll-up
        if (y > lastY + HIDE_DELTA && y > 200) {
          nav.classList.add('nav-hidden');
          nav.classList.remove('nav-visible');
        } else if (y < lastY - 10) {
          nav.classList.remove('nav-hidden');
          nav.classList.add('nav-visible');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 2. MOBILE MENU TOGGLE ──────────────────────────────────────── */
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.classList.toggle('open', !expanded);
      menu.classList.toggle('open', !expanded);
      nav.classList.toggle('nav-toggle-open', !expanded);
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('open');
        menu.classList.remove('open');
        nav.classList.remove('nav-toggle-open');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        toggle.click();
      }
    });
  }

  /* ── 3. INTERSECTION-BASED FADE-IN ──────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => fadeObs.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 4. COUNTER ANIMATION ───────────────────────────────────────── */
  function animateCounter (el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step (now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString('en-US') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.proof-num[data-count]');
  if ('IntersectionObserver' in window && counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ── 5. RATING BAR ANIMATION ────────────────────────────────────── */
  const ratingFills = document.querySelectorAll('.rating-fill[data-pct]');
  if ('IntersectionObserver' in window && ratingFills.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = parseInt(entry.target.dataset.pct, 10);
          entry.target.style.width = pct + '%';
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ratingFills.forEach(el => barObs.observe(el));
  } else {
    ratingFills.forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }

  /* ── 6. SCROLL-TO-TOP BUTTON ────────────────────────────────────── */
  // Inject button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
  </svg>`;
  document.body.appendChild(scrollTopBtn);

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  /* ── 7. SKIP-TO-MAIN LINK (a11y) ────────────────────────────────── */
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.prepend(skipLink);

  /* ── 8. SMOOTH-SCROLL FOR ALL HASH LINKS ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ── 9. FAQ KEYBOARD NAVIGATION ─────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(summary => {
    summary.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });

})();
