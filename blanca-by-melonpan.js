
/* ==========================================================================
   BLANCA by Melonpan — site interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Loader ---- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('is-hidden');
    }, 900);
  });
  // Fallback in case load event already fired
  setTimeout(function () { loader && loader.classList.add('is-hidden'); }, 2800);

  /* ---- Header scroll state ---- */
  const header = document.querySelector('.site-header');
  const toTop = document.querySelector('.to-top');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    if (window.scrollY > 700) {
      toTop.classList.add('is-visible');
    } else {
      toTop.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const body = document.body;

  navToggle.addEventListener('click', function () {
    body.classList.toggle('nav-open');
    const isOpen = body.classList.contains('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen
      ? '<span style="transform:translateY(7px) rotate(45deg)"></span><span style="opacity:0"></span><span style="transform:translateY(-7px) rotate(-45deg)"></span>'
      : '<span></span><span></span><span></span>';
  });

  document.querySelectorAll('.nav-links a, .nav-cta a').forEach(function (link) {
    link.addEventListener('click', function () {
      body.classList.remove('nav-open');
      navToggle.innerHTML = '<span></span><span></span><span></span>';
    });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---- Menu tabs ---- */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-tab');

      menuTabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');

      menuPanels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
      });
    });
  });

  /* ---- Gallery lightbox ---- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    body.style.overflow = '';
  }

  function showRelative(step) {
    currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  lightboxNext.addEventListener('click', function () { showRelative(1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---- Testimonial slider ---- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let slideIndex = 0;
  let slideTimer;

  function showSlide(index) {
    slides.forEach(function (s) { s.classList.remove('is-active'); });
    dots.forEach(function (d) { d.classList.remove('is-active'); });
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
    slideIndex = index;
  }

  function nextSlide() {
    showSlide((slideIndex + 1) % slides.length);
  }

  function startAutoplay() {
    slideTimer = setInterval(nextSlide, 5500);
  }

  function resetAutoplay() {
    clearInterval(slideTimer);
    startAutoplay();
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        resetAutoplay();
      });
    });
    startAutoplay();
  }

  /* ---- Contact form validation ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    const successMsg = form.querySelector('.form-success');

    const validators = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return /^[+0-9\s()-]{6,}$/.test(v.trim()); },
      message: function (v) { return v.trim().length >= 5; }
    };

    const errorMessages = {
      name: 'Խնդրում ենք նշել Ձեր անունը (առնվազն 2 տառ)',
      phone: 'Խնդրում ենք նշել վավեր հեռախոսահամար',
      message: 'Հաղորդագրությունը պետք է պարունակի առնվազն 5 նիշ'
    };

    function validateField(field) {
      const name = field.name;
      const group = field.closest('.form-group');
      const errorEl = group.querySelector('.form-error');
      const isValid = validators[name] ? validators[name](field.value) : true;

      if (!isValid) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = errorMessages[name] || 'Սխալ դաշտ';
      } else {
        group.classList.remove('has-error');
      }
      return isValid;
    }

    form.querySelectorAll('input[name], textarea[name]').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.closest('.form-group').classList.contains('has-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMsg.classList.remove('is-visible');

      const fields = form.querySelectorAll('input[name], textarea[name]');
      let allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Ուղարկվում է...';
        submitBtn.disabled = true;

        setTimeout(function () {
          successMsg.classList.add('is-visible');
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 900);
      }
    });
  }

  /* ---- Smooth scroll for in-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Current year in footer ---- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

