// ============================================
// KONFIGURASI
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// ============================================
// DEVICE DETECTION
// ============================================
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowEnd = isMobile && (navigator.hardwareConcurrency || 4) <= 4;
const isAndroid = /Android/i.test(navigator.userAgent);
const isOppo = /OPPO|CPH\d+/i.test(navigator.userAgent);

if (isMobile) document.body.classList.add('is-mobile');
if (isTouchDevice) document.body.classList.add('is-touch');
if (isLowEnd) document.body.classList.add('is-low-end');

console.log('📱 Device Info:', {
    isMobile, isTouchDevice, isLowEnd, isAndroid, isOppo,
    cores: navigator.hardwareConcurrency,
    screen: `${window.innerWidth}x${window.innerHeight}`
});

// ============================================
// ELEMENTS
// ============================================
const form = document.getElementById('dataForm');
const fileInput = document.getElementById('foto');
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewContent = document.getElementById('previewContent');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const cursorSparkle = document.getElementById('cursorSparkle');
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');

let selectedFile = null;
let currentStep = 1;
const totalSteps = 3;

// ============================================
// HAPTIC FEEDBACK
// ============================================
function haptic(pattern = 10) {
    if ('vibrate' in navigator && isMobile) {
        try { navigator.vibrate(pattern); } catch (e) {}
    }
}

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            loadingBar.style.width = '100%';
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                triggerReveal();
                startCounters();
            }, 500);
        } else {
            loadingBar.style.width = progress + '%';
        }
    }, 150);
});

document.body.style.overflow = 'hidden';

// ============================================
// TYPING EFFECT
// ============================================
const typingText = document.getElementById('typingText');
const words = ['Siswa', 'Premium', 'Mewah', 'Royal'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 60 : 120;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 1500);

// ============================================
// LIVE CLOCK
// ============================================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const clockEl = document.getElementById('liveClock');
    const dateEl = document.getElementById('liveDate');
    
    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

// ============================================
// CURSOR EFFECTS - DESKTOP ONLY
// ============================================
if (!isMobile && !isTouchDevice && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorSparkle) {
            cursorSparkle.style.left = mouseX + 'px';
            cursorSparkle.style.top = mouseY + 'px';
            cursorSparkle.classList.add('active');
        }
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
    
    document.addEventListener('mouseleave', () => {
        if (cursorGlow) cursorGlow.style.opacity = '0';
        if (cursorSparkle) cursorSparkle.classList.remove('active');
    });
    
    document.addEventListener('mouseenter', () => {
        if (cursorGlow) cursorGlow.style.opacity = '1';
        if (cursorSparkle) cursorSparkle.classList.add('active');
    });
}

// ============================================
// PARTICLE NETWORK - WORKS ON MOBILE + DESKTOP
// ============================================
const particleCanvas = document.getElementById('particleCanvas');
const ctx = particleCanvas ? particleCanvas.getContext('2d', {
    alpha: true,
    desynchronized: isMobile // Better performance on mobile
}) : null;

let particles = [];
let particleAnimationId = null;

function resizeCanvas() {
    if (!particleCanvas) return;
    
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
    
    particleCanvas.width = window.innerWidth * dpr;
    particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = window.innerWidth + 'px';
    particleCanvas.style.height = window.innerHeight + 'px';
    
    if (dpr > 1) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
}

function getParticleCount() {
    if (!isMobile) {
        // Desktop - banyak partikel
        return Math.min(Math.floor(window.innerWidth / 25), 50);
    }
    
    // Mobile - adaptive
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    
    let score = 0;
    if (cores >= 8) score += 3;
    else if (cores >= 6) score += 2;
    else if (cores >= 4) score += 1;
    
    if (memory >= 6) score += 3;
    else if (memory >= 4) score += 2;
    else if (memory >= 2) score += 1;
    
    if (isLowEnd) return 8;
    if (score >= 5) return 18;
    if (score >= 3) return 14;
    if (score >= 2) return 10;
    return 8;
}

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.5 ? '#ca8a04' : '#dc2626';
        this.alpha = Math.random() * 0.3 + 0.3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
        
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
    }
}

