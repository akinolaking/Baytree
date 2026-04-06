/**
 * BayTree Engineering & Construction
 * Main JavaScript — shared across all pages
 */

'use strict';

// ── Sticky header ──────────────────────────────────────────────────────────
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.pageYOffset > 80) {
      header.classList.add('bg-white', 'shadow-md');
    } else {
      header.classList.remove('bg-white', 'shadow-md');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

// ── Mobile menu ────────────────────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Scroll animations (IntersectionObserver) ───────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}

// ── Hero slider ────────────────────────────────────────────────────────────
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (!slides.length) return;

  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  goTo(0);
  startAuto();
}

// ── Portfolio filter ───────────────────────────────────────────────────────
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards      = document.querySelectorAll('[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      cards.forEach((card) => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        if (show) card.classList.add('animate-on-scroll', 'visible');
      });
    });
  });
}

// ── Contact form ───────────────────────────────────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const result  = document.getElementById('form-result');
  if (!form) return;

  // Honeypot check + rate limiting
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const botcheck = form.querySelector('[name="botcheck"]');
    if (botcheck && botcheck.value) return; // bot detected

    // Rate limit: 1 submission per session
    if (sessionStorage.getItem('bt_submitted')) {
      showResult('You have already submitted an inquiry this session. We will be in touch soon.', 'info');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      const json = await res.json();

      if (res.ok && json.success) {
        sessionStorage.setItem('bt_submitted', '1');
        showResult('Thank you — your message has been received. We will respond within 24 hours.', 'success');
        form.reset();
      } else {
        showResult('Something went wrong. Please email us directly at info@baytreeng.com', 'error');
      }
    } catch {
      showResult('Network error. Please try again or email us directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Inquiry';
    }
  });

  function showResult(message, type) {
    if (!result) return;
    result.textContent = message;
    result.className = 'mt-4 p-4 rounded-md text-sm font-medium';
    if (type === 'success') result.classList.add('bg-moss/10', 'text-forest-green');
    if (type === 'error')   result.classList.add('bg-red-50', 'text-red-700');
    if (type === 'info')    result.classList.add('bg-oyster', 'text-concrete-grey');
    result.classList.remove('hidden');
  }
}

// ── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initSlider();
  initPortfolioFilter();
  initContactForm();
});
