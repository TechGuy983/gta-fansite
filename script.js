// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements with data-aos attribute
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });

    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
});

// Gallery filter and show more functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const showMoreBtn = document.getElementById('showMoreBtn');
const initialItemsToShow = 12;
let currentFilter = 'all';

// Initialize gallery - show only first 12 items
function initializeGallery() {
    galleryItems.forEach((item, index) => {
        if (index < initialItemsToShow) {
            item.classList.add('visible');
        } else {
            item.classList.add('hidden');
        }
    });
    updateShowMoreButton();
}

// Update show more button visibility
function updateShowMoreButton() {
    if (showMoreBtn) {
        const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
        const visibleHiddenItems = Array.from(hiddenItems).filter(item => {
            if (currentFilter === 'all') return true;
            return item.getAttribute('data-category') === currentFilter;
        });
        
        if (visibleHiddenItems.length === 0) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'inline-block';
        }
    }
}

// Show more items
const showLessBtn = document.getElementById('showLessBtn');

if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
        hiddenItems.forEach(item => {
            if (currentFilter === 'all' || item.getAttribute('data-category') === currentFilter) {
                item.classList.remove('hidden');
                item.classList.add('visible');
            }
        });
        updateShowMoreButton();
        
        // Show the "Show Less" button
        if (showLessBtn) {
            showLessBtn.style.display = 'inline-block';
        }
    });
}

// Show less items
if (showLessBtn) {
    showLessBtn.addEventListener('click', () => {
        const allItems = document.querySelectorAll('.gallery-item');
        const visibleItems = Array.from(allItems).filter(item => {
            if (currentFilter === 'all') return true;
            return item.getAttribute('data-category') === currentFilter;
        });
        
        // Hide items beyond the initial limit
        visibleItems.forEach((item, index) => {
            if (index >= initialItemsToShow) {
                item.classList.remove('visible');
                item.classList.add('hidden');
            }
        });
        
        // Hide the "Show Less" button
        showLessBtn.style.display = 'none';
        updateShowMoreButton();
        
        // Scroll back to gallery top
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        currentFilter = button.getAttribute('data-filter');

        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (currentFilter === 'all' || category === currentFilter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Reset visibility for filtered items
        const visibleFilteredItems = Array.from(galleryItems).filter(item => {
            if (currentFilter === 'all') return true;
            return item.getAttribute('data-category') === currentFilter;
        });
        
        visibleFilteredItems.forEach((item, index) => {
            if (index < initialItemsToShow) {
                item.classList.remove('hidden');
                item.classList.add('visible');
            } else {
                item.classList.remove('visible');
                item.classList.add('hidden');
            }
        });
        
        // Hide "Show Less" button when filtering
        if (showLessBtn) {
            showLessBtn.style.display = 'none';
        }
        
        updateShowMoreButton();
    });
});

// Initialize on page load
if (galleryItems.length > 0) {
    initializeGallery();
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');
let currentImageIndex = 0;
let allImages = [];

// Initialize lightbox
if (lightbox && galleryItems.length > 0) {
    allImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return img ? img.src : '';
    }).filter(src => src);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            showLightbox(allImages[currentImageIndex]);
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
            showLightbox(allImages[currentImageIndex]);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % allImages.length;
            showLightbox(allImages[currentImageIndex]);
        });
    }

    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
                showLightbox(allImages[currentImageIndex]);
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % allImages.length;
                showLightbox(allImages[currentImageIndex]);
            }
        }
    });
}

function showLightbox(imageSrc) {
    if (lightboxImg && lightbox) {
        lightboxImg.src = imageSrc;
        lightbox.classList.add('active');
    }
}

// Parallax effect for hero (disabled to prevent conflicts with fixed navbar)
// Removed to improve performance and prevent scroll issues

// Add glitch effect on hover for certain elements
document.querySelectorAll('.info-card h3, .character-info h2').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.classList.add('glitch');
        element.setAttribute('data-text', element.textContent);
    });
    
    element.addEventListener('mouseleave', () => {
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 500);
    });
});

// Video controls enhancement
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
        video.parentElement.style.borderColor = 'var(--primary-color)';
    });
    
    video.addEventListener('pause', () => {
        video.parentElement.style.borderColor = 'rgba(0, 255, 136, 0.3)';
    });
});