function initParticles() {
    if (!ctx) return;
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
    console.log(`✨ Created ${count} particles (${isMobile ? 'mobile' : 'desktop'})`);
}

function connectParticles() {
    if (!ctx) return;
    
    const distance = isMobile ? 90 : 100;
    const maxOpacity = isMobile ? 0.35 : 0.15;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < distance * distance) {
                const dist = Math.sqrt(distSq);
                const opacity = (1 - dist / distance) * maxOpacity;
                
                ctx.beginPath();
                ctx.strokeStyle = `rgba(202, 138, 4, ${opacity})`;
                ctx.lineWidth = isMobile ? 0.6 : 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// FPS limiting
let lastFrameTime = 0;
const FRAME_INTERVAL = isMobile ? (1000 / 24) : (1000 / 60); // 24 FPS mobile, 60 FPS desktop

// Pause states
let isScrolling = false;
let isPageVisible = true;
let scrollTimer;

function animateParticles(timestamp) {
    if (!ctx) return;
    
    particleAnimationId = requestAnimationFrame(animateParticles);
    
    // Skip jika scroll atau tab tidak aktif
    if (isScrolling || !isPageVisible) return;
    
    // FPS limit
    if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = timestamp;
    
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    connectParticles();
}

// Initialize particles
if (particleCanvas && ctx) {
    resizeCanvas();
    initParticles();
    particleAnimationId = requestAnimationFrame(animateParticles);
    console.log('✅ Particle network started');
    
    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 300);
    }, { passive: true });
    
    // Pause on scroll (mobile)
    if (isMobile) {
        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }, { passive: true });
    }
    
    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = progress + '%';
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ============================================
// 3D TILT - DESKTOP ONLY
// ============================================
if (!isMobile && !isTouchDevice) {
    document.querySelectorAll('[data-tilt]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function triggerReveal() {
    const reveals = document.querySelectorAll('.feature-item, .stat-item, .form-card, .info-panel');
    reveals.forEach((el, index) => {
        el.classList.add('reveal');
        setTimeout(() => {
            el.classList.add('active');
        }, index * 100);
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function startCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = isMobile ? 1200 : 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        setTimeout(updateCounter, isMobile ? 400 : 800);
    });
}

// ============================================
// RIPPLE EFFECT
// ============================================
document.querySelectorAll('.submit-btn, .next-btn, .nav-btn, .modal-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = '20px';
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// TAP RIPPLE (Mobile)
// ============================================
if (isMobile) {
    const tappableElements = document.querySelectorAll(
        '.nav-btn, .submit-btn, .modal-btn, .feature-item, ' +
        '.step, .upload-area, .checkbox-wrapper, .next-btn, .prev-btn'
    );
    
    tappableElements.forEach(el => {
        el.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'tap-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = '20px';
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            haptic(15);
        }, { passive: true });
    });
}

// ============================================
// LOGO FALLBACK
// ============================================
const schoolLogo = document.getElementById('schoolLogo');
const logoFallback = document.getElementById('logoFallback');

if (schoolLogo) {
    schoolLogo.addEventListener('error', function() {
        this.style.display = 'none';
        if (logoFallback) logoFallback.style.display = 'flex';
    });
    
    schoolLogo.addEventListener('load', function() {
        if (logoFallback) logoFallback.style.display = 'none';
    });
}

// ============================================
// STEP NAVIGATION
// ============================================
function goToStep(step) {
    if (step > currentStep && !validateStep(currentStep)) return;
    
    const prevStep = currentStep;
    currentStep = step;
    
    document.querySelectorAll('.form-step').forEach((el) => {
        el.classList.remove('active', 'reverse');
        if (parseInt(el.dataset.step) === step) {
            el.classList.add('active');
            if (step < prevStep) el.classList.add('reverse');
        }
    });
    
    document.querySelectorAll('.step').forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        
        if (stepNum === step) {
            el.classList.add('active');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else if (stepNum < step) {
            el.classList.add('completed');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else {
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '100';
        }
    });
    
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index + 1 < step) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
    
    if (step === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }
    
    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
    
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        if (isMobile) {
            const rect = formCard.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({ top: scrollTop + rect.top - 80, behavior: 'auto' });
        } else {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        haptic(15);
        goToStep(currentStep + 1);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        haptic(15);
        goToStep(currentStep - 1);
    }
});

