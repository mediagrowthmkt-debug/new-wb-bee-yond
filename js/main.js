/* ============================================================
   INSTITUTO BEEYOND — MAIN JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVIGATION ---- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');

  // Scroll behaviour
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpening = !navMenu.classList.contains('is-open');
      navToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
      if (nav) nav.classList.toggle('nav--menu-open');
      if (isOpening) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    });

    // Close on link click or CTA click
    navMenu.querySelectorAll('.nav__link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        if (nav) nav.classList.remove('nav--menu-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    });
  }

  // Active link highlight
  function setActiveNavLink() {
    const links = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || href.endsWith(currentPath))) {
        link.classList.add('nav__link--active');
      }
    });
  }
  setActiveNavLink();

  /* ---- AOS — Animate On Scroll (lightweight custom) ---- */
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
          setTimeout(() => {
            el.classList.add('aos-animate');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));

    /* Safety fallback: ensure all AOS elements become visible after 3s
       in case IntersectionObserver fails (e.g. content-visibility issues on mobile) */
    setTimeout(() => {
      elements.forEach(el => {
        if (!el.classList.contains('aos-animate')) {
          el.classList.add('aos-animate');
        }
      });
    }, 3000);
  }
  initAOS();

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR') + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }
  initCounters();

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- BEFORE/AFTER SLIDER ---- */
  function initBeforeAfter() {
    const sliders = document.querySelectorAll('.ba-slider');
    sliders.forEach(slider => {
      const handle = slider.querySelector('.ba-handle');
      const overlay = slider.querySelector('.ba-overlay');
      if (!handle || !overlay) return;

      let isDragging = false;

      function setPosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.min(Math.max(pct, 2), 98);
        overlay.style.width = pct + '%';
        handle.style.left = pct + '%';
      }

      handle.addEventListener('mousedown', () => { isDragging = true; });
      handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

      document.addEventListener('mouseup', () => { isDragging = false; });
      document.addEventListener('touchend', () => { isDragging = false; });

      document.addEventListener('mousemove', e => {
        if (isDragging) setPosition(e.clientX);
      });

      document.addEventListener('touchmove', e => {
        if (isDragging) setPosition(e.touches[0].clientX);
      }, { passive: true });
    });
  }
  initBeforeAfter();

  /* ---- LIGHTBOX for result images ---- */
  function initLightbox() {
    const triggers = document.querySelectorAll('[data-lightbox]');
    if (!triggers.length) return;

    const lb = document.createElement('div');
    lb.id = 'lb';
    lb.innerHTML = `
      <div id="lb-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;">
        <img id="lb-img" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);" src="" alt="">
        <button id="lb-close" style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1;">&times;</button>
      </div>`;
    lb.style.display = 'none';
    document.body.appendChild(lb);

    triggers.forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => {
        const src = el.dataset.lightbox || el.src || el.querySelector('img')?.src;
        document.getElementById('lb-img').src = src;
        lb.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });

    ['lb-overlay', 'lb-close'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }
  initLightbox();

  /* ---- FORM VALIDATION ---- */
  function initForms() {
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('[required]');
        let valid = true;

        inputs.forEach(input => {
          const wrap = input.closest('.form-field') || input.parentElement;
          wrap.classList.remove('form-field--error');

          if (!input.value.trim()) {
            valid = false;
            wrap.classList.add('form-field--error');
          }

          if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            valid = false;
            wrap.classList.add('form-field--error');
          }
        });

        if (valid) {
          const btn = form.querySelector('button[type="submit"]');
          const originalText = btn.innerHTML;
          btn.innerHTML = 'Enviando…';
          btn.disabled = true;

          setTimeout(() => {
            btn.innerHTML = '✓ Mensagem enviada!';
            btn.style.background = '#25D366';
            form.reset();
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
              btn.style.background = '';
            }, 4000);
          }, 1500);
        }
      });
    });
  }
  initForms();

  /* ---- PARALLAX subtle on hero ---- */
  function initParallax() {
    const heroBg = document.querySelector('.hero__bg img, .hero__bg video');
    if (!heroBg) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.2) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  initParallax();

  /* ---- LAZY VIDEO LOADING ---- */
  function initLazyVideos() {
    const lazyVideos = document.querySelectorAll('.lazy-video');
    if (!lazyVideos.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const sources = video.querySelectorAll('source[data-src]');
          sources.forEach(source => {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
          });
          video.load();
          video.play().catch(() => {});
          video.classList.remove('lazy-video');
          videoObserver.unobserve(video);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    lazyVideos.forEach(video => videoObserver.observe(video));
  }
  initLazyVideos();

  /* ---- YEAR auto-update in footer ---- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
