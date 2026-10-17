document.addEventListener('DOMContentLoaded', function () {

  var yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    var currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
  }

  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navMenu      = document.getElementById('nav-menu');

  function toggleMobileMenu() {

    hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');

    var isOpen = navMenu.classList.contains('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {

      if (navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', false);
      }
    });
  });

  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();

      var targetId      = this.getAttribute('href');
      var targetSection = document.querySelector(targetId);

      if (targetSection) {

        var navHeight   = document.getElementById('main-header').offsetHeight;
        var sectionTop  = targetSection.getBoundingClientRect().top + window.pageYOffset;
        var scrollToPos = sectionTop - navHeight - 10;

        window.scrollTo({
          top:      scrollToPos,
          behavior: 'smooth'
        });
      }
    });
  });

  var mainHeader  = document.getElementById('main-header');
  var allSections = document.querySelectorAll('section[id]');

  function onScroll() {
    var scrollY = window.pageYOffset;

    if (scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    allSections.forEach(function (section) {
      var sectionTop    = section.offsetTop - 120;
      var sectionBottom = sectionTop + section.offsetHeight;
      var sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {

        navLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        var activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });

    handleBackToTop(scrollY);
  }

  window.addEventListener('scroll', onScroll);

  var backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop(scrollY) {
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var themeToggleBtn = document.getElementById('theme-toggle-btn');
  var themeIcon      = document.getElementById('theme-icon');

  var savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.textContent = '☀';
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    if (themeIcon) {
      themeIcon.textContent = isLight ? '☀' : '☾';
    }
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards  = document.querySelectorAll('.project-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      var selectedFilter = this.getAttribute('data-filter');

      projectCards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-category');

        if (selectedFilter === 'all') {
          card.classList.remove('hidden');
        } else if (cardCategory === selectedFilter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  var certModal        = document.getElementById('cert-modal');
  var certModalOverlay = document.getElementById('modal-overlay');
  var certModalClose   = document.getElementById('modal-close-btn');
  var certModalImg     = document.getElementById('modal-img');
  var certModalTitle   = document.getElementById('modal-title');

  var certImageMap = {
    'Google AI Professional Certificate':       'certificates/google-ai.svg',
    'Deloitte Technology Virtual Job Simulation': 'certificates/deloitte.svg',
    'Red Hat System Administration I':          'certificates/redhat-admin.svg',
    'Python Programming – Red Hat Academy':     'certificates/redhat-python.svg'
  };

  var certPreviewBtns = document.querySelectorAll('.cert-preview-btn');

  certPreviewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var certName = this.getAttribute('data-cert');
      var imgPath  = certImageMap[certName];

      certModalTitle.textContent = certName;

      if (imgPath) {
        certModalImg.src = imgPath;
        certModalImg.alt = certName;
      } else {

        certModalImg.src = 'images/profile.jpg';
        certModalImg.alt = 'Certificate placeholder';
      }

      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeCertModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
    certModalImg.src = '';
  }

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModalOverlay) {
    certModalOverlay.addEventListener('click', closeCertModal);
  }

  var galleryModal        = document.getElementById('gallery-modal');
  var galleryModalOverlay = document.getElementById('gallery-modal-overlay');
  var galleryModalClose   = document.getElementById('gallery-modal-close');
  var galleryModalImg     = document.getElementById('gallery-modal-img');
  var galleryModalCaption = document.getElementById('gallery-modal-caption');

  var galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var imgSrc  = this.getAttribute('data-img');
      var caption = this.getAttribute('data-caption');

      galleryModalImg.src     = imgSrc;
      galleryModalImg.alt     = caption;
      galleryModalCaption.textContent = caption;

      galleryModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeGalleryModal() {
    galleryModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', closeGalleryModal);
  }

  if (galleryModalOverlay) {
    galleryModalOverlay.addEventListener('click', closeGalleryModal);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeCertModal();
      closeGalleryModal();
    }
  });

  var contactForm      = document.getElementById('contact-form');
  var nameInput        = document.getElementById('contact-name');
  var emailInput       = document.getElementById('contact-email');
  var subjectInput     = document.getElementById('contact-subject');
  var messageInput     = document.getElementById('contact-message');
  var formSuccessMsg   = document.getElementById('form-success-msg');

  var errorName    = document.getElementById('error-name');
  var errorEmail   = document.getElementById('error-email');
  var errorSubject = document.getElementById('error-subject');
  var errorMessage = document.getElementById('error-message');

  function isValidEmail(email) {

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function showError(input, errorSpan, message) {
    input.classList.add('invalid');
    errorSpan.textContent = message;
  }

  function clearError(input, errorSpan) {
    input.classList.remove('invalid');
    errorSpan.textContent = '';
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      if (this.value.trim().length > 0) {
        clearError(nameInput, errorName);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      if (isValidEmail(this.value.trim())) {
        clearError(emailInput, errorEmail);
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', function () {
      if (this.value.trim().length > 0) {
        clearError(subjectInput, errorSubject);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', function () {
      if (this.value.trim().length > 10) {
        clearError(messageInput, errorMessage);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      clearError(nameInput, errorName);
      clearError(emailInput, errorEmail);
      clearError(subjectInput, errorSubject);
      clearError(messageInput, errorMessage);
      formSuccessMsg.classList.remove('show');

      var nameValue    = nameInput.value.trim();
      var emailValue   = emailInput.value.trim();
      var subjectValue = subjectInput.value.trim();
      var messageValue = messageInput.value.trim();

      var isValid = true;

      if (nameValue === '') {
        showError(nameInput, errorName, 'Please enter your name.');
        isValid = false;
      }

      if (emailValue === '') {
        showError(emailInput, errorEmail, 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(emailValue)) {
        showError(emailInput, errorEmail, 'Please enter a valid email address.');
        isValid = false;
      }

      if (subjectValue === '') {
        showError(subjectInput, errorSubject, 'Please enter a subject.');
        isValid = false;
      }

      if (messageValue === '') {
        showError(messageInput, errorMessage, 'Please enter your message.');
        isValid = false;
      } else if (messageValue.length < 10) {
        showError(messageInput, errorMessage, 'Message must be at least 10 characters.');
        isValid = false;
      }

      if (isValid) {

        formSuccessMsg.textContent = '✓ Thank you, ' + nameValue + '! Your message has been received. I\'ll get back to you soon.';
        formSuccessMsg.classList.add('show');

        contactForm.reset();

        setTimeout(function () {
          formSuccessMsg.classList.remove('show');
        }, 6000);
      }
    });
  }

  var animatedElements = document.querySelectorAll('[data-animate]');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.12,
      rootMargin: '0px'
    }
  );

  animatedElements.forEach(function (element) {
    observer.observe(element);
  });

  var heroAnimated = document.querySelectorAll('.hero-section [data-animate]');
  setTimeout(function () {
    heroAnimated.forEach(function (el, index) {

      setTimeout(function () {
        el.classList.add('animated');
      }, index * 150);
    });
  }, 200);

});