// Step click
if (isMobile) {
    document.querySelectorAll('.step').forEach((stepEl) => {
        stepEl.addEventListener('click', () => {
            const targetStep = parseInt(stepEl.dataset.step);
            if (targetStep === currentStep) return;
            haptic(15);
            
            if (targetStep < currentStep) {
                goToStep(targetStep);
            } else if (targetStep === currentStep + 1) {
                goToStep(targetStep);
            }
        });
    });
}

// ============================================
// SWIPE NAVIGATION
// ============================================
if (isMobile) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    
    const formCard = document.querySelector('.form-card');
    
    if (formCard) {
        formCard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });
        
        formCard.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const deltaY = Math.abs(e.changedTouches[0].screenY - touchStartY);
            if (deltaY > 30) isSwiping = false;
        }, { passive: true });
        
        formCard.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const touchEndX = e.changedTouches[0].screenX;
            const deltaX = touchEndX - touchStartX;
            
            if (deltaX < -50 && currentStep < totalSteps) {
                haptic(20);
                goToStep(currentStep + 1);
            }
            
            if (deltaX > 50 && currentStep > 1) {
                haptic(20);
                goToStep(currentStep - 1);
            }
            
            isSwiping = false;
        }, { passive: true });
    }
    
    const swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML = `
        <span>👈</span>
        <span>Geser untuk navigasi</span>
        <span class="swipe-hint-icon">👉</span>
    `;
    document.body.appendChild(swipeHint);
    
    setTimeout(() => {
        swipeHint.classList.add('show');
        setTimeout(() => swipeHint.classList.remove('show'), 4000);
    }, 3000);
}

// ============================================
// VALIDASI STEP
// ============================================
function validateStep(step) {
    if (step === 1) {
        const nama = document.getElementById('nama').value.trim();
        const kelas = document.getElementById('kelas').value;
        const nisn = document.getElementById('nisn').value.trim();
        const tempatLahir = document.getElementById('tempatLahir').value.trim();
        const tanggalLahir = document.getElementById('tanggalLahir').value;
        
        if (!nama || nama.length < 3) {
            showToast('Nama minimal 3 karakter!', 'error');
            shakeElement(document.getElementById('nama'));
            return false;
        }
        if (!kelas) {
            showToast('Pilih kelas terlebih dahulu!', 'error');
            shakeElement(document.getElementById('kelas'));
            return false;
        }
        if (!nisn) {
            showToast('NISN wajib diisi!', 'error');
            shakeElement(document.getElementById('nisn'));
            return false;
        }
        if (!tempatLahir) {
            showToast('Isi tempat lahir!', 'error');
            shakeElement(document.getElementById('tempatLahir'));
            return false;
        }
        if (!tanggalLahir) {
            showToast('Isi tanggal lahir!', 'error');
            shakeElement(document.getElementById('tanggalLahir'));
            return false;
        }
        return true;
    }
    
    if (step === 2) {
        const alamat = document.getElementById('alamat').value.trim();
        const agama = document.getElementById('agama').value;
        
        if (!alamat) {
            showToast('Alamat wajib diisi!', 'error');
            shakeElement(document.getElementById('alamat'));
            return false;
        }
        if (!agama) {
            showToast('Pilih agama terlebih dahulu!', 'error');
            shakeElement(document.getElementById('agama'));
            return false;
        }
        return true;
    }
    
    if (step === 3) {
        if (!selectedFile) {
            showToast('Upload foto terlebih dahulu!', 'error');
            shakeElement(uploadArea);
            return false;
        }
        if (!document.getElementById('terms').checked) {
            showToast('Centang pernyataan terlebih dahulu!', 'error');
            shakeElement(document.querySelector('.checkbox-wrapper'));
            return false;
        }
        return true;
    }
    
    return true;
}

