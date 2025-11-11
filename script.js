const headerToggle = document.querySelector('.site-header__toggle');
const primaryNav = document.querySelector('.site-header__nav');
const currentYearEl = document.getElementById('current-year');
const carousel = document.querySelector('[data-carousel]');

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

// Set current year in footer
if (currentYearEl) {
  const currentYear = new Date().getFullYear();
  currentYearEl.textContent = String(currentYear);
}

// Product showcase carousel
if (carousel) {
  const track = carousel.querySelector('.carousel__track');
  const slides = track ? Array.from(track.children) : [];
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  let currentIndex = 0;
  let autoplayId;

  const updateCarousel = () => {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, index) => {
      slide.classList.toggle('carousel__slide--active', index === currentIndex);
    });
  };

  const moveToIndex = (index) => {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      moveToIndex(currentIndex + 1);
    }, 7000);
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = undefined;
    }
  };

  prevButton?.addEventListener('click', () => moveToIndex(currentIndex - 1));
  nextButton?.addEventListener('click', () => moveToIndex(currentIndex + 1));

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  updateCarousel();
  startAutoplay();
}
