// Main JavaScript functionality for Community Worker website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeScrollToTop();
    initializeServiceFiltering();
    initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Update active nav link based on current page
    updateActiveNavLink();

    // Handle navbar scroll behavior
    handleNavbarScroll();
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            // Add/remove sticky class based on scroll position
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animation functionality
function initializeAnimations() {
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('grid-container')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(`
        .slide-in-left,
        .slide-in-right,
        .slide-in-up,
        .fade-in,
        .hover-lift,
        .feature-card,
        .service-card,
        .provider-card,
        .problem-card,
        .value-card,
        .about-section,
        .goal-item
    `);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add parallax effect to hero background
    initializeParallax();
}

function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button if it doesn't exist
    let scrollTopBtn = document.querySelector('.scroll-top');
    
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopBtn);
    }

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Service filtering functionality (for services page)
function initializeServiceFiltering() {
    const serviceFilter = document.getElementById('service-filter');
    const searchInput = document.getElementById('search-input');
    
    if (serviceFilter) {
        serviceFilter.addEventListener('change', filterProviders);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchProviders, 300));
    }
}

function filterProviders() {
    const filterValue = document.getElementById('service-filter').value.toLowerCase();
    const providerCards = document.querySelectorAll('.provider-card');
    let visibleCount = 0;

    providerCards.forEach(card => {
        const serviceType = card.getAttribute('data-service');
        
        if (filterValue === 'all' || serviceType === filterValue) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });

    // Show/hide no results message
    updateNoResultsMessage(visibleCount);
}

function searchProviders() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const providerCards = document.querySelectorAll('.provider-card');
    let visibleCount = 0;

    providerCards.forEach(card => {
        const providerName = card.querySelector('.provider-name').textContent.toLowerCase();
        const providerAddress = card.querySelector('.provider-address span').textContent.toLowerCase();
        const providerService = card.querySelector('.provider-service span').textContent.toLowerCase();
        
        const matchesSearch = providerName.includes(searchTerm) || 
                            providerAddress.includes(searchTerm) || 
                            providerService.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });

    // Show/hide no results message
    updateNoResultsMessage(visibleCount);
}

function updateNoResultsMessage(visibleCount) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No providers found</h3>
                    <p>Try adjusting your search criteria or filter options.</p>
                </div>
            `;
            document.querySelector('.providers-grid').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global functions for HTML onclick handlers
window.filterProviders = filterProviders;
window.searchProviders = searchProviders;

// Handle page visibility changes (pause animations when tab is not active)
document.addEventListener('visibilitychange', function() {
    const animatedElements = document.querySelectorAll('.animate, .fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
    
    if (document.hidden) {
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://pixabay.com/get/g49be18a6d47869c83e108f67a980f48f2f1cdbf73ce2e5175725ba46916a5e31481465c6f30430ac8ab108548ae45f545bf23cd6901273e1a3be67750273f014_1280.jpg',
        'https://pixabay.com/get/gd8d39fb70489a5c36c6879a95fa8707692001bed804e34607e9d9487a01ca5527c6141b09d35ea8409aa83f102fc7d47de5864274fdc7142fa50e2e178e811c8_1280.jpg',
        'https://pixabay.com/get/g0bba9ac8a9f4528024bb4e092639c59e40bbbd80a26651fcc3bc130dedfcb40009cb1c05bf9779e14ee2d7198882a8b02db490bc76df21ad410ffda3b0fb6667_1280.jpg',
        'https://pixabay.com/get/gcaca78c4e9f0ada9288ab7f9115ee85bf44dbaa18a99d2a813a8013d512c6437ee3e1e7582b8febabf162b97b2cd6fc85e206884e5653bafb8faa21a6ea47aef_1280.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();
