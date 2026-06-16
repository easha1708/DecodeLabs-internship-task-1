// ────────────────────────────────────────
//  DecodeLabs — script.js
// ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── CURRENT YEAR ──────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── NAVBAR SCROLL SHADOW ──────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // ── MOBILE MENU TOGGLE ────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close mobile menu when a link is clicked
  window.closeMobileMenu = function () {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  };

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) {
      window.closeMobileMenu();
    }
  });

  // ── SCROLL ANIMATIONS ─────────────────
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedEls.forEach((el) => observer.observe(el));

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── CONTACT FORM ──────────────────────
  const contactForm = document.getElementById('contactForm');
  const toast       = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField    = contactForm.querySelector('#contact-name');
      const emailField   = contactForm.querySelector('#contact-email');
      const messageField = contactForm.querySelector('#contact-message');

      const name    = nameField    ? nameField.value.trim()    : '';
      const email   = emailField   ? emailField.value.trim()   : '';
      const message = messageField ? messageField.value.trim() : '';

      // Basic validation
      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Success
      showToast("Message sent! We'll get back to you soon.");
      contactForm.reset();
    });
  }

});
