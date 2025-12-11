// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Account for fixed header height
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add click handlers to navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's an anchor link on the same page (starts with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
            // If it's a link to a different page (like index.html#classes), allow default behavior
            // The browser will handle the navigation
        });
    });

    // Add animation to class cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.class-card, .project-card, .testimonial-card, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });

    // Add interactive robot animation
    const robotAnimation = document.querySelector('.robot-animation');
    if (robotAnimation) {
        robotAnimation.addEventListener('click', function () {
            this.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg) scale(1)';
            }, 1000);
        });
    }

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.enroll-btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Add event listeners to curriculum buttons as backup
    const curriculumButtons = document.querySelectorAll('.curriculum-btn');
    curriculumButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Curriculum button clicked via event listener:', onclick);
                // Execute the onclick function
                if (onclick.includes('openBeginnerCurriculum')) {
                    window.openBeginnerCurriculum();
                } else if (onclick.includes('openEngineersCurriculum')) {
                    window.openEngineersCurriculum();
                } else if (onclick.includes('openCurriculum')) {
                    window.openCurriculum();
                } else if (onclick.includes('openFutureCurriculum')) {
                    window.openFutureCurriculum();
                }
            }
        });
    });
});

// Add some fun interactive features
function addRobotSounds() {
    const robotElements = document.querySelectorAll('.robot-emoji, .robot-animation');
    robotElements.forEach(robot => {
        robot.addEventListener('click', function () {
            // Create a simple beep sound effect
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        });
    });
}

// Initialize interactive features
document.addEventListener('DOMContentLoaded', addRobotSounds);

// Background Slideshow
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');

    // Only initialize if slides exist (slideshow is only on index.html, not enquiry.html)
    if (slides.length === 0) {
        return;
    }

    let currentSlide = 0;
    let slideshowInterval = null;

    function showNextSlide() {
        // Re-query slides in case DOM changed
        const currentSlides = document.querySelectorAll('.slide');

        // Check if slides still exist and currentSlide is valid
        if (currentSlides.length === 0) {
            // Clear interval if no slides exist
            if (slideshowInterval) {
                clearInterval(slideshowInterval);
                slideshowInterval = null;
            }
            return;
        }

        // Ensure currentSlide is within bounds
        if (currentSlide >= currentSlides.length) {
            currentSlide = 0;
        }

        // Remove active class from current slide
        if (currentSlides[currentSlide]) {
            currentSlides[currentSlide].classList.remove('active');
        }

        // Move to next slide
        currentSlide = (currentSlide + 1) % currentSlides.length;

        // Add active class to new slide
        if (currentSlides[currentSlide]) {
            currentSlides[currentSlide].classList.add('active');
        }
    }

    // Change slide every 5 seconds
    slideshowInterval = setInterval(showNextSlide, 5000);

    // Clean up on page unload
    window.addEventListener('beforeunload', function () {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
    });
}

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', initSlideshow);

// Learning Tracks Horizontal Slider with Pagination Dots
function initLearningTracksSlider() {
    const classesGrid = document.getElementById('classesGrid');
    const paginationContainer = document.getElementById('classesPagination');

    if (!classesGrid || !paginationContainer) {
        return; // Exit if elements don't exist
    }

    const cards = classesGrid.querySelectorAll('.class-card');
    if (cards.length === 0) {
        return;
    }

    // Check if content overflows
    function checkOverflow() {
        const containerWidth = classesGrid.offsetWidth;
        const scrollWidth = classesGrid.scrollWidth;
        const hasOverflow = scrollWidth > containerWidth;

        if (hasOverflow) {
            paginationContainer.classList.add('active');
            createPaginationDots();
        } else {
            paginationContainer.classList.remove('active');
            paginationContainer.innerHTML = '';
        }
    }

    // Create pagination dots
    function createPaginationDots() {
        // Clear existing dots
        paginationContainer.innerHTML = '';

        // Calculate how many cards are visible at once
        const containerWidth = classesGrid.offsetWidth;
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(getComputedStyle(classesGrid).gap) || 24;
        const cardsPerView = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Create dots
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'classes-pagination-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.addEventListener('click', () => scrollToPage(i, cardWidth, gap, cardsPerView));
            paginationContainer.appendChild(dot);
        }
    }

    // Scroll to specific page
    function scrollToPage(pageIndex, cardWidth, gap, cardsPerView) {
        const containerWidth = classesGrid.offsetWidth;
        const scrollWidth = classesGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Calculate scroll position based on page index
        const scrollPercentage = totalPages > 1 ? pageIndex / (totalPages - 1) : 0;
        const scrollPosition = scrollPercentage * maxScroll;

        classesGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
        const dots = paginationContainer.querySelectorAll('.classes-pagination-dot');
        if (dots.length === 0) return;

        const containerWidth = classesGrid.offsetWidth;
        const scrollLeft = classesGrid.scrollLeft;
        const scrollWidth = classesGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;

        // Calculate which page we're on based on scroll percentage
        const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const currentPage = Math.min(
            Math.round(scrollPercentage * (dots.length - 1)),
            dots.length - 1
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // Initial check with delay to ensure layout is rendered
    setTimeout(() => {
        checkOverflow();
    }, 100);

    // Recheck on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkOverflow();
            if (paginationContainer.classList.contains('active')) {
                createPaginationDots();
            }
        }, 250);
    });

    // Update active dot on scroll
    classesGrid.addEventListener('scroll', updateActiveDot);
}


