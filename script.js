// ============================================
// SCROLL PERFORMANCE FIX UNTUK OPPO & ANDROID
// ============================================

// Deteksi device mid-range Android
const isAndroid = /Android/i.test(navigator.userAgent);
const isOppo = /OPPO|CPH\d+/i.test(navigator.userAgent);
const isMidRange = isAndroid && isMobile;

console.log('🔍 Device Specific:', { isAndroid, isOppo, isMidRange });

// ============================================
// FORCE DISABLE PARTICLE CANVAS DI MOBILE
// ============================================
if (isMobile) {
    // Force hide particle canvas
    const particleCanvasEl = document.getElementById('particleCanvas');
    if (particleCanvasEl) {
        particleCanvasEl.style.display = 'none';
        particleCanvasEl.style.visibility = 'hidden';
    }
    
    // Cancel particle animation
    if (typeof particleAnimationId !== 'undefined' && particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
    }
    
    // Clear particles array
    if (typeof particles !== 'undefined') {
        particles = [];
    }
}

// ============================================
// DISABLE SCROLL REVEAL DI MOBILE
// ============================================
if (isMobile) {
    // Remove all reveal animations
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('active');
    });
}

// ============================================
// SCROLL EVENT OPTIMIZATION
// ============================================
// Pause animations while scrolling untuk performa
let scrollTimeout;
let isScrolling = false;

if (isMobile) {
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('scrolling');
        }, 150);
    }, { passive: true });
}

// ============================================
// PAUSE BACKGROUND ANIMATIONS SAAT SCROLL
// ============================================
if (isMobile) {
    const style = document.createElement('style');
    style.textContent = `
        body.scrolling * {
            animation-play-state: paused !important;
        }
        body.scrolling .glow-orb,
        body.scrolling .gold-particle,
        body.scrolling .diamond-particle {
            animation-play-state: paused !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// REMOVE HEAVY EFFECTS ON ANDROID MID-RANGE
// ============================================
if (isMidRange) {
    // Force remove all heavy animations
    const heavyElements = document.querySelectorAll(
        '.cursor-glow, .cursor-sparkle, .particle-canvas, ' +
        '.gold-particle, .diamond-particle, .floating-icons, ' +
        '.animated-border, .glow-orb, .grid-overlay'
    );
    
    heavyElements.forEach(el => {
        if (el) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
        }
    });
    
    console.log('✅ Heavy animations disabled for Android mid-range device');
}

// ============================================
// PASIVE EVENT LISTENERS
// ============================================
// Ganti touch events jadi passive untuk scroll smooth
['touchstart', 'touchmove', 'touchend'].forEach(event => {
    document.addEventListener(event, (e) => {
        // Jangan preventDefault di sini agar scroll smooth
    }, { passive: true });
});

// ============================================
// FIX UNTUK OPPO COLOROS / REALME UI
// ============================================
if (isOppo || /Realme|Xiaomi|Vivo|Samsung/i.test(navigator.userAgent)) {
    // Force disable backdrop-filter
    document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backdropFilter || style.webkitBackdropFilter) {
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
        }
    });
    
    console.log('✅ ColorOS/MIUI/FuntouchOS optimization applied');
}

// ============================================
// DEBOUNCE RESIZE UNTUK SCROLL SMOOTH
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Update isMobile status
        const nowMobile = window.innerWidth <= 768;
        if (nowMobile !== isMobile) {
            location.reload();
        }
    }, 300);
}, { passive: true });

// ============================================
// FORCE REDUCE ANIMATION ON LOW FPS
// ============================================
if (isMobile) {
    let frameCount = 0;
    let lastCheck = performance.now();
    
    function monitorFPS() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastCheck >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastCheck = now;
            
            // Kalau FPS di bawah 40, aktifkan mode minimal
            if (fps < 40) {
                console.log('⚠️ Low FPS (' + fps + '), activating minimal mode');
                document.body.classList.add('low-fps');
                
                // Force remove all animations
                const style = document.createElement('style');
                style.id = 'low-fps-style';
                style.textContent = `
                    * {
                        animation: none !important;
                        transition: none !important;
                    }
                    .form-card,
                    .feature-item,
                    .stats-section,
                    .upload-area,
                    .checkbox-wrapper {
                        transition: border-color 0.2s ease, background 0.2s ease !important;
                    }
                    .toast {
                        transition: transform 0.3s ease, opacity 0.3s ease !important;
                    }
                `;
                
                if (!document.getElementById('low-fps-style')) {
                    document.head.appendChild(style);
                }
            }
        }
        
        requestAnimationFrame(monitorFPS);
    }
    
    // Mulai monitor setelah 5 detik
    setTimeout(() => requestAnimationFrame(monitorFPS), 5000);
}

// ============================================
// SCROLL TO TOP SAAT GANTI STEP
// ============================================
// Override scrollIntoView untuk lebih smooth di mobile
const originalScrollIntoView = Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView = function(options) {
    if (isMobile) {
        // Pakai window.scrollTo dengan offset untuk mobile
        const rect = this.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = scrollTop + rect.top - 80; // Offset 80px dari atas
        
        window.scrollTo({
            top: targetY,
            behavior: 'auto' // Instant untuk hindari lag
        });
    } else {
        originalScrollIntoView.call(this, options);
    }
};

// ============================================
// LAZY LOAD UNTUK ELEMEN
// ============================================
if (isMobile && 'IntersectionObserver' in window) {
    // Reduce paint untuk elemen off-screen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'auto';
            } else {
                entry.target.style.willChange = 'auto';
                // Force layer isolation
                if (entry.target.classList.contains('form-card')) {
                    entry.target.style.contain = 'layout style';
                }
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    document.querySelectorAll('.feature-item, .form-group, .stats-section').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// LOG FINAL OPTIMIZATION STATUS
// ============================================
console.log('✅ Scroll optimization loaded:', {
    device: isOppo ? 'OPPO' : (isAndroid ? 'Android' : 'Other'),
    mode: isMobile ? 'MOBILE' : 'DESKTOP',
    performance: 'OPTIMIZED',
    scrollFix: 'ACTIVE'
});