// ============================================
// SHAKE ANIMATION
// ============================================
function shakeElement(element) {
    haptic([50, 30, 50]);
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    
    if (!document.getElementById('shake-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shake-keyframes';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                20%, 40%, 60%, 80% { transform: translateX(8px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => { element.style.animation = ''; }, 500);
}

// ============================================
// FILE UPLOAD
// ============================================
uploadArea.addEventListener('click', (e) => {
    if (!previewContent.classList.contains('active')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });
});

uploadArea.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar!', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB!', 'error');
        return;
    }
    
    selectedFile = file;
    haptic([15, 30]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        fileName.textContent = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        uploadContent.classList.add('hidden');
        previewContent.classList.add('active');
    };
    reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    haptic(15);
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadContent.classList.remove('hidden');
    previewContent.classList.remove('active');
});

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ============================================
// INPUT VALIDATION VISUAL
// ============================================
if (isMobile) {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.trim();
            this.classList.remove('input-valid');
            
            let isValid = false;
            
            if (this.type === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            } else if (this.type === 'date') {
                isValid = value !== '';
            } else if (this.id === 'nama') {
                isValid = value.length >= 3;
            } else if (this.id === 'nisn') {
                isValid = value.length >= 3;
            } else if (this.id === 'alamat') {
                isValid = value.length >= 1;
            } else if (this.tagName === 'SELECT') {
                isValid = value !== '';
            } else {
                isValid = value.length >= 1;
            }
            
            if (isValid) {
                this.classList.add('input-valid');
                haptic(8);
            }
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                if (this.value !== '') {
                    this.classList.add('input-valid');
                    haptic(8);
                } else {
                    this.classList.remove('input-valid');
                }
            });
        }
    });
}

// ============================================
// AUTO-HIDE HEADER
// ============================================
if (isMobile) {
    const infoPanel = document.querySelector('.info-panel');
    let lastScrollY = 0;
    let headerHidden = false;
    let headerScrollTimer;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 200 && currentScrollY > lastScrollY && !headerHidden) {
            infoPanel?.classList.add('header-hidden');
            headerHidden = true;
        }
        
        if (currentScrollY < lastScrollY && headerHidden) {
            infoPanel?.classList.remove('header-hidden');
            headerHidden = false;
        }
        
        lastScrollY = currentScrollY;
        
        clearTimeout(headerScrollTimer);
        headerScrollTimer = setTimeout(() => {
            if (headerHidden) {
                infoPanel?.classList.remove('header-hidden');
                headerHidden = false;
            }
        }, 2000);
    }, { passive: true });
}

// ============================================
// PULL TO REFRESH
// ============================================
if (isMobile) {
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-indicator';
    pullIndicator.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 4V1M12 1L8 5M12 1L16 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    document.body.appendChild(pullIndicator);
    
    let pullStartY = 0;
    let pullCurrentY = 0;
    let isPulling = false;
    
    window.addEventListener('touchstart', (e) => {
        if (window.pageYOffset === 0) {
            pullStartY = e.touches[0].screenY;
            isPulling = true;
        }
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        pullCurrentY = e.touches[0].screenY;
        const deltaY = pullCurrentY - pullStartY;
        
        if (deltaY > 60 && deltaY < 150) {
            pullIndicator.classList.add('show');
        }
    }, { passive: true });
    
    window.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        const deltaY = pullCurrentY - pullStartY;
        
        if (deltaY > 100) {
            haptic(30);
            setTimeout(() => {
                pullIndicator.classList.remove('show');
                window.scrollTo({ top: 0, behavior: 'auto' });
            }, 500);
        } else {
            pullIndicator.classList.remove('show');
        }
        
        isPulling = false;
        pullCurrentY = 0;
    }, { passive: true });
}

