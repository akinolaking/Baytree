/**
 * BayTree Engineering & Construction
 * Main JavaScript — shared across all pages
 */

'use strict';

// ── Header (always white/solid — no transparency conflict with slider) ─────
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  // Header is always white; add shadow on scroll for depth feedback
  const onScroll = () => {
    header.classList.toggle('shadow-md', window.pageYOffset > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile drawer ──────────────────────────────────────────────────────────
function initDrawer() {
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn  = document.getElementById('drawer-close');
  const drawer    = document.getElementById('mobile-drawer');
  const overlay   = document.getElementById('drawer-overlay');
  if (!toggleBtn || !drawer) return;

  function open() {
    drawer.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  }

  function close() {
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}

// ── Scroll animations ──────────────────────────────────────────────────────
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
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.slider-dot');
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

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
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
        card.classList.toggle('filter-hidden', !show);
      });
    });
  });
}

// ── Contact form (Web3Forms) ───────────────────────────────────────────────
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const result = document.getElementById('form-result');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const botcheck = form.querySelector('[name="botcheck"]');
    if (botcheck && botcheck.value) return;

    if (sessionStorage.getItem('bt_submitted')) {
      showResult('You have already submitted an inquiry this session. We will be in touch soon.', 'info');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
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

// ── Products mega-menu ────────────────────────────────────────────────────
function initMegaMenu() {
  const wrapper = document.getElementById('products-menu-wrapper');
  const trigger = document.getElementById('products-trigger');
  const menu    = document.getElementById('products-mega');
  const chevron = document.getElementById('products-chevron');
  if (!wrapper || !trigger || !menu) return;

  let closeTimer;

  function open() {
    clearTimeout(closeTimer);
    menu.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }

  function close() {
    closeTimer = setTimeout(() => {
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = '';
    }, 120);
  }

  wrapper.addEventListener('mouseenter', open);
  wrapper.addEventListener('mouseleave', close);
  trigger.addEventListener('click', () => menu.classList.contains('open') ? close() : open());

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('click',   (e) => { if (!wrapper.contains(e.target)) close(); });
}

// ── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initDrawer();
  initScrollAnimations();
  initSlider();
  initPortfolioFilter();
  initContactForm();
  initMegaMenu();
});