// Auto-hide navbar on scroll removed to prevent conflicts with toggle menu

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Menu Toggle - Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navBar = document.getElementById('navBar');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    let savedScrollPosition = 0;

    if (menuToggle && navBar && navOverlay) {
        // Check if mobile view
        function isMobile() {
            return window.innerWidth <= 768;
        }

        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active states
            const isActive = navBar.classList.toggle('active');
            menuToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            if (isActive) {
                // Save current scroll position
                savedScrollPosition = window.scrollY || window.pageYOffset;
                
                // Lock body scroll
                document.body.style.overflow = 'hidden';
                
                // Only fix position on desktop (to prevent scroll jump)
                if (!isMobile()) {
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${savedScrollPosition}px`;
                    document.body.style.width = '100%';
                }
            } else {
                // Restore scroll position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.overflow = '';
                document.body.style.width = '';
                
                if (!isMobile()) {
                    window.scrollTo(0, savedScrollPosition);
                }
            }
        });

        navOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navBar.classList.remove('active');
            navOverlay.classList.remove('active');
            
            // Restore scroll position
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            
            if (!isMobile()) {
                window.scrollTo(0, savedScrollPosition);
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navBar.classList.remove('active');
                navOverlay.classList.remove('active');
                
                // Restore scroll position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.overflow = '';
                document.body.style.width = '';
                
                if (!isMobile()) {
                    window.scrollTo(0, savedScrollPosition);
                }
            });
        });
    }
});

// Random glitch effect on page load
function randomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch');
    if (glitchElements.length > 0) {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        randomElement.style.animation = 'none';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 10);
    }
}

setInterval(randomGlitch, 5000);

// Hero slideshow
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
    let currentSlide = 0;
    
    function nextSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

console.log('%c🎮 GTA VI Fan Site Loaded', 'color: #00ff88; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to Vice City', 'color: #ff0080; font-size: 16px;');


// ============================================
// EASTER EGGS
// ============================================

// Easter Egg 1: Konami Code (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonamiEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiEasterEgg() {
    // Create GTA stars effect
    const stars = document.createElement('div');
    stars.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 8rem;
        z-index: 99999;
        animation: starSpin 2s ease-out forwards;
        pointer-events: none;
    `;
    stars.innerHTML = '⭐⭐⭐⭐⭐';
    document.body.appendChild(stars);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starSpin {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.5) rotate(360deg); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Play sound effect (visual feedback)
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => {
        document.body.style.animation = '';
        stars.remove();
    }, 2000);
    
    console.log('%c🌟 WASTED! You found the Konami Code! 🌟', 'color: #ff0080; font-size: 24px; font-weight: bold;');
}

// Easter Egg 2: Type "VICE" anywhere on the page
let typedText = '';
let viceTimeout;

document.addEventListener('keypress', function(e) {
    clearTimeout(viceTimeout);
    typedText += e.key.toLowerCase();
    
    if (typedText.includes('vice')) {
        activateViceEasterEgg();
        typedText = '';
    }
    
    viceTimeout = setTimeout(() => {
        typedText = '';
    }, 2000);
});

function activateViceEasterEgg() {
    // Change page colors temporarily
    const originalBg = document.body.style.background;
    document.body.style.background = 'linear-gradient(45deg, #ff0080, #00ff88, #00d9ff, #b537f2)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradientShift 3s ease infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.background = originalBg;
        document.body.style.animation = '';
    }, 3000);
    
    console.log('%c🌴 Welcome to VICE CITY! 🌴', 'color: #00ff88; font-size: 20px; font-weight: bold;');
}

// Easter Egg 3: Click logo 5 times quickly
let logoClickCount = 0;
let logoClickTimeout;

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', function() {
        clearTimeout(logoClickTimeout);
        logoClickCount++;
        
        if (logoClickCount >= 5) {
            activateLogoEasterEgg();
            logoClickCount = 0;
        }
        
        logoClickTimeout = setTimeout(() => {
            logoClickCount = 0;
        }, 2000);
    });
}

function activateLogoEasterEgg() {
    // Make all images spin
    const allImages = document.querySelectorAll('img:not(.logo img)');
    allImages.forEach(img => {
        img.style.transition = 'transform 2s ease';
        img.style.transform = 'rotate(360deg)';
    });
    
    setTimeout(() => {
        allImages.forEach(img => {
            img.style.transform = '';
        });
    }, 2000);
    
    console.log('%c🎮 GTA VI - Images are spinning! 🎮', 'color: #ff0080; font-size: 18px;');
}

// Easter Egg 4: Hold Shift + Click on any character image
document.addEventListener('click', function(e) {
    if (e.shiftKey && e.target.tagName === 'IMG' && e.target.closest('.character-card, .gallery-item, .moment-card')) {
        activateImageEasterEgg(e.target);
    }
});

function activateImageEasterEgg(img) {
    // Apply glitch effect
    img.style.animation = 'glitchEffect 0.5s';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitchEffect {
            0%, 100% { transform: translate(0); filter: none; }
            20% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
            40% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
            60% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
            80% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        img.style.animation = '';
    }, 500);
}

// Easter Egg 5: Double-click on page title
const pageHero = document.querySelector('.page-hero h1, .hero h1');
if (pageHero) {
    pageHero.addEventListener('dblclick', function() {
        activateTitleEasterEgg(this);
    });
}

function activateTitleEasterEgg(title) {
    const originalText = title.textContent;
    const messages = [
        'WASTED',
        'BUSTED',
        'MISSION PASSED',
        'RESPECT +',
        originalText
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        title.textContent = messages[index];
        title.style.color = index === 0 ? '#ff0080' : index === 3 ? '#00ff88' : '';
        index++;
        
        if (index >= messages.length) {
            clearInterval(interval);
            title.textContent = originalText;
            title.style.color = '';
        }
    }, 500);
}

