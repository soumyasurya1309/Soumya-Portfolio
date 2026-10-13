/*
  ============================================================
  SOUMYA SURYAWANSHI — PORTFOLIO JAVASCRIPT
  File: script.js
  Description: All interactive functionality for the portfolio.
  
  Concepts used (beginner-friendly):
  - document.getElementById(), querySelector(), querySelectorAll()
  - addEventListener()
  - classList.add(), classList.remove(), classList.toggle()
  - forEach()
  - if-else statements
  - functions (named and arrow)
  - textContent
  - preventDefault()
  - IntersectionObserver
  - Date object
  - Arrays and objects
  ============================================================
*/

// ============================================================
// 1. WAIT FOR THE PAGE TO FULLY LOAD
// 'DOMContentLoaded' fires when the HTML is ready.
// We wrap all our code inside this so elements exist before
// we try to access them.
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------------
  // 2. DYNAMIC COPYRIGHT YEAR
  // Uses the Date object to get the current year automatically.
  // No need to manually update every year.
  // ----------------------------------------------------------------
  var yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    var currentYear = new Date().getFullYear(); // get current year
    yearSpan.textContent = currentYear;         // set it in the HTML
  }

  // ----------------------------------------------------------------
  // 3. MOBILE HAMBURGER MENU
  // Clicking the hamburger button shows/hides the nav menu.
  // We use classList.toggle() to add or remove the 'open' class.
  // ----------------------------------------------------------------
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navMenu      = document.getElementById('nav-menu');

  function toggleMobileMenu() {
    // classList.toggle() adds 'open' if it's missing, removes it if present
    hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');

    // Update aria-expanded for accessibility (screen readers)
    var isOpen = navMenu.classList.contains('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when a nav link is clicked (smooth UX on mobile)
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Only close if mobile menu is currently open
      if (navMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', false);
      }
    });
  });

  // ----------------------------------------------------------------
  // 4. SMOOTH SCROLLING
  // When any link with href="#section-id" is clicked,
  // we scroll to that section smoothly instead of jumping.
  // preventDefault() stops the default instant-jump behavior.
  // ----------------------------------------------------------------
  var allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      event.preventDefault(); // stop the browser's default jump

      var targetId      = this.getAttribute('href'); // e.g. "#about"
      var targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Calculate position: section top minus nav height (so header doesn't cover it)
        var navHeight   = document.getElementById('main-header').offsetHeight;
        var sectionTop  = targetSection.getBoundingClientRect().top + window.pageYOffset;
        var scrollToPos = sectionTop - navHeight - 10; // 10px breathing room

        window.scrollTo({
          top:      scrollToPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----------------------------------------------------------------
  // 5. NAVBAR SCROLL EFFECTS
  // - Adds 'scrolled' class to header when user scrolls down
  //   (for the shadow/background effect)
  // - Highlights the active navigation link based on scroll position
  // ----------------------------------------------------------------
  var mainHeader  = document.getElementById('main-header');
  var allSections = document.querySelectorAll('section[id]'); // all sections with an id

  function onScroll() {
    var scrollY = window.pageYOffset;

    // Add 'scrolled' class after scrolling 50px
    if (scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Active nav link logic:
    // Check which section is currently in the viewport
    allSections.forEach(function (section) {
      var sectionTop    = section.offsetTop - 120; // 120px offset for early activation
      var sectionBottom = sectionTop + section.offsetHeight;
      var sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        // Remove 'active' from all nav links first
        navLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        // Add 'active' to the matching nav link
        var activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });

    // Show or hide back-to-top button
    handleBackToTop(scrollY);
  }

  // Listen to scroll events
  window.addEventListener('scroll', onScroll);

  // ----------------------------------------------------------------
  // 6. BACK TO TOP BUTTON
  // Shows when user scrolls down 400px, hides when near top.
  // ----------------------------------------------------------------
  var backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop(scrollY) {
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');    // show button
    } else {
      backToTopBtn.classList.remove('visible'); // hide button
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      // Scroll smoothly to the very top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------------
  // 7. THEME TOGGLE (Dark / Light Mode)
  // Clicking the moon/sun button toggles the 'light-mode' class
  // on the <body>. CSS variables in body.light-mode override the
  // default dark theme variables.
  // ----------------------------------------------------------------
  var themeToggleBtn = document.getElementById('theme-toggle-btn');
  var themeIcon      = document.getElementById('theme-icon');

  // Check if user previously set a theme preference (stored in localStorage)
  var savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.textContent = '☀'; // sun icon for light mode
  }

  function toggleTheme() {
    // Toggle the 'light-mode' class on body
    document.body.classList.toggle('light-mode');

    // Check if light mode is now active
    var isLight = document.body.classList.contains('light-mode');

    // Update the icon
    themeIcon.textContent = isLight ? '☀' : '☾';

    // Save the preference in localStorage so it persists on page reload
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // ----------------------------------------------------------------
  // 8. PROJECT CATEGORY FILTERING
  // Clicking a filter button shows only matching project cards.
  // Each card has a data-category attribute (e.g. data-category="ml").
  // The filter buttons have a data-filter attribute that matches.
  // ----------------------------------------------------------------
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards  = document.querySelectorAll('.project-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {

      // Step 1: Remove 'active' from all filter buttons
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });

      // Step 2: Add 'active' to the clicked button
      this.classList.add('active');

      // Step 3: Get the selected filter value (e.g. "ml", "flutter", "all")
      var selectedFilter = this.getAttribute('data-filter');

      // Step 4: Show or hide each project card
      projectCards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-category');

        if (selectedFilter === 'all') {
          // Show all cards — remove the 'hidden' class
          card.classList.remove('hidden');
        } else if (cardCategory === selectedFilter) {
          // Show this card — it matches the filter
          card.classList.remove('hidden');
        } else {
          // Hide this card — it doesn't match
          card.classList.add('hidden');
        }
      });
    });
  });

  // ----------------------------------------------------------------
  // 9. CERTIFICATE MODAL PREVIEW
  // Clicking "Preview" on a certificate card opens a modal.
  // The modal shows the certificate name as a placeholder until
  // the user adds actual certificate image files.
  // ----------------------------------------------------------------
  var certModal        = document.getElementById('cert-modal');
  var certModalOverlay = document.getElementById('modal-overlay');
  var certModalClose   = document.getElementById('modal-close-btn');
  var certModalImg     = document.getElementById('modal-img');
  var certModalTitle   = document.getElementById('modal-title');

  // Map certificate names to their image file paths
  // When you add certificate images, update these paths.
  var certImageMap = {
    'Google AI Professional Certificate':       'certificates/google-ai.jpg',
    'Deloitte Technology Virtual Job Simulation': 'certificates/deloitte.jpg',
    'Red Hat System Administration I':          'certificates/redhat-admin.jpg',
    'Python Programming – Red Hat Academy':     'certificates/redhat-python.jpg'
  };

  var certPreviewBtns = document.querySelectorAll('.cert-preview-btn');

  certPreviewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var certName = this.getAttribute('data-cert'); // get cert name from data attribute
      var imgPath  = certImageMap[certName];         // look up image path

      // Set modal content
      certModalTitle.textContent = certName;

      if (imgPath) {
        certModalImg.src = imgPath;
        certModalImg.alt = certName;
      } else {
        // Placeholder if image isn't available yet
        certModalImg.src = 'images/profile.jpg';
        certModalImg.alt = 'Certificate placeholder';
      }

      // Open modal by adding 'open' class
      certModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent background scroll
    });
  });

  // Close certificate modal functions
  function closeCertModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = ''; // restore scroll
    certModalImg.src = '';             // clear image to avoid flash on next open
  }

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModalOverlay) {
    certModalOverlay.addEventListener('click', closeCertModal);
  }

  // ----------------------------------------------------------------
  // 10. GALLERY IMAGE PREVIEW MODAL
  // Clicking any gallery image opens a larger preview.
  // ----------------------------------------------------------------
  var galleryModal        = document.getElementById('gallery-modal');
  var galleryModalOverlay = document.getElementById('gallery-modal-overlay');
  var galleryModalClose   = document.getElementById('gallery-modal-close');
  var galleryModalImg     = document.getElementById('gallery-modal-img');
  var galleryModalCaption = document.getElementById('gallery-modal-caption');

  var galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var imgSrc  = this.getAttribute('data-img');     // image path from data attribute
      var caption = this.getAttribute('data-caption'); // caption text

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

  // Close any modal when Escape key is pressed
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeCertModal();
      closeGalleryModal();
    }
  });

  // ----------------------------------------------------------------
  // 11. CONTACT FORM VALIDATION
  // Before submitting the form, we check if all required fields
  // are filled in correctly using JavaScript.
  // preventDefault() stops the form from actually submitting to a server.
  // ----------------------------------------------------------------
  var contactForm      = document.getElementById('contact-form');
  var nameInput        = document.getElementById('contact-name');
  var emailInput       = document.getElementById('contact-email');
  var subjectInput     = document.getElementById('contact-subject');
  var messageInput     = document.getElementById('contact-message');
  var formSuccessMsg   = document.getElementById('form-success-msg');

  // Error span elements
  var errorName    = document.getElementById('error-name');
  var errorEmail   = document.getElementById('error-email');
  var errorSubject = document.getElementById('error-subject');
  var errorMessage = document.getElementById('error-message');

  // Helper function: validate an email address format using a regular expression
  function isValidEmail(email) {
    // Regex pattern checks: something@something.something
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email); // returns true if valid, false if not
  }

  // Helper function: show an error message for a field
  function showError(input, errorSpan, message) {
    input.classList.add('invalid');        // red border from CSS
    errorSpan.textContent = message;       // show error text
  }

  // Helper function: clear an error message for a field
  function clearError(input, errorSpan) {
    input.classList.remove('invalid');     // remove red border
    errorSpan.textContent = '';            // clear error text
  }

  // Real-time validation: clear error as user types
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

  // Form submit handler
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // STOP the default form submission

      // Clear all previous errors
      clearError(nameInput, errorName);
      clearError(emailInput, errorEmail);
      clearError(subjectInput, errorSubject);
      clearError(messageInput, errorMessage);
      formSuccessMsg.classList.remove('show');

      // Get current values (trim removes extra spaces)
      var nameValue    = nameInput.value.trim();
      var emailValue   = emailInput.value.trim();
      var subjectValue = subjectInput.value.trim();
      var messageValue = messageInput.value.trim();

      // Track whether the form is valid
      var isValid = true;

      // Validate Name: must not be empty
      if (nameValue === '') {
        showError(nameInput, errorName, 'Please enter your name.');
        isValid = false;
      }

      // Validate Email: must match email format
      if (emailValue === '') {
        showError(emailInput, errorEmail, 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(emailValue)) {
        showError(emailInput, errorEmail, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Subject: must not be empty
      if (subjectValue === '') {
        showError(subjectInput, errorSubject, 'Please enter a subject.');
        isValid = false;
      }

      // Validate Message: must be at least 10 characters
      if (messageValue === '') {
        showError(messageInput, errorMessage, 'Please enter your message.');
        isValid = false;
      } else if (messageValue.length < 10) {
        showError(messageInput, errorMessage, 'Message must be at least 10 characters.');
        isValid = false;
      }

      // If all validations passed, show success message
      if (isValid) {
        // In a real project, you'd send the data to a server here (e.g., with fetch())
        // For this portfolio (client-side only), we just show a success message.
        formSuccessMsg.textContent = '✓ Thank you, ' + nameValue + '! Your message has been received. I\'ll get back to you soon.';
        formSuccessMsg.classList.add('show');

        // Reset the form fields
        contactForm.reset();

        // Hide the success message after 6 seconds
        setTimeout(function () {
          formSuccessMsg.classList.remove('show');
        }, 6000);
      }
    });
  }

  // ----------------------------------------------------------------
  // 12. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
  // When an element with [data-animate] enters the viewport,
  // we add the 'animated' class — CSS then fades it in.
  // This is more performant than listening to the scroll event
  // for every single animation element.
  // ----------------------------------------------------------------

  // All elements that should animate on scroll
  var animatedElements = document.querySelectorAll('[data-animate]');

  // Create an IntersectionObserver
  // It watches elements and calls our function when they enter/leave the viewport
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // entry.isIntersecting is true when the element is visible
        if (entry.isIntersecting) {
          entry.target.classList.add('animated'); // trigger CSS animation
          observer.unobserve(entry.target);        // stop watching (animate only once)
        }
      });
    },
    {
      threshold:  0.12,  // trigger when 12% of the element is visible
      rootMargin: '0px'  // no extra margin offset
    }
  );

  // Tell the observer to watch each animated element
  animatedElements.forEach(function (element) {
    observer.observe(element);
  });

  // ----------------------------------------------------------------
  // 13. HERO SECTION — IMMEDIATE ANIMATION
  // The hero section is visible on load, so trigger its animation
  // without waiting for IntersectionObserver.
  // ----------------------------------------------------------------
  var heroAnimated = document.querySelectorAll('.hero-section [data-animate]');
  setTimeout(function () {
    heroAnimated.forEach(function (el, index) {
      // Stagger each hero element by 150ms delay for a nice cascading effect
      setTimeout(function () {
        el.classList.add('animated');
      }, index * 150);
    });
  }, 200);

}); // End of DOMContentLoaded
