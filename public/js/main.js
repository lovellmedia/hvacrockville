/**
 * ════════════════════════════════════════════
 * CINEMATIC HOME SERVICES THEME - SHARED JS
 * All pages use this single file for interactivity
 * ════════════════════════════════════════════
 */

(function() {
  'use strict';

  /* ════════════════════════════════════════════
     1. THEME SYSTEM
     ════════════════════════════════════════════ */
  function initTheme() {
    const toggle = document.querySelector('.js-theme-toggle');
    if (!toggle) return;

    const stored = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = stored || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', current);

    toggle.addEventListener('click', function() {
      const theme = document.documentElement.getAttribute('data-theme');
      const next = theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme-preference', next);
    });
  }

  /* ════════════════════════════════════════════
     2. MOBILE MENU
     ════════════════════════════════════════════ */
  function initMobileMenu() {
    const btn = document.querySelector('.js-mobile-menu-btn');
    const menu = document.querySelector('.js-mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function() {
      menu.classList.toggle('is-open');
      const icon = btn.querySelector('svg');
      if (icon) {
        const isOpen = menu.classList.contains('is-open');
        icon.innerHTML = isOpen
          ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
          : '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>';
      }
    });
  }

  /* ════════════════════════════════════════════
     3. HEADER SCROLL BEHAVIOR
     ════════════════════════════════════════════ */
  function initHeaderScroll() {
    const header = document.querySelector('.js-site-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 80) {
            header.classList.add('is-scrolled');
            header.classList.remove('is-transparent');
          } else {
            header.classList.remove('is-scrolled');
            header.classList.add('is-transparent');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ════════════════════════════════════════════
     4. SCROLL ANIMATIONS (IntersectionObserver)
     ════════════════════════════════════════════ */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.js-animate');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ════════════════════════════════════════════
     5. FAQ ACCORDION
     ════════════════════════════════════════════ */
  function initFAQ() {
    const items = document.querySelectorAll('.js-faq-item');
    if (!items.length) return;

    items.forEach(function(item) {
      const question = item.querySelector('.js-faq-question');
      if (!question) return;

      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('is-open');

        // Close all siblings if you want accordion behavior
        const parent = item.closest('.js-faq-list');
        if (parent) {
          parent.querySelectorAll('.js-faq-item').forEach(function(sibling) {
            if (sibling !== item) sibling.classList.remove('is-open');
          });
        }

        item.classList.toggle('is-open', !isOpen);
      });
    });
  }

  /* ════════════════════════════════════════════
     6. REVIEW CAROUSEL
     ════════════════════════════════════════════ */
  function initReviewCarousel() {
    const carousel = document.querySelector('.js-review-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.js-review-slide');
    const dots = carousel.querySelectorAll('.js-review-dot');
    const prevBtn = carousel.querySelector('.js-review-prev');
    const nextBtn = carousel.querySelector('.js-review-next');
    if (!slides.length) return;

    let current = 0;
    let autoplayTimer = null;
    const autoplayDelay = 5000;

    function showSlide(index) {
      slides.forEach(function(s, i) {
        s.style.display = i === index ? 'block' : 'none';
      });
      dots.forEach(function(d, i) {
        d.classList.toggle('is-active', i === index);
      });
      current = index;
    }

    function next() {
      showSlide((current + 1) % slides.length);
    }

    function prev() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    showSlide(0);
    startAutoplay();

    if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAutoplay(); });

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
        startAutoplay();
      });
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  /* ════════════════════════════════════════════
     7. BEFORE / AFTER SLIDER
     ════════════════════════════════════════════ */
  function initBeforeAfterSlider() {
    const slider = document.querySelector('.js-ba-slider');
    if (!slider) return;

    const handle = slider.querySelector('.js-ba-handle');
    const afterLayer = slider.querySelector('.js-ba-after');
    if (!handle || !afterLayer) return;

    let isDragging = false;
    let position = 50;

    function setPosition(pct) {
      position = Math.max(0, Math.min(100, pct));
      handle.style.left = position + '%';
      afterLayer.style.width = position + '%';
    }

    function handleMove(clientX) {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      setPosition((x / rect.width) * 100);
    }

    slider.addEventListener('mousedown', function(e) {
      isDragging = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', function(e) {
      if (isDragging) handleMove(e.clientX);
    });

    window.addEventListener('mouseup', function() {
      isDragging = false;
    });

    slider.addEventListener('touchstart', function(e) {
      isDragging = true;
      handleMove(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
      if (isDragging) handleMove(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchend', function() {
      isDragging = false;
    });

    setPosition(50);
  }

  /* ════════════════════════════════════════════
     8. LIGHTBOX GALLERY
     ════════════════════════════════════════════ */
  function initLightbox() {
    const gallery = document.querySelector('.js-gallery');
    if (!gallery) return;

    const items = gallery.querySelectorAll('.js-gallery-item');
    const images = [];
    items.forEach(function(item) {
      const img = item.querySelector('img');
      if (img) images.push({ src: img.src, alt: img.alt, caption: item.dataset.caption || '' });
    });

    if (!images.length) return;

    let lightbox = null;
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML =
        '<button class="lightbox-close js-lightbox-close" aria-label="Close">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<button class="lightbox-nav lightbox-prev js-lightbox-prev" aria-label="Previous">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>' +
        '</button>' +
        '<button class="lightbox-nav lightbox-next js-lightbox-next" aria-label="Next">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>' +
        '<img src="' + images[currentIndex].src + '" alt="' + images[currentIndex].alt + '" />' +
        (images[currentIndex].caption ? '<p>' + images[currentIndex].caption + '</p>' : '');

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      lightbox.querySelector('.js-lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.js-lightbox-prev').addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
      lightbox.querySelector('.js-lightbox-next').addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });
      lightbox.addEventListener('click', closeLightbox);
    }

    function closeLightbox() {
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
      document.body.style.overflow = '';
    }

    function showImage() {
      if (!lightbox) return;
      const img = lightbox.querySelector('img');
      img.src = images[currentIndex].src;
      img.alt = images[currentIndex].alt;
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage();
    }

    items.forEach(function(item, i) {
      item.addEventListener('click', function() {
        openLightbox(i);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  /* ════════════════════════════════════════════
     9. COOKIE CONSENT
     ════════════════════════════════════════════ */
  function initCookieConsent() {
    const banner = document.querySelector('.js-cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      banner.classList.add('hidden');
      return;
    }

    setTimeout(function() {
      banner.classList.remove('hidden');
    }, 2000);

    const acceptBtn = banner.querySelector('.js-cookie-accept');
    const closeBtn = banner.querySelector('.js-cookie-close');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.classList.add('hidden');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        banner.classList.add('hidden');
      });
    }
  }

  /* ════════════════════════════════════════════
     10. FORM VALIDATION & SUBMISSION
     ════════════════════════════════════════════ */
  function initForms() {
    const forms = document.querySelectorAll('.js-lead-form');
    if (!forms.length) return;

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        const fields = form.querySelectorAll('[data-required]');
        let isValid = true;

        fields.forEach(function(field) {
          const wrapper = field.closest('.form-field');
          const value = field.value.trim();

          if (!value) {
            isValid = false;
            wrapper.classList.add('is-error');
            let error = wrapper.querySelector('.form-error');
            if (!error) {
              error = document.createElement('p');
              error.className = 'form-error';
              wrapper.appendChild(error);
            }
            error.textContent = (field.dataset.label || 'This field') + ' is required';
          } else {
            wrapper.classList.remove('is-error');
            const error = wrapper.querySelector('.form-error');
            if (error) error.remove();
          }
        });

        if (!isValid) return;

        // Simulate submission
        const submitBtn = form.querySelector('.js-form-submit');
        const originalText = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner"></span>';
        }

        setTimeout(function() {
          const successEl = form.querySelector('.js-form-success');
          if (successEl) {
            form.innerHTML = '';
            successEl.classList.remove('hidden');
            form.appendChild(successEl);
          }
        }, 1500);
      });
    });
  }

  /* ════════════════════════════════════════════
     11. GLOSSARY SEARCH & FILTER
     ════════════════════════════════════════════ */
  function initGlossarySearch() {
    const searchInput = document.querySelector('.js-glossary-search');
    if (!searchInput) return;

    const cards = document.querySelectorAll('.js-glossary-card');
    const letterSections = document.querySelectorAll('.js-glossary-letter');

    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();

      cards.forEach(function(card) {
        const term = card.dataset.term || '';
        const def = card.dataset.definition || '';
        const matches = !query || term.includes(query) || def.includes(query);
        card.style.display = matches ? '' : 'none';
      });

      letterSections.forEach(function(section) {
        const visibleCards = section.querySelectorAll('.js-glossary-card:not([style*="display: none"])');
        section.style.display = visibleCards.length ? '' : 'none';
      });
    });
  }

  /* ════════════════════════════════════════════
     12. SMOOTH SCROLL FOR ANCHOR LINKS
     ════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ════════════════════════════════════════════
     13. TABLE OF CONTENTS ACTIVE STATE
     ════════════════════════════════════════════ */
  function initTOC() {
    const toc = document.querySelector('.js-toc');
    if (!toc) return;

    const links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    const headings = [];
    links.forEach(function(link) {
      const id = link.getAttribute('href');
      const heading = document.querySelector(id);
      if (heading) headings.push({ id: id, element: heading, link: link });
    });

    function updateActive() {
      let current = '';
      headings.forEach(function(h) {
        const rect = h.element.getBoundingClientRect();
        if (rect.top <= 120) current = h.id;
      });

      headings.forEach(function(h) {
        h.link.classList.toggle('is-active', h.id === current);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ════════════════════════════════════════════
     14. VIDEO EMBED LAZY LOAD
     ════════════════════════════════════════════ */
  function initVideoEmbeds() {
    const videos = document.querySelectorAll('.js-video-embed');
    videos.forEach(function(video) {
      const btn = video.querySelector('.js-video-play');
      if (!btn) return;

      btn.addEventListener('click', function() {
        const iframe = video.querySelector('iframe');
        if (iframe && iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.classList.remove('hidden');
          btn.classList.add('hidden');
        }
      });
    });
  }

  /* ════════════════════════════════════════════
     15. CATEGORY FILTER (Blog)
     ════════════════════════════════════════════ */
  function initCategoryFilter() {
    const pills = document.querySelectorAll('.js-category-pill');
    const posts = document.querySelectorAll('.js-blog-card');
    if (!pills.length || !posts.length) return;

    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        const category = this.dataset.category;

        pills.forEach(function(p) { p.classList.remove('is-active'); });
        this.classList.add('is-active');

        posts.forEach(function(post) {
          const postCategory = post.dataset.category;
          const show = category === 'All' || postCategory === category;
          post.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ════════════════════════════════════════════
     16. PHONE STRIP DISMISS
     ════════════════════════════════════════════ */
  function initPhoneStrip() {
    const strip = document.querySelector('.js-phone-strip');
    if (!strip) return;

    const closeBtn = strip.querySelector('.js-phone-strip-close');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', function() {
      strip.style.display = 'none';
    });
  }

  /* ════════════════════════════════════════════
     17. STAT COUNTER ANIMATION
     ════════════════════════════════════════════ */
  function initStatCounters() {
    const stats = document.querySelectorAll('.js-stat-value');
    if (!stats.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const startTime = performance.now();

          function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function(stat) {
      observer.observe(stat);
    });
  }

  /* ════════════════════════════════════════════
     INITIALIZE ALL
     ════════════════════════════════════════════ */
  function init() {
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initFAQ();
    initReviewCarousel();
    initBeforeAfterSlider();
    initLightbox();
    initCookieConsent();
    initForms();
    initGlossarySearch();
    initSmoothScroll();
    initTOC();
    initVideoEmbeds();
    initCategoryFilter();
    initPhoneStrip();
    initStatCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Rockville audit fixes: mobile menu accessibility */
(function() {
  const btn = document.querySelector('.js-mobile-menu-btn');
  const menu = document.querySelector('.js-mobile-menu');
  if (!btn || !menu) return;
  if (!menu.id) menu.id = 'mobile-menu';
  btn.setAttribute('aria-controls', menu.id);
  btn.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
  btn.addEventListener('click', function() {
    btn.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();

