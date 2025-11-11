const headerToggle = document.querySelector('.site-header__toggle');
const primaryNav = document.querySelector('.site-header__nav');
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const currentYearEl = document.getElementById('current-year');

// Mobile navigation toggle
if (headerToggle && primaryNav) {
  headerToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('site-header__nav--open');
    headerToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scrolling for navigation links and buttons
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

smoothScrollLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
      if (primaryNav && primaryNav.classList.contains('site-header__nav--open')) {
        primaryNav.classList.remove('site-header__nav--open');
        headerToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Contact form handler
if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactSuccess.hidden = false;
    contactForm.reset();
  });
}

// Set current year in footer
if (currentYearEl) {
  const currentYear = new Date().getFullYear();
  currentYearEl.textContent = String(currentYear);
}
