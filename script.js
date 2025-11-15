const headerToggle = document.querySelector('.site-header__toggle');
const primaryNav = document.querySelector('.site-header__nav');
const currentYearEl = document.getElementById('current-year');
const carousel = document.querySelector('[data-carousel]');
const navLinks = document.querySelectorAll('.site-header__nav-link');

if (navLinks.length) {
  navLinks[0].setAttribute('aria-current', 'page');
}

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
      if (link.classList.contains('site-header__nav-link')) {
        navLinks.forEach((navLink) => {
          navLink.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'page');
      }
      if (primaryNav && primaryNav.classList.contains('site-header__nav--open')) {
        primaryNav.classList.remove('site-header__nav--open');
        headerToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Highlight navigation link on scroll for accessibility and SEO
const sectionObserver = () => {
  if (!('IntersectionObserver' in window)) return;
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matchingLink = document.querySelector(
            `.site-header__nav-link[href="#${entry.target.id}"]`
          );
          if (!matchingLink) return;
          navLinks.forEach((navLink) => navLink.removeAttribute('aria-current'));
          matchingLink.setAttribute('aria-current', 'page');
        }
      });
    },
    {
      rootMargin: '-50% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 1],
    }
  );

  sections.forEach((section) => observer.observe(section));
};

sectionObserver();

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
  const viewport = carousel.querySelector('.carousel__viewport');
  const motionMediaQuery =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
  let currentIndex = 0;
  let autoplayId;

  const updateCarousel = () => {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, index) => {
      slide.classList.toggle('carousel__slide--active', index === currentIndex);
      slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
      slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    });
  };

  const moveToIndex = (index) => {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
  };

  const startAutoplay = () => {
    if (prefersReducedMotion()) return;
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

  const handleKeydown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveToIndex(currentIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveToIndex(currentIndex + 1);
        break;
      case 'Home':
        event.preventDefault();
        moveToIndex(0);
        break;
      case 'End':
        event.preventDefault();
        moveToIndex(slides.length - 1);
        break;
      default:
        break;
    }
  };

  const prefersReducedMotion = () => motionMediaQuery.matches;

  prevButton?.addEventListener('click', () => moveToIndex(currentIndex - 1));
  nextButton?.addEventListener('click', () => moveToIndex(currentIndex + 1));

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
  viewport?.addEventListener('keydown', handleKeydown);

  updateCarousel();
  startAutoplay();

  const handleMotionPreferenceChange = (event) => {
    if (event.matches) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  if (typeof motionMediaQuery.addEventListener === 'function') {
    motionMediaQuery.addEventListener('change', handleMotionPreferenceChange);
  } else if (typeof motionMediaQuery.addListener === 'function') {
    motionMediaQuery.addListener(handleMotionPreferenceChange);
  }
}
