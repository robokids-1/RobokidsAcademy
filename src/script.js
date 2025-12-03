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

// X-Bots Beginners Curriculum Modal Functions
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

// X-Innovators Curriculum Modal Functions
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

// X-Engineers Curriculum Modal Functions
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
