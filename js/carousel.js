// Carousel functionality for hero section
class HeroCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.isPlaying = true;
        this.intervalTime = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start autoplay
        this.startAutoplay();
        
        // Handle visibility change (pause when tab is not active)
        this.handleVisibilityChange();
        
        // Handle mouse enter/leave for pause/resume
        this.handleMouseEvents();
        
        // Handle touch events for mobile swipe
        this.handleTouchEvents();
        
        // Handle keyboard navigation
        this.handleKeyboardEvents();
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
        this.restartAutoplay();
    }
    
    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.restartAutoplay();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.restartAutoplay();
    }
    
    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Add entrance animation
        const activeSlide = this.slides[this.currentSlide];
        if (activeSlide) {
            activeSlide.style.animation = 'none';
            activeSlide.offsetHeight; // Trigger reflow
            activeSlide.style.animation = 'fadeIn 1s ease-in-out';
        }
    }
    
    startAutoplay() {
        this.stopAutoplay();
        if (this.isPlaying) {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, this.intervalTime);
        }
    }
    
    stopAutoplay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    restartAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    pauseAutoplay() {
        this.isPlaying = false;
        this.stopAutoplay();
    }
    
    resumeAutoplay() {
        this.isPlaying = true;
        this.startAutoplay();
    }
    
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    handleMouseEvents() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                this.resumeAutoplay();
            });
        }
    }
    
    handleTouchEvents() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        const threshold = 50; // Minimum distance for swipe
        
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.pauseAutoplay();
        }, { passive: true });
        
        carouselContainer.addEventListener('touchmove', (e) => {
            // Prevent default only if horizontal swipe is detected
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            this.resumeAutoplay();
        }, { passive: true });
    }
    
    handleKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard events when carousel is in focus or no input is focused
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.tagName === 'SELECT'
            );
            
            if (isInputFocused) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    if (this.isPlaying) {
                        this.pauseAutoplay();
                    } else {
                        this.resumeAutoplay();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }
    
    // Method to change autoplay speed
    setAutoplaySpeed(speed) {
        this.intervalTime = speed;
        if (this.isPlaying) {
            this.restartAutoplay();
        }
    }
    
    // Method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.slides.length,
            isPlaying: this.isPlaying
        };
    }
}

// Global functions for HTML onclick handlers
function changeSlide(direction) {
    if (window.heroCarousel) {
        if (direction > 0) {
            window.heroCarousel.nextSlide();
        } else {
            window.heroCarousel.previousSlide();
        }
    }
}

function currentSlide(index) {
    if (window.heroCarousel) {
        window.heroCarousel.goToSlide(index - 1); // Convert to 0-based index
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with a carousel
    if (document.querySelector('.carousel-slide')) {
        window.heroCarousel = new HeroCarousel();
        
        // Add accessibility improvements
        addCarouselAccessibility();
    }
});

// Add accessibility features
function addCarouselAccessibility() {
    const carouselContainer = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carouselContainer) {
        carouselContainer.setAttribute('role', 'region');
        carouselContainer.setAttribute('aria-label', 'Hero image carousel');
    }
    
    if (prevBtn) {
        prevBtn.setAttribute('aria-label', 'Previous slide');
    }
    
    if (nextBtn) {
        nextBtn.setAttribute('aria-label', 'Next slide');
    }
    
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.setAttribute('tabindex', '0');
        
        // Add keyboard support for indicators
        indicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentSlide(index + 1);
            }
        });
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    // Adjust carousel if needed on resize
    if (window.heroCarousel) {
        // Force update to ensure proper display
        window.heroCarousel.updateCarousel();
    }
});

// Preload carousel images for smoother transitions
function preloadCarouselImages() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => {
        const bgImage = getComputedStyle(slide).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
            const img = new Image();
            img.src = imageUrl;
        }
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadCarouselImages);

// Export functions for global access
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
