/**
 * Responsive Architecture — Main Script
 * Modular vanilla JavaScript for site interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDarkMode();
  initSmoothScroll();
  initBackToTop();
  initContactForm();
  initStatsCounter();
  initNavbarScroll();
  initFadeInObserver();
});

/* --- 1. Mobile Hamburger Menu --- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const navLinks = nav.querySelectorAll('.nav__link');

  if (!navToggle || !nav) return;

  function toggleNav(forceClose) {
    const isOpen = forceClose ? false : navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', isOpen);
    nav.classList.toggle('nav--open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  }

  navToggle.addEventListener('click', () => toggleNav());

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleNav(true));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      toggleNav(true);
      navToggle.focus();
    }
  });
}

/* --- 2. Dark Mode Toggle --- */
function initDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const STORAGE_KEY = 'ra-theme';

  if (!themeToggle) return;

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
      localStorage.setItem(STORAGE_KEY, 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      localStorage.setItem(STORAGE_KEY, 'dark');
    }
  });
}

/* --- 3. Smooth Scrolling --- */
function initSmoothScroll() {
  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --- 4. Back To Top Button --- */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  const SCROLL_THRESHOLD = 400;

  function toggleVisibility() {
    const show = window.scrollY > SCROLL_THRESHOLD;
    backToTop.classList.toggle('visible', show);
    backToTop.hidden = !show;
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 5. Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (val) => (val.trim() ? '' : 'Name is required.'),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (val) => {
        if (!val.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim()) ? '' : 'Please enter a valid email address.';
      },
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate: (val) => (val.trim() ? '' : 'Subject is required.'),
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (val) => {
        if (!val.trim()) return 'Message is required.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      },
    },
  };

  const successMsg = document.getElementById('formSuccess');

  function showError(field, message) {
    field.error.textContent = message;
    field.input.classList.toggle('error', !!message);
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  Object.values(fields).forEach((field) => {
    field.input.addEventListener('input', () => {
      showError(field, '');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (successMsg) successMsg.hidden = true;

    let isValid = true;

    Object.values(fields).forEach((field) => {
      const message = field.validate(field.input.value);
      showError(field, message);
      if (message) isValid = false;
    });

    if (isValid) {
      if (successMsg) successMsg.hidden = false;
      form.reset();
      Object.values(fields).forEach((field) => {
        field.input.classList.remove('error');
        field.input.setAttribute('aria-invalid', 'false');
      });
    }
  });
}

/* --- 6. Animated Statistics Counter --- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-card__number');
  if (!statNumbers.length) return;

  const DURATION = 2000;

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((num) => observer.observe(num));
}

/* --- 7. Navbar Scroll Effect --- */
function initNavbarScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function updateHeader() {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* --- Fade-in on Scroll (Animation Enhancement) --- */
function initFadeInObserver() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach((el) => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}
