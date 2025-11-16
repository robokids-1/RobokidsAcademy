// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add click handlers to navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
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
    const cards = document.querySelectorAll('.class-card, .project-card, .contact-card');
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

    // Only initialize if slides exist (slideshow is only on index.html, not enroll.html)
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

// Curriculum Modal Functions
function openCurriculum() {
    const modal = document.getElementById('curriculumModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCurriculum() {
    const modal = document.getElementById('curriculumModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('curriculumModal');
    if (event.target === modal) {
        closeCurriculum();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeCurriculum();
    }
});
