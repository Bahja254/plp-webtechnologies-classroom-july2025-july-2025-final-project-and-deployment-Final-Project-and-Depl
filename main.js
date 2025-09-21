// js/main.js
// Single file for all site interactivity: mobile nav toggle, recipe filter, scroll reveal, and contact validation.

document.addEventListener('DOMContentLoaded', () => {
  // 1) Fill copyright years
  const years = ['year','year2','year3','year4','year5'];
  const y = new Date().getFullYear();
  years.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  // 2) Mobile nav toggle
  const navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nav = document.getElementById('site-nav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.classList.toggle('show');
    });
  });

  // Close nav when a nav link is clicked (mobile)
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('site-nav');
      if (nav && nav.classList.contains('show')) {
        nav.classList.remove('show');
        document.querySelectorAll('.nav-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
      }
    });
  });

  // 3) Recipe filtering (if on recipes page)
  const filterArea = document.querySelector('.filters');
  if (filterArea) {
    const buttons = filterArea.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#recipe-grid .card');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const cat = card.dataset.category || 'all';
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            // small reveal effect
            setTimeout(()=> card.classList.add('show'), 20);
          } else {
            card.style.display = 'none';
            card.classList.remove('show');
          }
        });
      });
    });
  }

  // 4) IntersectionObserver reveal for .reveal elements
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    // fallback: show immediately
    revealEls.forEach(el => el.classList.add('show'));
  }

  // 5) Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const feedback = document.getElementById('form-feedback');

      // basic checks
      const errors = [];
      if (!name.value.trim()) errors.push('Please enter your name.');
      if (!validateEmail(email.value)) errors.push('Please enter a valid email address.');
      if (!message.value.trim() || message.value.trim().length < 10) errors.push('Message should be at least 10 characters.');

      if (errors.length) {
        feedback.textContent = errors.join(' ');
        feedback.style.color = 'crimson';
        feedback.focus();
      } else {
        // success: show message (in production you would send to server)
        feedback.textContent = 'Thanks! Your message was sent (demo).';
        feedback.style.color = 'green';
        form.reset();
      }
    });
  }

  // helper: simple email regex
  function validateEmail(email) {
    if (!email) return false;
    // basic RFC-like check (not exhaustive)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // 6) Highlight active nav based on current path
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href === 'index.html' && (path === '' || path === 'index.html'))) {
      a.classList.add('active-link');
      a.style.color = 'var(--accent)';
    }
  });
});