// Projects Horizontal Slider with Pagination Dots
function initProjectsSlider() {
    const projectsGrid = document.getElementById('projectsGrid');
    const paginationContainer = document.getElementById('projectsPagination');

    if (!projectsGrid || !paginationContainer) {
        return; // Exit if elements don't exist
    }

    const cards = projectsGrid.querySelectorAll('.project-card');
    if (cards.length === 0) {
        return;
    }

    // Check if content overflows
    function checkOverflow() {
        const containerWidth = projectsGrid.offsetWidth;
        const scrollWidth = projectsGrid.scrollWidth;
        const hasOverflow = scrollWidth > containerWidth;

        if (hasOverflow) {
            paginationContainer.classList.add('active');
            createPaginationDots();
        } else {
            paginationContainer.classList.remove('active');
            paginationContainer.innerHTML = '';
        }
    }

    // Create pagination dots
    function createPaginationDots() {
        // Clear existing dots
        paginationContainer.innerHTML = '';

        // Calculate how many cards are visible at once
        const containerWidth = projectsGrid.offsetWidth;
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(getComputedStyle(projectsGrid).gap) || 32;
        const cardsPerView = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Create dots
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'projects-pagination-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.addEventListener('click', () => scrollToPage(i, cardWidth, gap, cardsPerView));
            paginationContainer.appendChild(dot);
        }
    }

    // Scroll to specific page
    function scrollToPage(pageIndex, cardWidth, gap, cardsPerView) {
        const containerWidth = projectsGrid.offsetWidth;
        const scrollWidth = projectsGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Calculate scroll position based on page index
        const scrollPercentage = totalPages > 1 ? pageIndex / (totalPages - 1) : 0;
        const scrollPosition = scrollPercentage * maxScroll;

        projectsGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
        const dots = paginationContainer.querySelectorAll('.projects-pagination-dot');
        if (dots.length === 0) return;

        const containerWidth = projectsGrid.offsetWidth;
        const scrollLeft = projectsGrid.scrollLeft;
        const scrollWidth = projectsGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;

        // Calculate which page we're on based on scroll percentage
        const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const currentPage = Math.min(
            Math.round(scrollPercentage * (dots.length - 1)),
            dots.length - 1
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // Initial check with delay to ensure layout is rendered
    setTimeout(() => {
        checkOverflow();
    }, 100);

    // Recheck on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkOverflow();
            if (paginationContainer.classList.contains('active')) {
                createPaginationDots();
            }
        }, 250);
    });

    // Update active dot on scroll
    projectsGrid.addEventListener('scroll', updateActiveDot);
}