// ============================================
// FORM SUBMIT
// ============================================
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    haptic([15, 30, 15, 30]);
    
    try {
        const base64Image = await convertToBase64(selectedFile);
        
        const formData = {
            nama: document.getElementById('nama').value.trim(),
            kelas: document.getElementById('kelas').value,
            nisn: document.getElementById('nisn').value.trim(),
            tempatLahir: document.getElementById('tempatLahir').value.trim(),
            tanggalLahir: document.getElementById('tanggalLahir').value,
            alamat: document.getElementById('alamat').value.trim(),
            agama: document.getElementById('agama').value,
            fotoBase64: base64Image,
            fotoName: selectedFile.name,
            fotoType: selectedFile.type,
            timestamp: new Date().toLocaleString('id-ID')
        };
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        startConfetti();
        
        setTimeout(() => {
            showModal();
            showToast('Data berhasil dikirim! 🎉', 'success');
            resetForm();
            try { localStorage.removeItem('formDraft'); } catch (e) {}
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function resetForm() {
    form.reset();
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadContent.classList.remove('hidden');
    previewContent.classList.remove('active');
    currentStep = 1;
    goToStep(1);
    
    document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
}

// ============================================
// CONFETTI
// ============================================
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

if (confettiCanvas) {
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
}

let confettiPieces = [];

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
        this.color = ['#ca8a04', '#dc2626', '#fde047', '#b91c1c', '#eab308'][Math.floor(Math.random() * 5)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1;
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation * Math.PI / 180);
        confettiCtx.fillStyle = this.color;
        confettiCtx.globalAlpha = 0.9;
        
        if (this.shape === 'circle') {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        } else {
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        confettiCtx.restore();
    }
}

function startConfetti() {
    if (!confettiCtx) return;
    
    confettiPieces = [];
    const count = isLowEnd ? 30 : (isMobile ? 60 : 150);
    
    for (let i = 0; i < count; i++) {
        confettiPieces.push(new ConfettiPiece());
    }
    
    let frames = 0;
    const maxFrames = isMobile ? 120 : 200;
    
    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiPieces.forEach(piece => {
            piece.update();
            piece.draw();
        });
        
        frames++;
        
        if (frames < maxFrames) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }
    
    animateConfetti();
}

// ============================================
// UI HELPERS
// ============================================
function showModal() {
    document.getElementById('successModal').classList.add('active');
    if (isMobile) haptic([20, 50, 20, 50, 20]);
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (isMobile) {
        if (type === 'error') haptic([30, 30, 30]);
        else if (type === 'success') haptic([15, 30, 15]);
    }
    
    if (type === 'error') {
        toastIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    } else {
        toastIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// ============================================
// INPUT ENHANCEMENTS
// ============================================
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.parentElement.classList.remove('focused');
    });
    
    input.addEventListener('input', function() {
        this.style.animation = '';
    });
});

document.getElementById('nisn').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
});

// ============================================
// AUTO-SAVE DRAFT
// ============================================
if (isMobile) {
    const formFields = ['nama', 'kelas', 'nisn', 'tempatLahir', 'tanggalLahir', 'alamat', 'agama'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', () => {
                try {
                    const savedData = JSON.parse(localStorage.getItem('formDraft') || '{}');
                    savedData[fieldId] = field.value;
                    localStorage.setItem('formDraft', JSON.stringify(savedData));
                } catch (e) {}
            });
        }
    });
    
    try {
        const savedData = JSON.parse(localStorage.getItem('formDraft') || '{}');
        Object.keys(savedData).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && savedData[fieldId]) {
                field.value = savedData[fieldId];
                field.classList.add('input-valid');
            }
        });
    } catch (e) {}
}

// ============================================
// FLOATING TIPS
// ============================================
if (isMobile) {
    const tipElement = document.createElement('div');
    tipElement.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #fef9c3, #ffffff);
        border: 1px solid rgba(202, 138, 4, 0.4);
        padding: 10px 20px;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #7f1d1d;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.25);
        z-index: 999;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(tipElement);
    
    function showTip(text) {
        tipElement.textContent = text;
        tipElement.style.transform = 'translateX(-50%) translateY(0)';
        tipElement.style.opacity = '1';
        
        setTimeout(() => {
            tipElement.style.transform = 'translateX(-50%) translateY(100px)';
            tipElement.style.opacity = '0';
        }, 3000);
    }
    
    let lastStep = 1;
    setInterval(() => {
        if (currentStep !== lastStep) {
            lastStep = currentStep;
            const stepTips = {
                1: '✨ Isi data diri Anda dengan lengkap',
                2: '📍 Masukkan alamat & agama',
                3: '📸 Upload foto dengan seragam putih abu-abu'
            };
            showTip(stepTips[currentStep]);
        }
    }, 500);
}

