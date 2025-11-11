const headerToggle = document.querySelector('.site-header__toggle');
const primaryNav = document.querySelector('.site-header__nav');
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

// Carousel functionality
const carousels = document.querySelectorAll('[data-carousel]');

carousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const indicators = Array.from(carousel.querySelectorAll('[data-carousel-indicator]'));

  if (!slides.length) return;

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('carousel__slide--active'));
  if (currentIndex < 0) currentIndex = 0;

  const activateSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('carousel__slide--active', slideIndex === index);
    });

    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle('carousel__indicator--active', indicatorIndex === index);
      indicator.setAttribute('aria-pressed', indicatorIndex === index ? 'true' : 'false');
    });

    currentIndex = index;
  };

  const goToSlide = (index) => {
    const normalizedIndex = (index + slides.length) % slides.length;
    activateSlide(normalizedIndex);
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const previousSlide = () => goToSlide(currentIndex - 1);

  prevButton?.addEventListener('click', () => {
    previousSlide();
  });

  nextButton?.addEventListener('click', () => {
    nextSlide();
  });

  indicators.forEach((indicator, indicatorIndex) => {
    indicator.addEventListener('click', () => {
      goToSlide(indicatorIndex);
    });
  });

  let autoPlayId;

  const stopAutoPlay = () => {
    if (autoPlayId) {
      window.clearInterval(autoPlayId);
      autoPlayId = undefined;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayId = window.setInterval(nextSlide, 6000);
  };

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  carousel.addEventListener('focusin', stopAutoPlay);
  carousel.addEventListener('focusout', startAutoPlay);

  activateSlide(currentIndex);
  startAutoPlay();
});

// Set current year in footer
if (currentYearEl) {
  const currentYear = new Date().getFullYear();
  currentYearEl.textContent = String(currentYear);
}