// Testimonials Horizontal Slider with Pagination Dots
function initTestimonialsSlider() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const paginationContainer = document.getElementById('testimonialsPagination');

    if (!testimonialsGrid || !paginationContainer) {
        return; // Exit if elements don't exist
    }

    const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
    if (cards.length === 0) {
        return;
    }

    // Check if content overflows
    function checkOverflow() {
        const containerWidth = testimonialsGrid.offsetWidth;
        const scrollWidth = testimonialsGrid.scrollWidth;
        const hasOverflow = scrollWidth > containerWidth;

        if (hasOverflow) {
            paginationContainer.classList.add('active');
            createPaginationDots();
        } else {
            paginationContainer.classList.remove('active');
            paginationContainer.innerHTML = '';
        }
    }

    // Create pagination dots
    function createPaginationDots() {
        // Clear existing dots
        paginationContainer.innerHTML = '';

        // Calculate how many cards are visible at once
        const containerWidth = testimonialsGrid.offsetWidth;
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(getComputedStyle(testimonialsGrid).gap) || 32;
        const cardsPerView = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Create dots
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonials-pagination-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.addEventListener('click', () => scrollToPage(i, cardWidth, gap, cardsPerView));
            paginationContainer.appendChild(dot);
        }
    }

    // Scroll to specific page
    function scrollToPage(pageIndex, cardWidth, gap, cardsPerView) {
        const containerWidth = testimonialsGrid.offsetWidth;
        const scrollWidth = testimonialsGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Calculate scroll position based on page index
        const scrollPercentage = totalPages > 1 ? pageIndex / (totalPages - 1) : 0;
        const scrollPosition = scrollPercentage * maxScroll;

        testimonialsGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
        const dots = paginationContainer.querySelectorAll('.testimonials-pagination-dot');
        if (dots.length === 0) return;

        const containerWidth = testimonialsGrid.offsetWidth;
        const scrollLeft = testimonialsGrid.scrollLeft;
        const scrollWidth = testimonialsGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;

        // Calculate which page we're on based on scroll percentage
        const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const currentPage = Math.min(
            Math.round(scrollPercentage * (dots.length - 1)),
            dots.length - 1
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // Initial check with delay to ensure layout is rendered
    setTimeout(() => {
        checkOverflow();
    }, 100);

    // Recheck on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkOverflow();
            if (paginationContainer.classList.contains('active')) {
                createPaginationDots();
            }
        }, 250);
    });

    // Update active dot on scroll
    testimonialsGrid.addEventListener('scroll', updateActiveDot);
}

// Personality Horizontal Slider with Pagination Dots
function initPersonalitySlider() {
    const personalityGrid = document.getElementById('personalityGrid');
    const paginationContainer = document.getElementById('personalityPagination');

    if (!personalityGrid || !paginationContainer) {
        return; // Exit if elements don't exist
    }

    const cards = personalityGrid.querySelectorAll('.personality-card');
    if (cards.length === 0) {
        return;
    }

    // Check if content overflows
    function checkOverflow() {
        const containerWidth = personalityGrid.offsetWidth;
        const scrollWidth = personalityGrid.scrollWidth;
        const hasOverflow = scrollWidth > containerWidth;

        if (hasOverflow) {
            paginationContainer.classList.add('active');
            createPaginationDots();
        } else {
            paginationContainer.classList.remove('active');
            paginationContainer.innerHTML = '';
        }
    }

    // Create pagination dots
    function createPaginationDots() {
        // Clear existing dots
        paginationContainer.innerHTML = '';

        // Calculate how many cards are visible at once
        const containerWidth = personalityGrid.offsetWidth;
        const firstCard = cards[0];
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(getComputedStyle(personalityGrid).gap) || 32;
        const cardsPerView = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Create dots
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'personality-pagination-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.addEventListener('click', () => scrollToPage(i, cardWidth, gap, cardsPerView));
            paginationContainer.appendChild(dot);
        }
    }

    // Scroll to specific page
    function scrollToPage(pageIndex, cardWidth, gap, cardsPerView) {
        const containerWidth = personalityGrid.offsetWidth;
        const scrollWidth = personalityGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;
        const totalPages = Math.ceil(cards.length / cardsPerView);

        // Calculate scroll position based on page index
        const scrollPercentage = totalPages > 1 ? pageIndex / (totalPages - 1) : 0;
        const scrollPosition = scrollPercentage * maxScroll;

        personalityGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
        const dots = paginationContainer.querySelectorAll('.personality-pagination-dot');
        if (dots.length === 0) return;

        const containerWidth = personalityGrid.offsetWidth;
        const scrollLeft = personalityGrid.scrollLeft;
        const scrollWidth = personalityGrid.scrollWidth;
        const maxScroll = scrollWidth - containerWidth;

        // Calculate which page we're on based on scroll percentage
        const scrollPercentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const currentPage = Math.min(
            Math.round(scrollPercentage * (dots.length - 1)),
            dots.length - 1
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // Initial check with delay to ensure layout is rendered
    setTimeout(() => {
        checkOverflow();
    }, 100);

    // Recheck on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkOverflow();
            if (paginationContainer.classList.contains('active')) {
                createPaginationDots();
            }
        }, 250);
    });

    // Update active dot on scroll
    personalityGrid.addEventListener('scroll', updateActiveDot);
}