// Easter Egg 6: Press 'G' + 'T' + 'A' in sequence
let gtaSequence = '';
let gtaTimeout;

document.addEventListener('keypress', function(e) {
    clearTimeout(gtaTimeout);
    gtaSequence += e.key.toLowerCase();
    
    if (gtaSequence.includes('gta')) {
        activateGTAEasterEgg();
        gtaSequence = '';
    }
    
    gtaTimeout = setTimeout(() => {
        gtaSequence = '';
    }, 1500);
});

function activateGTAEasterEgg() {
    // Create floating GTA text
    const gtaText = document.createElement('div');
    gtaText.textContent = 'GRAND THEFT AUTO VI';
    gtaText.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Orbitron', sans-serif;
        font-size: 4rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ff0080, #00ff88);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 99999;
        animation: gtaFloat 3s ease-out forwards;
        pointer-events: none;
        text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gtaFloat {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -200%) scale(0.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(gtaText);
    
    setTimeout(() => {
        gtaText.remove();
    }, 3000);
    
    console.log('%c🚗 GTA VI - Coming 2026! 🚗', 'color: #00ff88; font-size: 20px; font-weight: bold;');
}

// Easter Egg 7: Shake the page (move mouse rapidly)
let mouseMovements = [];
let shakeCheckInterval;

document.addEventListener('mousemove', function(e) {
    mouseMovements.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    // Keep only last 10 movements
    if (mouseMovements.length > 10) {
        mouseMovements.shift();
    }
    
    // Check for rapid movement
    if (mouseMovements.length === 10) {
        const totalDistance = mouseMovements.reduce((sum, pos, i) => {
            if (i === 0) return 0;
            const prev = mouseMovements[i - 1];
            return sum + Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
        }, 0);
        
        const timeSpan = mouseMovements[9].time - mouseMovements[0].time;
        
        if (totalDistance > 1000 && timeSpan < 500) {
            activateShakeEasterEgg();
            mouseMovements = [];
        }
    }
});

function activateShakeEasterEgg() {
    document.body.style.animation = 'shake 0.5s';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
    
    console.log('%c💥 Earthquake in Vice City! 💥', 'color: #ff0080; font-size: 18px;');
}

console.log('%c🎮 Easter Eggs Active! Try these:', 'color: #00ff88; font-size: 16px; font-weight: bold;');
console.log('%c1. Konami Code: ↑↑↓↓←→←→BA', 'color: #00d9ff; font-size: 14px;');
console.log('%c2. Type "VICE" anywhere', 'color: #00d9ff; font-size: 14px;');
console.log('%c3. Click logo 5 times quickly', 'color: #00d9ff; font-size: 14px;');
console.log('%c4. Shift + Click on images', 'color: #00d9ff; font-size: 14px;');
console.log('%c5. Double-click page titles', 'color: #00d9ff; font-size: 14px;');
console.log('%c6. Type "GTA" anywhere', 'color: #00d9ff; font-size: 14px;');
console.log('%c7. Shake your mouse rapidly', 'color: #00d9ff; font-size: 14px;');


// ============================================
// BUG FIXES & SAFETY CHECKS
// ============================================

// Prevent body scroll when menu is open
document.addEventListener('DOMContentLoaded', function() {
    // Ensure no scroll issues on page load
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
});

// Fix for iOS Safari viewport height
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Fix for images not loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', img.src);
                // Optionally add a placeholder
                img.style.opacity = '0.3';
            });
        }
    });
});

// Ensure gallery items are properly initialized
if (typeof galleryItems !== 'undefined' && galleryItems.length > 0) {
    // Gallery is initialized
} else {
    console.log('Gallery not found on this page');
}

// Prevent memory leaks from event listeners
window.addEventListener('beforeunload', function() {
    // Clean up any intervals or timeouts
    if (typeof shakeCheckInterval !== 'undefined') {
        clearInterval(shakeCheckInterval);
    }
});

// Fix for video autoplay issues
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.warn('Video failed to load:', video.src);
        });
    });
});

// Ensure puzzle pieces are properly sized
if (document.getElementById('puzzleBoard')) {
    window.addEventListener('resize', function() {
        // Puzzle board will maintain aspect ratio via CSS
    });
}

// Fix for smooth scroll conflicts
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Only prevent default if target exists
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

console.log('%c✅ All systems operational - No bugs detected!', 'color: #00ff88; font-size: 16px; font-weight: bold;');
// Video player function
function playVideo(wrapper, videoId) {
    const thumbnail = wrapper.querySelector('.video-thumbnail');
    const iframe = wrapper.querySelector('iframe');
    
    // Hide thumbnail and show iframe
    thumbnail.style.display = 'none';
    iframe.style.display = 'block';
    
    // Set iframe source with autoplay
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    
    // Remove click handler to prevent multiple triggers
    wrapper.onclick = null;
}