// ============================================
// SMART SCROLL
// ============================================
if (isMobile) {
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => {
                const rect = this.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const keyboardHeight = 300;
                const availableHeight = viewportHeight - keyboardHeight;
                
                if (rect.bottom > availableHeight) {
                    const scrollAmount = rect.bottom - availableHeight + 30;
                    window.scrollBy({ top: scrollAmount, behavior: 'auto' });
                }
            }, 300);
        });
    });
}

// ============================================
// PREVENT DOUBLE-TAP ZOOM
// ============================================
if (isTouchDevice) {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

// ============================================
// ORIENTATION CHANGE
// ============================================
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeCanvas();
        resizeConfetti();
        initParticles();
        window.scrollTo({ top: window.scrollY, behavior: 'auto' });
    }, 300);
});

// ============================================
// DIAMOND PARTICLES - ADD MORE ON MOBILE
// ============================================
if (isMobile) {
    const backgroundEl = document.querySelector('.background');
    if (backgroundEl) {
        const existingDiamonds = document.querySelectorAll('.diamond-particle');
        const targetCount = 5;
        const currentCount = existingDiamonds.length;
        
        if (currentCount < targetCount) {
            const colors = [
                'linear-gradient(135deg, #fde047, #dc2626)',
                'linear-gradient(135deg, #dc2626, #fde047)',
                'linear-gradient(135deg, #ca8a04, #b91c1c)',
                'linear-gradient(135deg, #eab308, #991b1b)',
                'linear-gradient(135deg, #facc15, #7f1d1d)'
            ];
            
            const positions = [
                { x: '12%', d: '22s' },
                { x: '35%', d: '28s' },
                { x: '55%', d: '25s' },
                { x: '75%', d: '30s' },
                { x: '90%', d: '24s' }
            ];
            
            for (let i = currentCount; i < targetCount; i++) {
                const diamond = document.createElement('div');
                diamond.className = 'diamond-particle';
                diamond.style.setProperty('--x', positions[i].x);
                diamond.style.setProperty('--d', positions[i].d);
                diamond.style.background = colors[i % colors.length];
                backgroundEl.appendChild(diamond);
            }
            
            console.log(`💎 Added ${targetCount - currentCount} diamond particles`);
        }
    }
}

// ============================================
// PERFORMANCE MONITOR
// ============================================
if (isMobile) {
    let frameCount = 0;
    let lastCheck = performance.now();
    let particleDisabled = false;
    
    function monitorPerformance() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastCheck >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastCheck = now;
            
            // Jika FPS rendah, disable particles
            if (fps < 20 && !particleDisabled && particleCanvas) {
                console.log('⚠️ Low FPS (' + fps + '), disabling particles');
                particleCanvas.style.display = 'none';
                if (particleAnimationId) {
                    cancelAnimationFrame(particleAnimationId);
                    particleAnimationId = null;
                }
                particleDisabled = true;
                return;
            }
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    // Monitor setelah 8 detik
    setTimeout(monitorPerformance, 8000);
}

// ============================================
// INITIALIZE
// ============================================
updateClock();

console.log('✅ Mobile Particle Edition loaded:', {
    device: isOppo ? 'OPPO' : (isAndroid ? 'Android' : 'Mobile'),
    mode: isLowEnd ? 'LOW-END' : (isMobile ? 'MOBILE' : 'DESKTOP'),
    particles: isMobile ? 'Active (24 FPS)' : 'Active (60 FPS)',
    diamonds: isMobile ? '5 diamond' : '3 diamond',
    features: 'All interactive features active'
});