// Initialize sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLearningTracksSlider();
    initProjectsSlider();
    initTestimonialsSlider();
    initPersonalitySlider();
});

// Handle hash navigation when coming from another page
let hashNavigationAttempts = 0;
const MAX_HASH_NAVIGATION_ATTEMPTS = 5;

function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash && hashNavigationAttempts < MAX_HASH_NAVIGATION_ATTEMPTS) {
        const sectionId = hash.substring(1); // Remove the #
        const element = document.getElementById(sectionId);

        if (element) {
            // Element found, scroll to it
            hashNavigationAttempts = 0; // Reset counter
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 300); // Increased delay for deployed sites
        } else {
            // Element not found yet, try again after a longer delay
            hashNavigationAttempts++;
            setTimeout(() => {
                handleHashNavigation();
            }, 500);
        }
    } else {
        // Reset attempts after max tries
        hashNavigationAttempts = 0;
    }
}

// Handle hash navigation on page load
document.addEventListener('DOMContentLoaded', function () {
    handleHashNavigation();
});

// Also handle hash navigation after window loads (for slower connections)
window.addEventListener('load', function () {
    if (window.location.hash) {
        setTimeout(() => {
            handleHashNavigation();
        }, 100);
    }
});

// Handle hash changes (when user clicks links while on the same page)
window.addEventListener('hashchange', function () {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        scrollToSection(sectionId);
    }
});

// Curriculum Modal Functions
window.openCurriculum = function () {
    console.log('openCurriculum called');
    const modal = document.getElementById('curriculumModal');
    if (modal) {
        console.log('Modal found, displaying...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.error('curriculumModal not found!');
    }
}

window.closeCurriculum = function () {
    const modal = document.getElementById('curriculumModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// BotIQ Explorers Curriculum Modal Functions
window.openBeginnerCurriculum = function () {
    console.log('openBeginnerCurriculum called');
    const modal = document.getElementById('beginnerCurriculumModal');
    if (modal) {
        console.log('Modal found, displaying...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.error('beginnerCurriculumModal not found!');
    }
}

window.closeBeginnerCurriculum = function () {
    const modal = document.getElementById('beginnerCurriculumModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// BotIQ Inventors Curriculum Modal Functions
window.openFutureCurriculum = function () {
    console.log('openFutureCurriculum called');
    const modal = document.getElementById('futureCurriculumModal');
    if (modal) {
        console.log('Modal found, displaying...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.error('futureCurriculumModal not found!');
    }
}

window.closeFutureCurriculum = function () {
    const modal = document.getElementById('futureCurriculumModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// BotIQ Engineers Curriculum Modal Functions
window.openEngineersCurriculum = function () {
    console.log('openEngineersCurriculum called');
    const modal = document.getElementById('engineersCurriculumModal');
    if (modal) {
        console.log('Modal found, displaying...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.error('engineersCurriculumModal not found!');
    }
}

window.closeEngineersCurriculum = function () {
    const modal = document.getElementById('engineersCurriculumModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    const curriculumModal = document.getElementById('curriculumModal');
    const beginnerModal = document.getElementById('beginnerCurriculumModal');
    const futureModal = document.getElementById('futureCurriculumModal');
    const engineersModal = document.getElementById('engineersCurriculumModal');

    if (event.target === curriculumModal) {
        closeCurriculum();
    }
    if (event.target === beginnerModal) {
        closeBeginnerCurriculum();
    }
    if (event.target === futureModal) {
        closeFutureCurriculum();
    }
    if (event.target === engineersModal) {
        closeEngineersCurriculum();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeCurriculum();
        closeBeginnerCurriculum();
        closeFutureCurriculum();
        closeEngineersCurriculum();
    }
});
